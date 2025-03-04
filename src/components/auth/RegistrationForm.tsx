import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EyeIcon, EyeOffIcon, Loader2, Check, X, Mail, Lock, Calendar, User, AlertTriangle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import { toast } from '@/hooks/use-toast';
import GoogleAuthButton from './GoogleAuthButton';

interface RegistrationFormProps {
  name: string;
  setName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  dateOfBirth: string;
  setDateOfBirth: (value: string) => void;
  concurso: string;
  setConcurso: (value: string) => void;
  acceptTerms: boolean;
  setAcceptTerms: (value: boolean) => void;
  loading: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent) => void;
  validateEmail: (email: string) => boolean;
  handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  passwordErrors: string[];
  emailValid: boolean | null;
  handleGoogleLogin: () => void;
}

const RegistrationForm = ({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  dateOfBirth,
  setDateOfBirth,
  concurso,
  setConcurso,
  acceptTerms,
  setAcceptTerms,
  loading,
  error,
  onSubmit,
  validateEmail,
  handlePasswordChange,
  passwordErrors,
  emailValid,
  handleGoogleLogin
}: RegistrationFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (newEmail) {
      validateEmail(newEmail);
    }
  };
  
  const concursosInteresse = [
    { value: "inss", label: "INSS" },
    { value: "pf", label: "Polícia Federal" },
    { value: "prf", label: "Polícia Rodoviária Federal" },
    { value: "trt", label: "Tribunal Regional do Trabalho" },
    { value: "mpu", label: "Ministério Público da União" },
    { value: "tjsp", label: "Tribunal de Justiça de SP" },
  ];

  const handleGoogleSuccess = () => {
    navigate('/');
  };

  return (
    <form onSubmit={onSubmit}>
      {error && (
        <div className="p-3 mb-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-md text-sm flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2" />
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome completo <span className="text-destructive">*</span></Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              placeholder="Seu nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={handleEmailChange}
              className={`pl-10 ${emailValid === false ? 'border-destructive focus-visible:ring-destructive' : ''} ${emailValid === true ? 'border-green-500 focus-visible:ring-green-500' : ''}`}
              required
            />
            {emailValid !== null && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {emailValid ? 
                  <Check className="h-4 w-4 text-green-500" /> : 
                  <X className="h-4 w-4 text-destructive" />
                }
              </div>
            )}
          </div>
          {emailValid === false && (
            <p className="text-xs text-destructive mt-1">
              Por favor, insira um email válido
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Data de nascimento <span className="text-destructive">*</span></Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="dateOfBirth"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="concurso">Concurso de interesse (opcional)</Label>
          <Select value={concurso} onValueChange={setConcurso}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um concurso" />
            </SelectTrigger>
            <SelectContent>
              {concursosInteresse.map(concurso => (
                <SelectItem key={concurso.value} value={concurso.value}>
                  {concurso.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Senha <span className="text-destructive">*</span></Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={handlePasswordChange}
              className={`pl-10 ${password && passwordErrors.length > 0 ? 'border-destructive focus-visible:ring-destructive' : ''} ${password && passwordErrors.length === 0 ? 'border-green-500 focus-visible:ring-green-500' : ''}`}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3"
              onClick={toggleShowPassword}
            >
              {showPassword ? 
                <EyeOffIcon className="h-4 w-4 text-muted-foreground" /> : 
                <EyeIcon className="h-4 w-4 text-muted-foreground" />
              }
            </Button>
          </div>
          
          <PasswordStrengthIndicator password={password} passwordErrors={passwordErrors} />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar senha <span className="text-destructive">*</span></Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`pl-10 ${confirmPassword && password !== confirmPassword ? 'border-destructive focus-visible:ring-destructive' : ''} ${confirmPassword && password === confirmPassword && password.length > 0 ? 'border-green-500 focus-visible:ring-green-500' : ''}`}
              required
            />
            {confirmPassword && password !== confirmPassword && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <X className="h-4 w-4 text-destructive" />
              </div>
            )}
            {confirmPassword && password === confirmPassword && password.length > 0 && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Check className="h-4 w-4 text-green-500" />
              </div>
            )}
          </div>
          {confirmPassword && password !== confirmPassword && (
            <p className="text-xs text-destructive mt-1">As senhas não correspondem</p>
          )}
        </div>
        
        <div className="flex items-start space-x-2 pt-2">
          <Checkbox 
            id="terms" 
            checked={acceptTerms}
            onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
          />
          <Label htmlFor="terms" className="text-sm leading-tight cursor-pointer">
            Eu concordo com os <Link to="/terms" className="text-primary hover:underline">Termos de Uso</Link> e <Link to="/privacy" className="text-primary hover:underline">Política de Privacidade</Link> <span className="text-destructive">*</span>
          </Label>
        </div>
      </div>
      
      <div className="mt-6 space-y-4">
        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading || !acceptTerms}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Criar conta
        </Button>
        
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-muted" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">ou continue com</span>
          </div>
        </div>
        
        <GoogleAuthButton onSuccess={handleGoogleSuccess} loading={loading} />
        
        <div className="text-center text-sm">
          Já tem uma conta?{' '}
          <Link 
            to="/login" 
            className="text-primary font-medium hover:underline"
          >
            Entrar
          </Link>
        </div>
        
        <div className="text-center text-xs text-muted-foreground">
          <Link to="/recovery" className="hover:underline">Esqueceu sua senha?</Link>
        </div>
        
        <div className="text-xs text-muted-foreground text-center mt-4">
          Ao se cadastrar, você concorda com nossa política de privacidade e termos de uso.
          Seus dados serão tratados com segurança e confidencialidade.
        </div>
      </div>
    </form>
  );
};

export default RegistrationForm;
