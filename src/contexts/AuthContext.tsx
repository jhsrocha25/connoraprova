
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, AuthContextType } from '@/lib/types';
import { mockUser } from '@/lib/data';
import { toast } from '@/components/ui/use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verificar se o usuário está no localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulando uma requisição de login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Para demonstração, vamos usar o mockUser se o email corresponder
      if (email === mockUser.email && password === '123456') {
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        toast({
          title: 'Login realizado com sucesso',
          description: `Bem-vindo de volta, ${mockUser.name}!`,
        });
      } else {
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
      // Simulando uma requisição de logout
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
      // Simulando uma requisição de registro
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Criar um novo usuário com base no mockUser
      const newUser: User = {
        ...mockUser,
        id: Math.random().toString(36).substring(2, 9),
        name,
        email,
        joinedDate: new Date(),
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      toast({
        title: 'Registro realizado com sucesso',
        description: `Bem-vindo, ${name}!`,
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
      // Simulando uma requisição de atualização
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
