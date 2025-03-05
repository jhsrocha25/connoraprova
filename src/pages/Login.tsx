
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { EyeIcon, EyeOffIcon, Loader2, KeyRound } from 'lucide-react';
import { useAuth } from '@/contexts/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error, twoFactorPending, verifyLoginCode } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (twoFactorPending) {
      const success = await verifyLoginCode(verificationCode);
      if (success) {
        navigate('/');
      }
    } else {
      await login(email, password);
      // No navigation here - we wait for 2FA if needed
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link 
            to="/" 
            className="text-2xl font-bold tracking-tight hover:opacity-80 transition-opacity"
          >
            QuizMentor
          </Link>
          <p className="text-muted-foreground mt-1">Entre na sua conta para continuar</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{twoFactorPending ? "Verificação em Duas Etapas" : "Entrar"}</CardTitle>
            <CardDescription>
              {twoFactorPending 
                ? "Digite o código de verificação enviado ao seu email" 
                : "Entre com suas credenciais para acessar sua conta"}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md text-sm">
                  {error}
                </div>
              )}
              
              {twoFactorPending ? (
                <div className="space-y-2">
                  <Label htmlFor="verificationCode">Código de Verificação</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="verificationCode"
                      type="text"
                      placeholder="Digite o código de 6 dígitos"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="pl-10"
                      maxLength={6}
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    O código é válido por 5 minutos e só pode ser usado uma vez.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password">Senha</Label>
                      <Link 
                        to="#" 
                        className="text-xs text-primary hover:underline"
                      >
                        Esqueceu a senha?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                  </div>
                </>
              )}
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {twoFactorPending ? "Verificar" : "Entrar"}
              </Button>
              
              {!twoFactorPending && (
                <div className="text-center text-sm">
                  Não tem uma conta?{' '}
                  <Link 
                    to="/register" 
                    className="text-primary font-medium hover:underline"
                  >
                    Cadastre-se
                  </Link>
                </div>
              )}
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
