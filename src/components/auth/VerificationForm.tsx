
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, Loader2 } from 'lucide-react';

interface VerificationFormProps {
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: string | null;
}

const VerificationForm = ({ 
  verificationCode, 
  setVerificationCode, 
  onSubmit, 
  loading, 
  error 
}: VerificationFormProps) => {
  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="space-y-3">
        <Label htmlFor="verificationCode" className="text-sm md:text-base">Código de Verificação</Label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="verificationCode"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Digite o código de 6 dígitos"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="pl-10 text-base md:text-sm h-12 md:h-10"
            maxLength={6}
            required
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          O código é válido por 5 minutos e só pode ser usado uma vez.
        </p>
      </div>

      <div className="mt-6">
        <Button 
          type="submit" 
          className="w-full h-12 md:h-10 text-base md:text-sm" 
          disabled={loading}
        >
          {loading && <Loader2 className="mr-2 h-5 w-5 md:h-4 md:w-4 animate-spin" />}
          Verificar
        </Button>
      </div>
    </form>
  );
};

export default VerificationForm;
