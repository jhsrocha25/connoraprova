
import { User } from '@/lib/types';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  registerWithGoogle: (googleUserData: { name: string; email: string; imageUrl?: string }) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  twoFactorPending?: boolean;
  verifyLoginCode?: (code: string) => Promise<boolean>;
  updatePaymentStatus: (status: 'pending' | 'completed' | 'failed') => Promise<void>;
}

// Extend User type to include paymentStatus
export interface AuthUser extends User {
  paymentStatus?: 'pending' | 'completed' | 'failed';
}

// Types for verification and device tracking
export interface VerificationRecord {
  code: string;
  expiresAt: Date;
  verified: boolean;
}

export interface DeviceRecord {
  deviceId: string;
  ip: string;
  lastLogin: Date;
}

export interface FailedLoginRecord {
  count: number;
  lockUntil: Date | null;
}

export interface PasswordValidationResult {
  valid: boolean;
  reasons: string[];
}

export interface AccountLockStatus {
  locked: boolean;
  remainingTime: number;
}
