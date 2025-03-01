
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, FileText, Users, ChevronLeft } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if not admin
  React.useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

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
        <h1 className="text-3xl font-bold">Painel Administrativo</h1>
      </div>

      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="concursos">Concursos</TabsTrigger>
        </TabsList>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Documentos</CardTitle>
              <CardDescription>
                Faça upload de editais, provas e outros documentos para análise pela IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-dashed border-2 p-4 text-center hover:bg-accent/50 cursor-pointer transition-colors">
                  <div className="flex flex-col items-center justify-center h-40">
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="font-medium">Upload de Edital</p>
                    <p className="text-sm text-muted-foreground">
                      PDF, DOC, DOCX (max 10MB)
                    </p>
                  </div>
                </Card>

                <Card className="border-dashed border-2 p-4 text-center hover:bg-accent/50 cursor-pointer transition-colors">
                  <div className="flex flex-col items-center justify-center h-40">
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="font-medium">Upload de Prova</p>
                    <p className="text-sm text-muted-foreground">
                      PDF, DOC, DOCX (max 10MB)
                    </p>
                  </div>
                </Card>

                <Card className="border-dashed border-2 p-4 text-center hover:bg-accent/50 cursor-pointer transition-colors">
                  <div className="flex flex-col items-center justify-center h-40">
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="font-medium">Upload de Gabarito</p>
                    <p className="text-sm text-muted-foreground">
                      PDF, DOC, DOCX (max 10MB)
                    </p>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Documentos Recentes</CardTitle>
              <CardDescription>
                Lista de documentos enviados recentemente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-3 text-primary" />
                      <div>
                        <p className="font-medium">Edital Concurso INSS {i}</p>
                        <p className="text-sm text-muted-foreground">Enviado em 01/06/2023</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Visualizar</Button>
                      <Button variant="outline" size="sm">Processar</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Usuários</CardTitle>
              <CardDescription>
                Visualize e gerencie os usuários da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 mr-3 text-primary" />
                      <div>
                        <p className="font-medium">Usuário {i}</p>
                        <p className="text-sm text-muted-foreground">usuario{i}@email.com</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Editar</Button>
                      <Button variant="outline" size="sm">Gerenciar</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="concursos">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Concursos</CardTitle>
              <CardDescription>
                Crie e edite concursos na plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="mb-4">Adicionar Novo Concurso</Button>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <p className="font-medium">Concurso INSS {i}</p>
                      <p className="text-sm text-muted-foreground">Criado em 01/05/2023</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Editar</Button>
                      <Button variant="outline" size="sm">Remover</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
