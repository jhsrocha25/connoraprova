
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, AuthContextType } from '@/lib/types';
import { mockUser } from '@/lib/data';
import { toast } from '@/components/ui/use-toast';

// Mock database of known devices and IPs
const knownDevices: Record<string, { deviceId: string; ip: string; lastLogin: Date }[]> = {
  [mockUser.email]: [
    { 
      deviceId: 'default-device-id', 
      ip: '127.0.0.1',
      lastLogin: new Date()
    }
  ]
};

// Mock database for failed login attempts
const failedLoginAttempts: Record<string, { count: number; lockUntil: Date | null }> = {};

// Mock database for verification codes
const verificationCodes: Record<string, { code: string; expiresAt: Date; verified: boolean }> = {};

// Mock database of compromised passwords (for demo)
const compromisedPasswords = ['password123', '123456', 'qwerty', 'admin123'];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Generate a device ID (simplified for demo)
const generateDeviceId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Generate a random verification code
const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Check if a device is known
const isKnownDevice = (email: string, deviceId: string, ip: string): boolean => {
  if (!knownDevices[email]) return false;
  
  return knownDevices[email].some(device => 
    device.deviceId === deviceId || device.ip === ip
  );
};

// Add device to known devices
const addKnownDevice = (email: string, deviceId: string, ip: string): void => {
  if (!knownDevices[email]) {
    knownDevices[email] = [];
  }
  
  // Only add if doesn't already exist
  if (!isKnownDevice(email, deviceId, ip)) {
    knownDevices[email].push({
      deviceId,
      ip,
      lastLogin: new Date()
    });
  }
};

// Check if account is locked
const isAccountLocked = (email: string): { locked: boolean; remainingTime: number } => {
  const record = failedLoginAttempts[email];
  
  if (!record || !record.lockUntil) {
    return { locked: false, remainingTime: 0 };
  }
  
  const now = new Date();
  const locked = record.lockUntil > now;
  const remainingTime = locked ? 
    Math.ceil((record.lockUntil.getTime() - now.getTime()) / 1000 / 60) : 0;
  
  return { locked, remainingTime };
};

// Check if a password is strong enough
const isStrongPassword = (password: string): { valid: boolean; reasons: string[] } => {
  const reasons: string[] = [];
  
  if (password.length < 12) {
    reasons.push('A senha deve ter no mínimo 12 caracteres');
  }
  
  if (!/[A-Z]/.test(password)) {
    reasons.push('A senha deve conter pelo menos uma letra maiúscula');
  }
  
  if (!/[a-z]/.test(password)) {
    reasons.push('A senha deve conter pelo menos uma letra minúscula');
  }
  
  if (!/[0-9]/.test(password)) {
    reasons.push('A senha deve conter pelo menos um número');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    reasons.push('A senha deve conter pelo menos um caractere especial');
  }
  
  if (compromisedPasswords.includes(password)) {
    reasons.push('Esta senha foi comprometida em vazamentos anteriores');
  }
  
  return { valid: reasons.length === 0, reasons };
};

// Record a failed login attempt
const recordFailedAttempt = (email: string): void => {
  if (!failedLoginAttempts[email]) {
    failedLoginAttempts[email] = { count: 0, lockUntil: null };
  }
  
  failedLoginAttempts[email].count += 1;
  
  const count = failedLoginAttempts[email].count;
  
  if (count >= 5) {
    // Lock for 30 minutes after 5 attempts
    const lockUntil = new Date();
    lockUntil.setMinutes(lockUntil.getMinutes() + 30);
    failedLoginAttempts[email].lockUntil = lockUntil;
    
    // Would send notification to admin here in a real implementation
    console.log(`ADMIN NOTIFICATION: Account ${email} locked for 30 minutes after 5 failed attempts`);
  } else if (count >= 3) {
    // Lock for 5 minutes after 3 attempts
    const lockUntil = new Date();
    lockUntil.setMinutes(lockUntil.getMinutes() + 5);
    failedLoginAttempts[email].lockUntil = lockUntil;
  }
};

// Reset failed login attempts
const resetFailedAttempts = (email: string): void => {
  if (failedLoginAttempts[email]) {
    failedLoginAttempts[email] = { count: 0, lockUntil: null };
  }
};

// Create a verification code for 2FA
const createVerificationCode = (email: string): string => {
  const code = generateVerificationCode();
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 5); // Valid for 5 minutes
  
  verificationCodes[email] = {
    code,
    expiresAt,
    verified: false
  };
  
  return code;
};

