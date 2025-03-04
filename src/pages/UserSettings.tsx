import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EyeIcon, EyeOffIcon, Loader2, Save, Upload } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { usePayment } from '@/contexts/PaymentContext';
import PaymentMethods from '@/components/payment/PaymentMethods';
import SubscriptionManagement from '@/components/payment/SubscriptionManagement';
import PaymentHistory from '@/components/payment/PaymentHistory';

const UserSettings = () => {
  const { user, updateProfile, loading, isAuthenticated } = useAuth();
  const { subscription, paymentMethods, invoices } = usePayment();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  
  const [notifications, setNotifications] = useState({
    email: true,
    app: true,
    newMaterials: true,
    reminders: true
  });

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (user) {
      await updateProfile({
        ...user,
        name,
        email
      });
    }
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setPasswordError('As senhas não correspondem');
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    setPasswordError('');
    alert('Senha atualizada com sucesso (simulação)');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleNotificationUpdate = async () => {
    console.log('Notificações atualizadas:', notifications);
    alert('Preferências de notificação atualizadas (simulação)');
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container pt-24 pb-16">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Configurações da Conta</h1>
          
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="password">Senha</TabsTrigger>
              <TabsTrigger value="notifications">Notificações</TabsTrigger>
              <TabsTrigger value="payment">Pagamento</TabsTrigger>
              <TabsTrigger value="subscription">Assinatura</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Perfil</CardTitle>
                  <CardDescription>
                    Atualize suas informações pessoais e foto de perfil
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex flex-col items-center space-y-3">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="text-lg">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Alterar foto
                        </Button>
                      </div>
                      
                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Nome completo</Label>
                            <Input
                              id="name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="role">Função</Label>
                          <Input
                            id="role"
                            value={user.role === 'admin' ? 'Administrador' : 'Estudante'}
                            disabled
                            className="bg-muted"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="joinedDate">Membro desde</Label>
                          <Input
                            id="joinedDate"
                            value={new Date(user.joinedDate).toLocaleDateString()}
                            disabled
                            className="bg-muted"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="submit" disabled={loading}>
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Salvar alterações
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Alterar Senha</CardTitle>
                  <CardDescription>
                    Atualize sua senha de acesso à plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordUpdate} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Senha atual</Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
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
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">Nova senha</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          A senha deve ter pelo menos 6 caracteres
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                        <Input
                          id="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                        {passwordError && (
                          <p className="text-xs text-destructive">{passwordError}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        Atualizar senha
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Preferências de Notificação</CardTitle>
                  <CardDescription>
                    Configure como e quando deseja receber notificações
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Canais de Notificação</h3>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="emailNotifications">Notificações por email</Label>
                          <p className="text-sm text-muted-foreground">
                            Receba atualizações importantes por email
                          </p>
                        </div>
                        <Switch
                          id="emailNotifications"
                          checked={notifications.email}
                          onCheckedChange={(checked) => 
                            setNotifications({ ...notifications, email: checked })
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="appNotifications">Notificações no aplicativo</Label>
                          <p className="text-sm text-muted-foreground">
                            Receba notificações enquanto estiver usando a plataforma
                          </p>
                        </div>
                        <Switch
                          id="appNotifications"
                          checked={notifications.app}
                          onCheckedChange={(checked) => 
                            setNotifications({ ...notifications, app: checked })
                          }
                        />
                      </div>
                      
                      <Separator />
                      
                      <h3 className="text-lg font-medium">Tipos de Notificação</h3>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="newMaterialsNotifications">Novos materiais</Label>
                          <p className="text-sm text-muted-foreground">
                            Quando novos conteúdos forem adicionados aos concursos
                          </p>
                        </div>
                        <Switch
                          id="newMaterialsNotifications"
                          checked={notifications.newMaterials}
                          onCheckedChange={(checked) => 
                            setNotifications({ ...notifications, newMaterials: checked })
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="remindersNotifications">Lembretes de estudo</Label>
                          <p className="text-sm text-muted-foreground">
                            Lembretes para continuar seus estudos
                          </p>
                        </div>
                        <Switch
                          id="remindersNotifications"
                          checked={notifications.reminders}
                          onCheckedChange={(checked) => 
                            setNotifications({ ...notifications, reminders: checked })
                          }
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button onClick={handleNotificationUpdate}>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar preferências
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="payment">
              <Card>
                <CardHeader>
                  <CardTitle>Métodos de Pagamento</CardTitle>
                  <CardDescription>
                    Gerencie seus métodos de pagamento para assinaturas e compras
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PaymentMethods />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="subscription">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Gerenciamento de Assinatura</CardTitle>
                  <CardDescription>
                    Visualize e gerencie seu plano de assinatura atual
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SubscriptionManagement />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Pagamentos</CardTitle>
                  <CardDescription>
                    Visualize seu histórico de faturas e pagamentos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PaymentHistory />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default UserSettings;
