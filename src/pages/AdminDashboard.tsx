
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, FileText, Users, ChevronLeft, PlusCircle, Trash2, Edit, Eye } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Concurso } from '@/lib/types';

// Mock concursos data for demonstration
const mockConcursos: Concurso[] = [
  {
    id: '1',
    title: 'Concurso INSS 2023',
    description: 'Concurso para Técnico do Seguro Social do Instituto Nacional do Seguro Social',
    thumbnail: 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    organizacao: 'INSS',
    dataProva: '10/12/2023',
    status: 'encerrado',
    materias: [],
    documentos: []
  },
  {
    id: '2',
    title: 'Concurso Polícia Federal 2024',
    description: 'Concurso para Agente, Escrivão e Delegado da Polícia Federal',
    thumbnail: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    organizacao: 'Polícia Federal',
    dataProva: '15/03/2024',
    status: 'aberto',
    materias: [],
    documentos: []
  },
  {
    id: '3',
    title: 'Concurso TRT 4ª Região 2024',
    description: 'Concurso para Técnico e Analista Judiciário do Tribunal Regional do Trabalho',
    thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    organizacao: 'TRT 4ª Região',
    dataProva: '22/05/2024',
    status: 'previsto',
    materias: [],
    documentos: []
  }
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [concursos, setConcursos] = useState<Concurso[]>(mockConcursos);
  const [newConcurso, setNewConcurso] = useState<Partial<Concurso>>({
    title: '',
    description: '',
    thumbnail: '',
    organizacao: '',
    dataProva: '',
    status: 'previsto'
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [concursoToDelete, setConcursoToDelete] = useState<string | null>(null);

  // Redirect if not admin
  React.useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewConcurso(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewConcurso(prev => ({ ...prev, [name]: value }));
  };

  const handleAddConcurso = () => {
    // Validation
    if (!newConcurso.title || !newConcurso.description || !newConcurso.organizacao) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const newConcursoComplete: Concurso = {
      ...newConcurso as Concurso,
      id: Date.now().toString(), // Simple ID generation
      materias: [],
      documentos: []
    };

    setConcursos(prev => [...prev, newConcursoComplete]);
    setNewConcurso({
      title: '',
      description: '',
      thumbnail: '',
      organizacao: '',
      dataProva: '',
      status: 'previsto'
    });
    setIsAddModalOpen(false);
    
    toast({
      title: "Concurso adicionado",
      description: `O concurso "${newConcursoComplete.title}" foi adicionado com sucesso.`
    });
  };

  const handleConfirmDelete = (id: string) => {
    setConcursoToDelete(id);
    setIsConfirmDeleteOpen(true);
  };

  const handleDeleteConcurso = () => {
    if (!concursoToDelete) return;
    
    const concursoName = concursos.find(c => c.id === concursoToDelete)?.title;
    setConcursos(prev => prev.filter(concurso => concurso.id !== concursoToDelete));
    setIsConfirmDeleteOpen(false);
    setConcursoToDelete(null);
    
    toast({
      title: "Concurso removido",
      description: `O concurso "${concursoName}" foi removido com sucesso.`
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

      <Tabs defaultValue="concursos" className="w-full">
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
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Gerenciamento de Concursos</CardTitle>
                <CardDescription>
                  Crie, edite e remova concursos na plataforma
                </CardDescription>
              </div>
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Adicionar Novo Concurso
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Concurso</DialogTitle>
                    <DialogDescription>
                      Preencha os detalhes do novo concurso que será exibido na plataforma.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Título *</Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="Ex: Concurso INSS 2024"
                        value={newConcurso.title}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Descrição *</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Descreva os detalhes do concurso"
                        value={newConcurso.description}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="thumbnail">URL da Imagem</Label>
                      <Input
                        id="thumbnail"
                        name="thumbnail"
                        placeholder="https://exemplo.com/imagem.jpg"
                        value={newConcurso.thumbnail}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="organizacao">Organização *</Label>
                      <Input
                        id="organizacao"
                        name="organizacao"
                        placeholder="Ex: INSS, Polícia Federal, etc."
                        value={newConcurso.organizacao}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="dataProva">Data da Prova</Label>
                      <Input
                        id="dataProva"
                        name="dataProva"
                        placeholder="DD/MM/AAAA"
                        value={newConcurso.dataProva}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="status">Status</Label>
                      <Select 
                        value={newConcurso.status} 
                        onValueChange={(value) => handleSelectChange('status', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="previsto">Previsto</SelectItem>
                          <SelectItem value="aberto">Edital Publicado</SelectItem>
                          <SelectItem value="encerrado">Finalizado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancelar</Button>
                    <Button onClick={handleAddConcurso}>Adicionar Concurso</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {concursos.length > 0 ? (
                  concursos.map((concurso) => (
                    <div key={concurso.id} className="flex items-center justify-between p-4 border rounded-md hover:bg-accent/10 transition-colors">
                      <div className="flex items-center space-x-4">
                        {concurso.thumbnail && (
                          <div className="h-16 w-16 rounded overflow-hidden">
                            <img 
                              src={concurso.thumbnail} 
                              alt={concurso.title} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <h3 className="font-medium">{concurso.title}</h3>
                          <p className="text-sm text-muted-foreground">{concurso.organizacao}</p>
                          <div className="flex items-center mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              concurso.status === 'aberto' 
                                ? 'bg-green-100 text-green-800' 
                                : concurso.status === 'encerrado'
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {concurso.status === 'aberto' 
                                ? 'Edital Publicado' 
                                : concurso.status === 'encerrado'
                                ? 'Finalizado'
                                : 'Previsto'
                              }
                            </span>
                            {concurso.dataProva && (
                              <span className="text-xs text-muted-foreground ml-2">
                                Prova: {concurso.dataProva}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/concursos/${concurso.id}`)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Ver
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          Editar
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleConfirmDelete(concurso.id)}
                          className="flex items-center gap-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remover
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Nenhum concurso cadastrado.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover este concurso? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDeleteOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDeleteConcurso}>Confirmar Exclusão</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