// Verify a 2FA code
const verifyCode = (email: string, code: string): boolean => {
  const record = verificationCodes[email];
  
  if (!record) return false;
  
  const valid = record.code === code && record.expiresAt > new Date() && !record.verified;
  
  if (valid) {
    // Mark as verified to prevent reuse
    verificationCodes[email].verified = true;
  }
  
  return valid;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string>('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string | null>(null);
  const [twoFactorPending, setTwoFactorPending] = useState(false);

  useEffect(() => {
    // Generate a device ID for this browser session
    const storedDeviceId = localStorage.getItem('deviceId');
    if (storedDeviceId) {
      setDeviceId(storedDeviceId);
    } else {
      const newDeviceId = generateDeviceId();
      setDeviceId(newDeviceId);
      localStorage.setItem('deviceId', newDeviceId);
    }

    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const sendVerificationCode = async (email: string): Promise<void> => {
    // In a real app, this would send an email with the code
    // For demo, we'll just log it
    const code = createVerificationCode(email);
    console.log(`Verification code for ${email}: ${code}`);
    
    setPendingVerificationEmail(email);
    setTwoFactorPending(true);
    
    toast({
      title: "Código de verificação enviado",
      description: `Um código de verificação foi enviado para ${email}. Por favor, verifique seu email.`,
    });
  };
  
  const verifyLoginCode = async (code: string): Promise<boolean> => {
    if (!pendingVerificationEmail) return false;
    
    const isValid = verifyCode(pendingVerificationEmail, code);
    
    if (isValid) {
      // This would complete the login process
      toast({
        title: "Verificação bem-sucedida",
        description: "Seu código foi verificado com sucesso.",
      });
      
      // Add the device to known devices
      addKnownDevice(pendingVerificationEmail, deviceId, '127.0.0.1'); // In a real app, you'd get the actual IP
      
      setTwoFactorPending(false);
      setPendingVerificationEmail(null);
      
      // Complete the login with mockUser for demo purposes
      if (pendingVerificationEmail === mockUser.email) {
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
      }
      
      return true;
    } else {
      toast({
        variant: 'destructive',
        title: "Código inválido",
        description: "O código fornecido é inválido ou expirou.",
      });
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if account is locked
      const { locked, remainingTime } = isAccountLocked(email);
      if (locked) {
        throw new Error(`Conta temporariamente bloqueada. Tente novamente em ${remainingTime} minutos.`);
      }
      
      // Simulate a login request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demonstration, use mockUser if email matches
      if (email === mockUser.email && password === '123456') {
        // Check if this device is known
        if (!isKnownDevice(email, deviceId, '127.0.0.1')) { // In a real app, get actual IP
          // Send verification code for 2FA
          await sendVerificationCode(email);
        } else {
          // Known device, proceed with login
          setUser(mockUser);
          localStorage.setItem('user', JSON.stringify(mockUser));
          resetFailedAttempts(email);
          
          toast({
            title: 'Login realizado com sucesso',
            description: `Bem-vindo de volta, ${mockUser.name}!`,
          });
        }
      } else {
        // Record failed attempt
        recordFailedAttempt(email);
        throw new Error('Credenciais inválidas');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast({
          variant: 'destructive',
          title: 'Erro ao fazer login',
          description: err.message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      // Simulating a logout request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser(null);
      localStorage.removeItem('user');
      toast({
        title: 'Logout realizado com sucesso',
        description: 'Você foi desconectado da sua conta.',
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast({
          variant: 'destructive',
          title: 'Erro ao fazer logout',
          description: err.message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if password is strong enough
      const { valid, reasons } = isStrongPassword(password);
      if (!valid) {
        throw new Error(`Senha não atende aos requisitos: ${reasons.join(', ')}`);
      }
      
      // Simulating a registration request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new user based on mockUser
      const newUser: User = {
        ...mockUser,
        id: Math.random().toString(36).substring(2, 9),
        name,
        email,
        joinedDate: new Date(),
      };
      
      // Send verification code for 2FA
      await sendVerificationCode(email);
      
      // The actual user creation will be completed after 2FA verification
      toast({
        title: 'Verificação necessária',
        description: `Por favor, verifique o código enviado para ${email} para completar o registro.`,
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast({
          variant: 'destructive',
          title: 'Erro ao registrar',
          description: err.message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulating a update request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (user) {
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        toast({
          title: 'Perfil atualizado com sucesso',
          description: 'Suas informações foram atualizadas.',
        });
      } else {
        throw new Error('Usuário não encontrado');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast({
          variant: 'destructive',
          title: 'Erro ao atualizar perfil',
          description: err.message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        register,
        updateProfile,
        isAuthenticated: !!user,
        twoFactorPending,
        verifyLoginCode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
