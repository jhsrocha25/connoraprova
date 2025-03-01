
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronLeft, Check, AlertCircle, FileText, Download, Clock, Calendar, Award, BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/Navbar';
import { mockConcursos } from '@/pages/Concursos';
import { Concurso, ConcursoMateria } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';

const ConcursoDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [concurso, setConcurso] = useState<Concurso | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Simular carregamento
    const timer = setTimeout(() => {
      const foundConcurso = mockConcursos.find(c => c.id === id) || null;
      setConcurso(foundConcurso);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container pt-24 pb-16">
          <div className="flex items-center justify-center h-[70vh]">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!concurso) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container pt-24 pb-16">
          <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
            <AlertCircle className="h-16 w-16 text-muted-foreground" />
            <h2 className="text-2xl font-bold">Concurso não encontrado</h2>
            <p className="text-muted-foreground">O concurso que você está procurando não existe ou foi removido.</p>
            <Button asChild>
              <Link to="/concursos">Voltar para Concursos</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const progressoGeral = concurso.materias.reduce(
    (acc, materia) => acc + (materia.progress || 0), 0
  ) / concurso.materias.length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container pt-24 pb-16">
        <div className="mb-6">
          <Link 
            to="/concursos" 
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Voltar para Concursos
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{concurso.title}</h1>
                <p className="text-muted-foreground mt-1">{concurso.description}</p>
              </div>
              <Badge 
                className="self-start md:self-auto" 
                variant={
                  concurso.status === 'aberto' ? 'default' :
                  concurso.status === 'encerrado' ? 'secondary' : 'outline'
                }
              >
                {concurso.status === 'aberto' ? 'Aberto' : 
                 concurso.status === 'encerrado' ? 'Encerrado' : 'Previsto'}
              </Badge>
            </div>
            
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>{concurso.organizacao}</span>
              </div>
              {concurso.dataProva && (
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>Data da prova: {concurso.dataProva}</span>
                </div>
              )}
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>{concurso.materias.length} Matérias</span>
              </div>
            </div>
            
            {isAuthenticated && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Seu progresso neste concurso</h3>
                  <span className="text-sm font-medium">{Math.round(progressoGeral)}%</span>
                </div>
                <Progress value={progressoGeral} className="h-2" />
              </div>
            )}

            <Tabs defaultValue="materias" className="mt-6">
              <TabsList>
                <TabsTrigger value="materias">Matérias</TabsTrigger>
                <TabsTrigger value="documentos">Documentos</TabsTrigger>
              </TabsList>
              
              <TabsContent value="materias" className="mt-4">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Matérias do Concurso</h2>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {concurso.materias.map((materia, index) => (
                      <MateriaCard key={materia.id} materia={materia} index={index} />
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="documentos" className="mt-4">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Documentos do Concurso</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {concurso.documentos.map((doc) => (
                      <Card key={doc.id} className="overflow-hidden">
                        <CardHeader className="p-4 pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-base">{doc.titulo}</CardTitle>
                              <CardDescription className="text-xs mt-1">
                                Adicionado em {doc.dataCriacao.toLocaleDateString()}
                              </CardDescription>
                            </div>
                            <Badge variant={doc.processado ? "default" : "outline"}>
                              {doc.tipo === 'edital' ? 'Edital' :
                               doc.tipo === 'prova' ? 'Prova' :
                               doc.tipo === 'gabarito' ? 'Gabarito' : 'Outro'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-4 w-4 mr-1" />
                              {doc.processado ? 'Processado' : 'Não processado'}
                            </div>
                            <Button variant="outline" size="sm" className="gap-1">
                              <Download className="h-4 w-4" />
                              <span>Download</span>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Concurso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Organização</h3>
                  <p>{concurso.organizacao}</p>
                </div>
                
                {concurso.dataProva && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Data da Prova</h3>
                    <p>{concurso.dataProva}</p>
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Status</h3>
                  <Badge 
                    variant={
                      concurso.status === 'aberto' ? 'default' :
                      concurso.status === 'encerrado' ? 'secondary' : 'outline'
                    }
                  >
                    {concurso.status === 'aberto' ? 'Aberto' : 
                     concurso.status === 'encerrado' ? 'Encerrado' : 'Previsto'}
                  </Badge>
                </div>
                
                <Separator />
                
                <div className="pt-2">
                  <Button className="w-full" asChild>
                    <Link to="/aichat">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Tire dúvidas com IA
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {concurso.documentos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Documentos Disponíveis</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {concurso.documentos.map((doc) => (
                      <li key={doc.id} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">{doc.titulo}</span>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const MateriaCard = ({ materia, index }: { materia: ConcursoMateria, index: number }) => {
  const progress = materia.progress || 0;
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between">
          <div>
            <CardTitle className="flex items-start gap-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-foreground text-xs font-medium">
                {index + 1}
              </div>
              <span>{materia.title}</span>
            </CardTitle>
            <CardDescription>{materia.description}</CardDescription>
          </div>
          {progress === 100 && (
            <div className="rounded-full w-6 h-6 bg-primary/10 flex items-center justify-center">
              <Check className="h-4 w-4 text-primary" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        {progress > 0 && (
          <div className="mt-2 mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span>Progresso</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        )}
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            {materia.questoes.length} questões disponíveis
          </span>
          <Button size="sm">
            <BookOpen className="h-4 w-4 mr-2" />
            Estudar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConcursoDetails;
