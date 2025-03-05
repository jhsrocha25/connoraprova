
import { VerificationRecord, DeviceRecord, FailedLoginRecord, PasswordValidationResult, AccountLockStatus } from './authTypes';

// Mock databases
const knownDevices: Record<string, DeviceRecord[]> = {};
const failedLoginAttempts: Record<string, FailedLoginRecord> = {};
const verificationCodes: Record<string, VerificationRecord> = {};

// Mock database of compromised passwords (for demo)
const compromisedPasswords = ['password123', '123456', 'qwerty', 'admin123'];

// Generate a device ID (simplified for demo)
export const generateDeviceId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Generate a random verification code
export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Check if a device is known
export const isKnownDevice = (email: string, deviceId: string, ip: string): boolean => {
  if (!knownDevices[email]) return false;
  
  return knownDevices[email].some(device => 
    device.deviceId === deviceId || device.ip === ip
  );
};

// Add device to known devices
export const addKnownDevice = (email: string, deviceId: string, ip: string): void => {
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
export const isAccountLocked = (email: string): AccountLockStatus => {
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
export const isStrongPassword = (password: string): PasswordValidationResult => {
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
export const recordFailedAttempt = (email: string): void => {
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
export const resetFailedAttempts = (email: string): void => {
  if (failedLoginAttempts[email]) {
    failedLoginAttempts[email] = { count: 0, lockUntil: null };
  }
};

// Create a verification code for 2FA
export const createVerificationCode = (email: string): string => {
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
export const verifyCode = (email: string, code: string): boolean => {
  const record = verificationCodes[email];
  
  if (!record) return false;
  
  const valid = record.code === code && record.expiresAt > new Date() && !record.verified;
  
  if (valid) {
    // Mark as verified to prevent reuse
    verificationCodes[email].verified = true;
  }
  
  return valid;
};
