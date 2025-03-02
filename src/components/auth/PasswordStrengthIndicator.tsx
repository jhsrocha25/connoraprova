
import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
  passwordErrors: string[];
}

const PasswordStrengthIndicator = ({ password, passwordErrors }: PasswordStrengthIndicatorProps) => {
  if (!password) return null;
  
  return (
    <div className="mt-2 space-y-2">
      <p className="text-xs font-medium">Sua senha deve ter:</p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        <li className="text-xs flex items-center">
          {password.length >= 12 ? 
            <Check className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" /> : 
            <X className="h-3 w-3 text-destructive mr-1 flex-shrink-0" />
          }
          <span className="truncate">Mínimo de 12 caracteres</span>
        </li>
        <li className="text-xs flex items-center">
          {/[A-Z]/.test(password) ? 
            <Check className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" /> : 
            <X className="h-3 w-3 text-destructive mr-1 flex-shrink-0" />
          }
          <span className="truncate">Pelo menos uma maiúscula</span>
        </li>
        <li className="text-xs flex items-center">
          {/[a-z]/.test(password) ? 
            <Check className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" /> : 
            <X className="h-3 w-3 text-destructive mr-1 flex-shrink-0" />
          }
          <span className="truncate">Pelo menos uma minúscula</span>
        </li>
        <li className="text-xs flex items-center">
          {/[0-9]/.test(password) ? 
            <Check className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" /> : 
            <X className="h-3 w-3 text-destructive mr-1 flex-shrink-0" />
          }
          <span className="truncate">Pelo menos um número</span>
        </li>
        <li className="text-xs flex items-center">
          {/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 
            <Check className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" /> : 
            <X className="h-3 w-3 text-destructive mr-1 flex-shrink-0" />
          }
          <span className="truncate">Pelo menos um símbolo</span>
        </li>
      </ul>
    </div>
  );
};

export default PasswordStrengthIndicator;
