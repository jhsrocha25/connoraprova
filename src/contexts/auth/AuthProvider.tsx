
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AuthContextType, AuthUser } from './authTypes';
import { generateDeviceId, createVerificationCode } from './authUtils';
import { 
  performLogin, 
  performLogout, 
  performRegistration, 
  performGoogleRegistration, 
  performProfileUpdate, 
  updateUserPaymentStatus,
  verifyLoginCodeOperation,
  sendPaymentConfirmationEmail
} from './authOperations';
import { toast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string>('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string | null>(null);
  const [twoFactorPending, setTwoFactorPending] = useState(false);
  const [pendingUserData, setPendingUserData] = useState<{name: string, email: string} | null>(null);

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
    
    // Simulação de envio de e-mail (em um ambiente real, aqui seria integrado com um serviço de e-mail)
    // Por exemplo: await emailService.send(email, 'Código de verificação', `Seu código é: ${code}`);
    
    // Em um ambiente de desenvolvimento, vamos simular o envio mostrando o código para facilitar os testes
    toast({
      title: "Código de verificação enviado",
      description: `Um código de verificação foi enviado para ${email}. Para fins de teste, o código é: ${code}`,
    });
  };
  
  const verifyLoginCode = async (code: string): Promise<boolean> => {
    setLoading(true);
    try {
      const result = await verifyLoginCodeOperation(
        code,
        pendingVerificationEmail,
        pendingUserData,
        deviceId,
        setUser,
        setPendingUserData,
        setPendingVerificationEmail,
        setTwoFactorPending
      );
      return result;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await performLogin(
        email, 
        password, 
        deviceId,
        sendVerificationCode,
        setUser,
        setError
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await performLogout(setUser, setError);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await performRegistration(
        name, 
        email, 
        password,
        setPendingUserData,
        sendVerificationCode,
        setError
      );
    } finally {
      setLoading(false);
    }
  };

  const registerWithGoogle = async (googleUserData: { name: string; email: string; imageUrl?: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      await performGoogleRegistration(
        googleUserData,
        deviceId,
        setUser,
        setError
      );
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<AuthUser>) => {
    setLoading(true);
    setError(null);
    
    try {
      await performProfileUpdate(user, data, setUser, setError);
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (status: 'pending' | 'completed' | 'failed'): Promise<void> => {
    await updateUserPaymentStatus(user, status, setUser);
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
        registerWithGoogle,
        updateProfile,
        isAuthenticated: !!user,
        twoFactorPending,
        verifyLoginCode,
        updatePaymentStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
