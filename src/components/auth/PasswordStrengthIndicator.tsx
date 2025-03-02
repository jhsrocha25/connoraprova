
import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
  passwordErrors: string[];
}

const PasswordStrengthIndicator = ({ password, passwordErrors }: PasswordStrengthIndicatorProps) => {
  if (!password) return null;
  
  return (
    <div className="mt-2 space-y-1">
      <p className="text-xs font-medium">Sua senha deve ter:</p>
      <ul className="space-y-1">
        <li className="text-xs flex items-center">
          {password.length >= 12 ? 
            <Check className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" /> : 
            <X className="h-3 w-3 text-destructive mr-1 flex-shrink-0" />
          }
          Mínimo de 12 caracteres
        </li>
        <li className="text-xs flex items-center">
          {/[A-Z]/.test(password) ? 
            <Check className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" /> : 
            <X className="h-3 w-3 text-destructive mr-1 flex-shrink-0" />
          }
          Pelo menos uma letra maiúscula
        </li>
        <li className="text-xs flex items-center">
          {/[a-z]/.test(password) ? 
            <Check className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" /> : 
            <X className="h-3 w-3 text-destructive mr-1 flex-shrink-0" />
          }
          Pelo menos uma letra minúscula
        </li>
        <li className="text-xs flex items-center">
          {/[0-9]/.test(password) ? 
            <Check className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" /> : 
            <X className="h-3 w-3 text-destructive mr-1 flex-shrink-0" />
          }
          Pelo menos um número
        </li>
        <li className="text-xs flex items-center">
          {/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 
            <Check className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" /> : 
            <X className="h-3 w-3 text-destructive mr-1 flex-shrink-0" />
          }
          Pelo menos um símbolo
        </li>
      </ul>
    </div>
  );
};

export default PasswordStrengthIndicator;
