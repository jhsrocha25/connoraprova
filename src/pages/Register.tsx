
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import RegistrationForm from '@/components/auth/RegistrationForm';
import VerificationForm from '@/components/auth/VerificationForm';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [concurso, setConcurso] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const { register, loading, error, twoFactorPending, verifyLoginCode } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = re.test(email);
    setEmailValid(email ? isValid : null);
    return isValid;
  };

  const validatePassword = (password: string) => {
    const errors = [];
    
    if (password.length < 12) {
      errors.push('Mínimo de 12 caracteres');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Pelo menos uma letra maiúscula');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Pelo menos uma letra minúscula');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (twoFactorPending) {
      const success = await verifyLoginCode(verificationCode);
      if (success) {
        navigate('/');
      }
      return;
    }
    
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
      await register(name, email, password);
    } catch (err) {
      console.error("Erro ao registrar:", err);
    }
  };

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
            <CardTitle>
              {twoFactorPending ? "Verificação em Duas Etapas" : "Criar Conta"}
            </CardTitle>
            <CardDescription>
              {twoFactorPending
                ? "Digite o código de verificação enviado ao seu email"
                : "Preencha seus dados para criar uma nova conta"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="p-3 mb-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-md text-sm flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                {error}
              </div>
            )}
            
            {twoFactorPending ? (
              <VerificationForm
                verificationCode={verificationCode}
                setVerificationCode={setVerificationCode}
                onSubmit={handleSubmit}
                loading={loading}
                error={error}
              />
            ) : (
              <RegistrationForm
                name={name}
                setName={setName}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                dateOfBirth={dateOfBirth}
                setDateOfBirth={setDateOfBirth}
                concurso={concurso}
                setConcurso={setConcurso}
                acceptTerms={acceptTerms}
                setAcceptTerms={setAcceptTerms}
                loading={loading}
                error={error}
                onSubmit={handleSubmit}
                validateEmail={validateEmail}
                handlePasswordChange={handlePasswordChange}
                passwordErrors={passwordErrors}
                emailValid={emailValid}
                handleGoogleLogin={handleGoogleLogin}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
