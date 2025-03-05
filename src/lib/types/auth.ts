
import { User } from './user';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  twoFactorPending: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  registerWithGoogle: (googleUserData: { name: string; email: string; imageUrl?: string }) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  verifyLoginCode: (code: string) => Promise<boolean>;
  updatePaymentStatus: (status: 'pending' | 'completed' | 'failed') => Promise<void>;
}
