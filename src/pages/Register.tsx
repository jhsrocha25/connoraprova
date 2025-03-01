
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { EyeIcon, EyeOffIcon, Loader2, Check, X, Mail, Lock, Calendar, User, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [concurso, setConcurso] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = re.test(email);
    setEmailValid(email ? isValid : null);
    return isValid;
  };

  const validatePassword = (password: string) => {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('Mínimo de 8 caracteres');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Pelo menos uma letra maiúscula');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Pelo menos um número');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Pelo menos um símbolo');
    }
    
    setPasswordErrors(errors);
    return errors.length === 0;
  };

  const validatePasswords = () => {
    if (!validatePassword(password)) {
      return false;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Erro de validação",
        description: "As senhas não correspondem",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const handleGoogleLogin = () => {
    // Integration with Google login would be implemented here
    toast({
      title: "Login com Google",
      description: "Funcionalidade em desenvolvimento",
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (newEmail) {
      validateEmail(newEmail);
    } else {
      setEmailValid(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast({
        title: "Erro de validação",
        description: "Email inválido",
        variant: "destructive"
      });
      return;
    }
    
    if (!validatePasswords()) {
      return;
    }
    
    if (!dateOfBirth) {
      toast({
        title: "Erro de validação",
        description: "Data de nascimento é obrigatória",
        variant: "destructive"
      });
      return;
    }
    
    if (!acceptTerms) {
      toast({
        title: "Erro de validação",
        description: "Você precisa aceitar os termos de uso e política de privacidade",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Fix: Pass only the required arguments according to the AuthContext definition
      await register(name, email, password);
      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vindo ao Connor Aprova!",
      });
      navigate('/');
    } catch (err) {
      console.error("Erro ao registrar:", err);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  // Dados de exemplo para concursos de interesse
  const concursosInteresse = [
    { value: "inss", label: "INSS" },
    { value: "pf", label: "Polícia Federal" },
    { value: "prf", label: "Polícia Rodoviária Federal" },
    { value: "trt", label: "Tribunal Regional do Trabalho" },
    { value: "mpu", label: "Ministério Público da União" },
    { value: "tjsp", label: "Tribunal de Justiça de SP" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link 
            to="/" 
            className="text-2xl font-bold tracking-tight hover:opacity-80 transition-opacity"
          >
            Connor Aprova
          </Link>
          <p className="text-muted-foreground mt-1">Crie sua conta para começar</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Criar Conta</CardTitle>
            <CardDescription>
              Preencha seus dados para criar uma nova conta
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md text-sm flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  {error}
                </div>
              )}
              
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
                
                {password && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs font-medium">Sua senha deve ter:</p>
                    <ul className="space-y-1">
                      <li className="text-xs flex items-center">
                        {password.length >= 8 ? 
                          <Check className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" /> : 
                          <X className="h-3 w-3 text-destructive mr-1 flex-shrink-0" />
                        }
                        Mínimo de 8 caracteres
                      </li>
                      <li className="text-xs flex items-center">
                        {/[A-Z]/.test(password) ? 
                          <Check className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" /> : 
                          <X className="h-3 w-3 text-destructive mr-1 flex-shrink-0" />
                        }
                        Pelo menos uma letra maiúscula
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
                )}
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
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
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
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
