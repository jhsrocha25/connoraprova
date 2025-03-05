
import { toast } from '@/hooks/use-toast';
import { mockUser } from '@/lib/data';
import { AuthUser } from './authTypes';
import { 
  isAccountLocked, 
  isStrongPassword, 
  recordFailedAttempt, 
  resetFailedAttempts, 
  createVerificationCode, 
  addKnownDevice, 
  isKnownDevice, 
  verifyCode 
} from './authUtils';

// Auth operations - functionality for login, register, etc.
export const performLogin = async (
  email: string, 
  password: string, 
  deviceId: string,
  sendVerificationCode: (email: string) => Promise<void>,
  setUser: (user: AuthUser | null) => void,
  setError: (error: string | null) => void
): Promise<boolean> => {
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
        return false; // Indicate 2FA is needed
      } else {
        // Known device, proceed with login
        setUser(mockUser as AuthUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        resetFailedAttempts(email);
        
        toast({
          title: 'Login realizado com sucesso',
          description: `Bem-vindo de volta, ${mockUser.name}!`,
        });
        return true; // Login completed
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
    return false;
  }
};

export const performLogout = async (
  setUser: (user: AuthUser | null) => void,
  setError: (error: string | null) => void
): Promise<boolean> => {
  try {
    // Simulating a logout request
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: 'Logout realizado com sucesso',
      description: 'Você foi desconectado da sua conta.',
    });
    return true;
  } catch (err) {
    if (err instanceof Error) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Erro ao fazer logout',
        description: err.message,
      });
    }
    return false;
  }
};

export const performRegistration = async (
  name: string, 
  email: string, 
  password: string,
  setPendingUserData: (data: {name: string, email: string} | null) => void,
  sendVerificationCode: (email: string) => Promise<void>,
  setError: (error: string | null) => void
): Promise<boolean> => {
  try {
    // Check if password is strong enough
    const { valid, reasons } = isStrongPassword(password);
    if (!valid) {
      throw new Error(`Senha não atende aos requisitos: ${reasons.join(', ')}`);
    }
    
    // Simulating a registration request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Store pending user data for completion after verification
    setPendingUserData({ name, email });
    
    // Always send verification code for registration - mandatory 2FA
    await sendVerificationCode(email);
    
    // The actual user creation will be completed after 2FA verification
    toast({
      title: 'Verificação necessária',
      description: `Por favor, verifique o código enviado para ${email} para completar o registro.`,
    });
    
    return true;
  } catch (err) {
    if (err instanceof Error) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Erro ao registrar',
        description: err.message,
      });
    }
    return false;
  }
};

export const performGoogleRegistration = async (
  googleUserData: { name: string; email: string; imageUrl?: string },
  deviceId: string,
  setUser: (user: AuthUser | null) => void,
  setError: (error: string | null) => void
): Promise<boolean> => {
  try {
    // Simulating a registration request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    if (googleUserData.email === mockUser.email) {
      // User exists, log them in
      setUser(mockUser as AuthUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      toast({
        title: 'Login realizado com sucesso',
        description: `Bem-vindo de volta, ${mockUser.name}!`,
      });
    } else {
      // Create a new user based on Google data
      const newUser: AuthUser = {
        ...mockUser,
        id: Math.random().toString(36).substring(2, 9),
        name: googleUserData.name,
        email: googleUserData.email,
        avatar: googleUserData.imageUrl,
        joinedDate: new Date(),
        paymentStatus: 'pending'
      };
      
      // Store user in localStorage
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      // Add the device to known devices
      addKnownDevice(googleUserData.email, deviceId, '127.0.0.1');
      
      toast({
        title: 'Cadastro realizado com sucesso',
        description: `Bem-vindo, ${googleUserData.name}!`,
      });
    }
    return true;
  } catch (err) {
    if (err instanceof Error) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Erro ao fazer cadastro com Google',
        description: err.message,
      });
    }
    return false;
  }
};

export const performProfileUpdate = async (
  user: AuthUser | null,
  data: Partial<AuthUser>,
  setUser: (user: AuthUser | null) => void,
  setError: (error: string | null) => void
): Promise<boolean> => {
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
      return true;
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
    return false;
  }
};

export const updateUserPaymentStatus = async (
  user: AuthUser | null,
  status: 'pending' | 'completed' | 'failed',
  setUser: (user: AuthUser | null) => void
): Promise<void> => {
  if (!user) return;
  
  const updatedUser = {
    ...user,
    paymentStatus: status
  };
  
  setUser(updatedUser);
  localStorage.setItem('user', JSON.stringify(updatedUser));
  
  if (status === 'completed') {
    // Enviar e-mail de confirmação de pagamento
    sendPaymentConfirmationEmail(user.email);
    
    toast({
      title: "Pagamento confirmado",
      description: "Seu pagamento foi confirmado e um e-mail de confirmação foi enviado.",
    });
  }
};

export const completeVerification = (
  pendingVerificationEmail: string | null,
  pendingUserData: {name: string, email: string} | null,
  deviceId: string,
  setUser: (user: AuthUser | null) => void,
  setPendingUserData: (data: {name: string, email: string} | null) => void,
  setPendingVerificationEmail: (email: string | null) => void
): void => {
  // Add the device to known devices
  if (pendingVerificationEmail) {
    addKnownDevice(pendingVerificationEmail, deviceId, '127.0.0.1');
  }
  
  // Complete the login with mockUser for existing users
  if (pendingVerificationEmail === mockUser.email) {
    setUser(mockUser as AuthUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  } else if (pendingUserData) {
    // Create a new user based on the pending registration data
    const newUser: AuthUser = {
      ...mockUser,
      id: Math.random().toString(36).substring(2, 9),
      name: pendingUserData.name,
      email: pendingUserData.email,
      joinedDate: new Date(),
      paymentStatus: 'pending' // Mark as payment pending for new users
    };
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    setPendingUserData(null);
  }
  
  setPendingVerificationEmail(null);
};

export const sendPaymentConfirmationEmail = async (email: string): Promise<void> => {
  // Simulação de envio de e-mail (em um ambiente real, aqui seria integrado com um serviço de e-mail)
  console.log(`Enviando e-mail de confirmação de pagamento para ${email}`);
  
  // Em um ambiente de desenvolvimento, vamos simular o envio
  toast({
    title: "E-mail enviado",
    description: `Um e-mail de confirmação foi enviado para ${email}.`,
  });
};

export const verifyLoginCodeOperation = async (
  code: string,
  pendingVerificationEmail: string | null,
  pendingUserData: {name: string, email: string} | null,
  deviceId: string,
  setUser: (user: AuthUser | null) => void,
  setPendingUserData: (data: {name: string, email: string} | null) => void,
  setPendingVerificationEmail: (email: string | null) => void,
  setTwoFactorPending: (pending: boolean) => void
): Promise<boolean> => {
  if (!pendingVerificationEmail) return false;
  
  const isValid = verifyCode(pendingVerificationEmail, code);
  
  if (isValid) {
    toast({
      title: "Verificação bem-sucedida",
      description: "Seu código foi verificado com sucesso.",
    });
    
    setTwoFactorPending(false);
    
    completeVerification(
      pendingVerificationEmail,
      pendingUserData,
      deviceId,
      setUser,
      setPendingUserData,
      setPendingVerificationEmail
    );
    
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
