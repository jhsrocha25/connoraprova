
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Concurso } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';

// Dados de exemplo para concursos
const mockConcursos: Concurso[] = [
  {
    id: '1',
    title: 'Concurso INSS 2023',
    description: 'Concurso para Técnico do Seguro Social do Instituto Nacional do Seguro Social',
    thumbnail: 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    organizacao: 'INSS',
    dataProva: '10/12/2023',
    status: 'encerrado',
    materias: [
      {
        id: 'm1',
        title: 'Língua Portuguesa',
        description: 'Interpretação de texto, gramática e ortografia',
        questoes: [],
        progress: 75
      },
      {
        id: 'm2',
        title: 'Raciocínio Lógico',
        description: 'Lógica de argumentação, proposições e estruturas lógicas',
        questoes: [],
        progress: 40
      },
      {
        id: 'm3',
        title: 'Direito Constitucional',
        description: 'Princípios fundamentais, direitos e garantias constitucionais',
        questoes: [],
        progress: 60
      }
    ],
    documentos: [
      {
        id: 'd1',
        tipo: 'edital',
        titulo: 'Edital INSS 2023',
        url: '#',
        dataCriacao: new Date('2023-05-10'),
        processado: true
      },
      {
        id: 'd2',
        tipo: 'prova',
        titulo: 'Prova Anterior INSS 2022',
        url: '#',
        dataCriacao: new Date('2022-06-15'),
        processado: true
      }
    ]
  },
  {
    id: '2',
    title: 'Concurso Polícia Federal 2024',
    description: 'Concurso para Agente, Escrivão e Delegado da Polícia Federal',
    thumbnail: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    organizacao: 'Polícia Federal',
    dataProva: '15/03/2024',
    status: 'aberto',
    materias: [
      {
        id: 'm4',
        title: 'Direito Penal',
        description: 'Crimes contra a pessoa, patrimônio e administração pública',
        questoes: [],
        progress: 30
      },
      {
        id: 'm5',
        title: 'Direito Processual Penal',
        description: 'Inquérito policial, ação penal e provas',
        questoes: [],
        progress: 20
      },
      {
        id: 'm6',
        title: 'Direito Administrativo',
        description: 'Administração pública e atos administrativos',
        questoes: [],
        progress: 45
      }
    ],
    documentos: [
      {
        id: 'd3',
        tipo: 'edital',
        titulo: 'Edital PF 2024',
        url: '#',
        dataCriacao: new Date('2023-12-05'),
        processado: true
      }
    ]
  },
  {
    id: '3',
    title: 'Concurso TRT 4ª Região 2024',
    description: 'Concurso para Técnico e Analista Judiciário do Tribunal Regional do Trabalho',
    thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    organizacao: 'TRT 4ª Região',
    dataProva: '22/05/2024',
    status: 'previsto',
    materias: [
      {
        id: 'm7',
        title: 'Direito do Trabalho',
        description: 'Contrato de trabalho, jornada e remuneração',
        questoes: [],
        progress: 0
      },
      {
        id: 'm8',
        title: 'Direito Processual do Trabalho',
        description: 'Processo e procedimentos trabalhistas',
        questoes: [],
        progress: 0
      },
      {
        id: 'm9',
        title: 'Noções de Administração Pública',
        description: 'Princípios e organização da administração pública',
        questoes: [],
        progress: 10
      }
    ],
    documentos: [
      {
        id: 'd4',
        tipo: 'outro',
        titulo: 'Minuta de Edital (Previsão)',
        url: '#',
        dataCriacao: new Date('2023-11-30'),
        processado: false
      }
    ]
  }
];

