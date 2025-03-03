
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronLeft, MessageSquare, Clock } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Import the new component files
import DocumentManagement from '@/components/admin/DocumentManagement';
import UserManagement from '@/components/admin/UserManagement';
import ConcursoManagement from '@/components/admin/ConcursoManagement';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [aiChatEnabled, setAiChatEnabled] = useState(
    localStorage.getItem('adminAiChatEnabled') === 'true'
  );
  const [simulationModeEnabled, setSimulationModeEnabled] = useState(
    localStorage.getItem('adminSimulationModeEnabled') === 'true'
  );

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleAiChatToggle = (checked: boolean) => {
    setAiChatEnabled(checked);
    localStorage.setItem('adminAiChatEnabled', checked.toString());
    toast({
      title: checked ? "AI Chat Testing Enabled" : "AI Chat Testing Disabled",
      description: checked 
        ? "You can now access AI Chat without authentication." 
        : "Authentication is now required for AI Chat.",
    });
  };

  const handleSimulationModeToggle = (checked: boolean) => {
    setSimulationModeEnabled(checked);
    localStorage.setItem('adminSimulationModeEnabled', checked.toString());
    toast({
      title: checked ? "Simulation Mode Testing Enabled" : "Simulation Mode Testing Disabled",
      description: checked 
        ? "You can now access Simulation Mode without authentication." 
        : "Authentication is now required for Simulation Mode.",
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="mb-8 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          className="mr-2"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">Painel Administrativo - Connor Aprova</h1>
      </div>

      <div className="mb-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Ferramentas de Teste</CardTitle>
            <CardDescription>
              Ative estas opções para testar funcionalidades sem necessidade de autenticação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex items-center space-x-3 w-full md:w-1/2">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="aiChatTest" 
                    checked={aiChatEnabled} 
                    onCheckedChange={handleAiChatToggle} 
                  />
                  <Label htmlFor="aiChatTest">Habilitar teste do AI Chat</Label>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/aichat')}
                  className="ml-auto"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Acessar AI Chat
                </Button>
              </div>
              
              <div className="flex items-center space-x-3 w-full md:w-1/2">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="simulationTest" 
                    checked={simulationModeEnabled} 
                    onCheckedChange={handleSimulationModeToggle} 
                  />
                  <Label htmlFor="simulationTest">Habilitar teste do Modo Simulado</Label>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/simulation')}
                  className="ml-auto"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Acessar Simulado
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="concursos" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="concursos">Concursos</TabsTrigger>
        </TabsList>

        <TabsContent value="documents">
          <DocumentManagement />
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="concursos">
          <ConcursoManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
