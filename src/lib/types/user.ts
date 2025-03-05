
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'premium' | 'admin';
  joinedDate: Date;
  lastLogin?: Date;
  preferences?: UserPreferences;
  paymentStatus?: 'pending' | 'completed' | 'failed';
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  emailNotifications?: boolean;
}