const ConcursoCard = ({ concurso }: { concurso: Concurso }) => {
  // Calcular o progresso geral do concurso
  const materiaTotal = concurso.materias.length;
  const progressoTotal = concurso.materias.reduce(
    (acc, materia) => acc + (materia.progress || 0), 0
  ) / materiaTotal;

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="p-4">
        <div className="relative h-40 -mt-4 -mx-4 mb-2 overflow-hidden rounded-t-lg">
          <img
            src={concurso.thumbnail}
            alt={concurso.title}
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
          />
          <div className="absolute top-2 right-2">
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
        </div>
        <CardTitle>{concurso.title}</CardTitle>
        <CardDescription>{concurso.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Filter className="h-4 w-4 mr-1" />
            {concurso.organizacao}
          </div>
          {concurso.dataProva && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              Data da prova: {concurso.dataProva}
            </div>
          )}
          {progressoTotal > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Seu progresso</span>
                <span>{Math.round(progressoTotal)}%</span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full" 
                  style={{ width: `${progressoTotal}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Link to={`/concursos/${concurso.id}`} className="w-full">
          <Button className="w-full">Ver detalhes</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

const Concursos = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [organizacao, setOrganizacao] = useState('all');
  const [status, setStatus] = useState('all');
  const [filteredConcursos, setFilteredConcursos] = useState<Concurso[]>(mockConcursos);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Simular carregamento
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let results = [...mockConcursos];
    
    // Aplicar filtro de pesquisa
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      results = results.filter(concurso => 
        concurso.title.toLowerCase().includes(query) || 
        concurso.description.toLowerCase().includes(query) ||
        concurso.organizacao.toLowerCase().includes(query)
      );
    }
    
    // Aplicar filtro de organização
    if (organizacao !== 'all') {
      results = results.filter(concurso => concurso.organizacao === organizacao);
    }
    
    // Aplicar filtro de status
    if (status !== 'all') {
      results = results.filter(concurso => concurso.status === status);
    }
    
    setFilteredConcursos(results);
  }, [searchQuery, organizacao, status]);

  const organizacoes = ['all', ...new Set(mockConcursos.map(concurso => concurso.organizacao))];
  const statusOptions = ['all', 'aberto', 'encerrado', 'previsto'];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container pt-24 pb-16 animate-fade-in">
        <div className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex flex-col md:flex-row items-start justify-between mb-8 gap-4">
            <div className="space-y-1 mb-4 md:mb-0">
              <h1 className="text-3xl font-bold tracking-tight">Concursos Públicos</h1>
              <p className="text-muted-foreground">
                Prepare-se para concursos públicos com questões específicas para cada prova.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar concursos..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Select value={organizacao} onValueChange={setOrganizacao}>
                <SelectTrigger>
                  <SelectValue placeholder="Organização" />
                </SelectTrigger>
                <SelectContent>
                  {organizacoes.map((org) => (
                    <SelectItem key={org} value={org}>
                      {org === 'all' ? 'Todas as organizações' : org}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt === 'all' ? 'Todos os status' : 
                       opt === 'aberto' ? 'Aberto' : 
                       opt === 'encerrado' ? 'Encerrado' : 'Previsto'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
              <TabsTrigger value="all" className="rounded-md px-3 py-1 text-sm font-medium">
                Todos
              </TabsTrigger>
              {isAuthenticated && (
                <>
                  <TabsTrigger value="in-progress" className="rounded-md px-3 py-1 text-sm font-medium">
                    Em Andamento
                  </TabsTrigger>
                  <TabsTrigger value="not-started" className="rounded-md px-3 py-1 text-sm font-medium">
                    Não Iniciados
                  </TabsTrigger>
                </>
              )}
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {filteredConcursos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filteredConcursos.map((concurso, index) => (
                    <div key={concurso.id} className="animate-scale-in" style={{ animationDelay: `${index * 50}ms` }}>
                      <ConcursoCard concurso={concurso} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">Nenhum concurso encontrado</h3>
                  <p className="text-muted-foreground">
                    Tente ajustar seus filtros ou termos de pesquisa.
                  </p>
                </div>
              )}
            </TabsContent>
            
            {isAuthenticated && (
              <>
                <TabsContent value="in-progress" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {filteredConcursos
                      .filter(concurso => {
                        const progressoTotal = concurso.materias.reduce(
                          (acc, materia) => acc + (materia.progress || 0), 0
                        ) / concurso.materias.length;
                        return progressoTotal > 0 && progressoTotal < 100;
                      })
                      .map((concurso, index) => (
                        <div key={concurso.id} className="animate-scale-in" style={{ animationDelay: `${index * 50}ms` }}>
                          <ConcursoCard concurso={concurso} />
                        </div>
                      ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="not-started" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {filteredConcursos
                      .filter(concurso => {
                        const progressoTotal = concurso.materias.reduce(
                          (acc, materia) => acc + (materia.progress || 0), 0
                        );
                        return progressoTotal === 0;
                      })
                      .map((concurso, index) => (
                        <div key={concurso.id} className="animate-scale-in" style={{ animationDelay: `${index * 50}ms` }}>
                          <ConcursoCard concurso={concurso} />
                        </div>
                      ))}
                  </div>
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Concursos;
