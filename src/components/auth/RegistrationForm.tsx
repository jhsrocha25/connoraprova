
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EyeIcon, EyeOffIcon, Loader2, Check, X, Mail, Lock, Calendar, User, AlertTriangle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import { toast } from '@/hooks/use-toast';

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
        
        <Button 
          type="button" 
          variant="outline" 
          className="w-full" 
          onClick={handleGoogleLogin}
        >
          <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6,20H24v8h11.3c-1.1,5.2-5.5,8-11.3,8c-6.6,0-12-5.4-12-12s5.4-12,12-12c3.1,0,5.8,1.2,8,3.1 l6.1-6.1C33.7,4.6,29.1,2,24,2C12.4,2,3,11.4,3,23s9.4,21,21,21s21-9.4,21-21C45,22.6,44.5,21.3,43.6,20z"/>
            <path fill="#FF3D00" d="M6.3,13.7l7.1,5.3c1.8-4.8,6.3-8,11.6-8c3.1,0,5.8,1.2,8,3.1l6.1-6.1C33.7,4.6,29.1,2,24,2 C16.1,2,9.3,6.8,6.3,13.7z"/>
            <path fill="#4CAF50" d="M24,44c5,0,9.6-2.5,12.2-6.7l-6.7-5.3c-1.8,2.6-5.2,4-8.5,4c-5.8,0-10.2-4.8-11.3-10H3.1 C5.9,37.2,14.1,44,24,44z"/>
            <path fill="#1976D2" d="M43.6,20H24v8h11.3c-0.5,2.6-2,4.8-4.2,6.3l6.7,5.3c4.9-4.6,7.2-11.3,7.2-18.6C45,22.6,44.5,21.3,43.6,20z"/>
          </svg>
          Cadastrar com Google
        </Button>
        
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
      </div>
    </form>
  );
};

export default RegistrationForm;
