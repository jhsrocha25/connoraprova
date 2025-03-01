import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, Filter, Clock, University, MapPin, GraduationCap, 
  DollarSign, Bell, AlertTriangle, TrendingUp, CheckCircle, AlertCircle, X as XIcon 
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Concurso } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';

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

const areaOptions = [
  { value: 'juridica', label: 'Jurídica' },
  { value: 'administrativa', label: 'Administrativa' },
  { value: 'policial', label: 'Policial' },
  { value: 'saude', label: 'Saúde' },
  { value: 'ti', label: 'TI' },
  { value: 'educacao', label: 'Educação' },
];

const localidadeOptions = [
  { value: 'nacional', label: 'Nacional' },
  { value: 'sp', label: 'São Paulo' },
  { value: 'rj', label: 'Rio de Janeiro' },
  { value: 'mg', label: 'Minas Gerais' },
  { value: 'rs', label: 'Rio Grande do Sul' },
  { value: 'pr', label: 'Paraná' },
  { value: 'df', label: 'Distrito Federal' },
];

const escolaridadeOptions = [
  { value: 'medio', label: 'Nível Médio' },
  { value: 'tecnico', label: 'Nível Técnico' },
  { value: 'superior', label: 'Nível Superior' },
];

const faixaSalarialOptions = [
  { value: 'ate3000', label: 'Até R$ 3.000' },
  { value: '3000a5000', label: 'R$ 3.000 a R$ 5.000' },
  { value: '5000a8000', label: 'R$ 5.000 a R$ 8.000' },
  { value: '8000a12000', label: 'R$ 8.000 a R$ 12.000' },
  { value: 'acima12000', label: 'Acima de R$ 12.000' },
];

const organizadoraOptions = [
  { value: 'cespe', label: 'CESPE/CEBRASPE' },
  { value: 'fcc', label: 'FCC' },
  { value: 'fgv', label: 'FGV' },
  { value: 'vunesp', label: 'VUNESP' },
  { value: 'ibfc', label: 'IBFC' },
  { value: 'quadrix', label: 'QUADRIX' },
];

const ConcursosEmDestaque = ({ concursos }: { concursos: Concurso[] }) => {
  const destaqueConcursos = concursos.filter(c => c.status === 'aberto').slice(0, 3);
  
  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <TrendingUp className="h-5 w-5 mr-2 text-primary" />
        <h2 className="text-xl font-bold">Concursos em Alta</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {destaqueConcursos.map((concurso) => (
          <Card key={concurso.id} className="border-2 border-primary/20 hover:border-primary/40 transition-all">
            <CardHeader className="p-4 pb-0">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base">{concurso.title}</CardTitle>
                {concurso.dataProva && new Date(concurso.dataProva).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000 && (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Prazo Final
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center text-sm mb-2">
                <University className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>{concurso.organizacao}</span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>Prova: {concurso.dataProva || 'A definir'}</span>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Link to={`/concursos/${concurso.id}`} className="w-full">
                <Button variant="outline" className="w-full">Ver detalhes</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

const ConcursoCard = ({ concurso }: { concurso: Concurso }) => {
  const materiaTotal = concurso.materias.length;
  const progressoTotal = concurso.materias.reduce(
    (acc, materia) => acc + (materia.progress || 0), 0
  ) / materiaTotal;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aberto':
        return <AlertCircle className="h-4 w-4 mr-1" />;
      case 'encerrado':
        return <CheckCircle className="h-4 w-4 mr-1" />;
      case 'previsto':
        return <Clock className="h-4 w-4 mr-1" />;
      default:
        return <Clock className="h-4 w-4 mr-1" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'aberto':
        return 'default';
      case 'encerrado':
        return 'secondary';
      case 'previsto':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'aberto':
        return 'Edital Publicado';
      case 'encerrado':
        return 'Finalizado';
      case 'previsto':
        return 'Previsto';
      default:
        return status;
    }
  };

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
              variant={getStatusVariant(concurso.status)}
              className="flex items-center"
            >
              {getStatusIcon(concurso.status)}
              {getStatusText(concurso.status)}
            </Badge>
          </div>
        </div>
        <CardTitle>{concurso.title}</CardTitle>
        <CardDescription>{concurso.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <University className="h-4 w-4 mr-1" />
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

const FiltroAvancado = ({
  isOpen,
  onClose,
  filtros,
  setFiltros
}: {
  isOpen: boolean,
  onClose: () => void,
  filtros: any,
  setFiltros: (filtros: any) => void
}) => {
  const [localFiltros, setLocalFiltros] = useState(filtros);

  const handleApplyFilters = () => {
    setFiltros(localFiltros);
    onClose();
    toast({
      title: "Filtros aplicados",
      description: "Os resultados foram atualizados com base nos filtros selecionados."
    });
  };

  const handleResetFilters = () => {
    const resetFiltros = {
      area: [],
      localidade: [],
      escolaridade: [],
      faixaSalarial: '',
      organizadora: [],
      notificacoes: false
    };
    setLocalFiltros(resetFiltros);
    setFiltros(resetFiltros);
    onClose();
    toast({
      title: "Filtros redefinidos",
      description: "Todos os filtros foram removidos."
    });
  };

  const toggleArrayFilter = (array: string[], item: string) => {
    return array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Filtros Avançados</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <XIcon className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-2">Área</h4>
              <div className="grid grid-cols-2 gap-2">
                {areaOptions.map(option => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`area-${option.value}`} 
                      checked={localFiltros.area.includes(option.value)}
                      onCheckedChange={() => {
                        setLocalFiltros({
                          ...localFiltros,
                          area: toggleArrayFilter(localFiltros.area, option.value)
                        });
                      }}
                    />
                    <Label htmlFor={`area-${option.value}`}>{option.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-medium mb-2">Localidade</h4>
              <div className="grid grid-cols-2 gap-2">
                {localidadeOptions.map(option => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`localidade-${option.value}`} 
                      checked={localFiltros.localidade.includes(option.value)}
                      onCheckedChange={() => {
                        setLocalFiltros({
                          ...localFiltros,
                          localidade: toggleArrayFilter(localFiltros.localidade, option.value)
                        });
                      }}
                    />
                    <Label htmlFor={`localidade-${option.value}`}>{option.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-medium mb-2">Escolaridade</h4>
              <div className="grid grid-cols-2 gap-2">
                {escolaridadeOptions.map(option => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`escolaridade-${option.value}`} 
                      checked={localFiltros.escolaridade.includes(option.value)}
                      onCheckedChange={() => {
                        setLocalFiltros({
                          ...localFiltros,
                          escolaridade: toggleArrayFilter(localFiltros.escolaridade, option.value)
                        });
                      }}
                    />
                    <Label htmlFor={`escolaridade-${option.value}`}>{option.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-medium mb-2">Faixa Salarial</h4>
              <Select 
                value={localFiltros.faixaSalarial} 
                onValueChange={(value) => {
                  setLocalFiltros({
                    ...localFiltros,
                    faixaSalarial: value
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a faixa salarial" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as faixas</SelectItem>
                  {faixaSalarialOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-medium mb-2">Organizadora</h4>
              <div className="grid grid-cols-2 gap-2">
                {organizadoraOptions.map(option => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`organizadora-${option.value}`} 
                      checked={localFiltros.organizadora.includes(option.value)}
                      onCheckedChange={() => {
                        setLocalFiltros({
                          ...localFiltros,
                          organizadora: toggleArrayFilter(localFiltros.organizadora, option.value)
                        });
                      }}
                    />
                    <Label htmlFor={`organizadora-${option.value}`}>{option.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="notify" className="text-sm font-medium">
                  Receber notificações
                </Label>
                <Switch 
                  id="notify" 
                  checked={localFiltros.notificacoes}
                  onCheckedChange={(checked) => {
                    setLocalFiltros({
                      ...localFiltros,
                      notificacoes: checked
                    });
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Ative para receber alertas sobre novos concursos que correspondam aos seus filtros
              </p>
            </div>
          </div>

          <div className="flex justify-between mt-6 gap-4">
            <Button variant="outline" onClick={handleResetFilters} className="w-1/2">
              Redefinir
            </Button>
            <Button onClick={handleApplyFilters} className="w-1/2">
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrganizadoraInfo = ({ 
  organizadora 
}: { 
  organizadora: string 
}) => {
  const bancaInfo: Record<string, { 
    qtdQuestoes: string, 
    criterios: string, 
    dificuldade: 'Baixa' | 'Média' | 'Alta'
  }> = {
    'INSS': { 
      qtdQuestoes: '120 questões objetivas', 
      criterios: 'Cada questão vale 1 ponto, não há penalidade para erros', 
      dificuldade: 'Média' 
    },
    'Polícia Federal': { 
      qtdQuestoes: '100 questões objetivas + prova discursiva', 
      criterios: 'Questões objetivas com penalidade para erros', 
      dificuldade: 'Alta' 
    },
    'TRT 4ª Região': { 
      qtdQuestoes: '80 questões objetivas', 
      criterios: 'Sem penalidade para erros', 
      dificuldade: 'Média' 
    },
  };

  const info = bancaInfo[organizadora] || {
    qtdQuestoes: 'Varia conforme o edital',
    criterios: 'Consulte o edital para informações detalhadas',
    dificuldade: 'Média'
  };

  return (
    <div className="p-4 bg-muted/50 rounded-lg mt-2">
      <h3 className="font-medium mb-2">Perfil da Banca: {organizadora}</h3>
      <div className="space-y-1 text-sm">
        <p><span className="font-medium">Questões:</span> {info.qtdQuestoes}</p>
        <p><span className="font-medium">Critérios:</span> {info.criterios}</p>
        <p className="flex items-center">
          <span className="font-medium mr-1">Dificuldade:</span> 
          <span className={
            info.dificuldade === 'Alta' ? 'text-destructive' : 
            info.dificuldade === 'Média' ? 'text-amber-500' : 
            'text-green-500'
          }>
            {info.dificuldade}
          </span>
        </p>
      </div>
    </div>
  );
};

const Concursos = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [organizacao, setOrganizacao] = useState('all');
  const [status, setStatus] = useState('all');
  const [filteredConcursos, setFilteredConcursos] = useState<Concurso[]>(mockConcursos);
  const [showFiltroAvancado, setShowFiltroAvancado] = useState(false);
  const [showOrganizadoraInfo, setShowOrganizadoraInfo] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  
  const [filtrosAvancados, setFiltrosAvancados] = useState({
    area: [] as string[],
    localidade: [] as string[],
    escolaridade: [] as string[],
    faixaSalarial: '',
    organizadora: [] as string[],
    notificacoes: false
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let results = [...mockConcursos];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      results = results.filter(concurso => 
        concurso.title.toLowerCase().includes(query) || 
        concurso.description.toLowerCase().includes(query) ||
        concurso.organizacao.toLowerCase().includes(query)
      );
    }
    
    if (organizacao !== 'all') {
      results = results.filter(concurso => concurso.organizacao === organizacao);
    }
    
    if (status !== 'all') {
      results = results.filter(concurso => concurso.status === status);
    }
    
    if (filtrosAvancados.area.length > 0) {
      console.log('Filtrando por áreas:', filtrosAvancados.area);
    }
    
    if (filtrosAvancados.localidade.length > 0) {
      console.log('Filtrando por localidades:', filtrosAvancados.localidade);
    }
    
    if (filtrosAvancados.escolaridade.length > 0) {
      console.log('Filtrando por escolaridade:', filtrosAvancados.escolaridade);
    }
    
    if (filtrosAvancados.faixaSalarial) {
      console.log('Filtrando por faixa salarial:', filtrosAvancados.faixaSalarial);
    }
    
    if (filtrosAvancados.organizadora.length > 0) {
      console.log('Filtrando por organizadoras:', filtrosAvancados.organizadora);
    }
    
    setFilteredConcursos(results);
  }, [searchQuery, organizacao, status, filtrosAvancados]);

  const organizacoes = ['all', ...new Set(mockConcursos.map(concurso => concurso.organizacao))];
  const statusOptions = [
    {value: 'all', label: 'Todos'},
    {value: 'previsto', label: 'Previstos'}, 
    {value: 'aberto', label: 'Edital Publicado'}, 
    {value: 'inscricoes-encerradas', label: 'Inscrições Encerradas'},
    {value: 'em-andamento', label: 'Em Andamento'},
    {value: 'encerrado', label: 'Finalizados'}
  ];

  const handleActivateNotifications = () => {
    toast({
      title: "Notificações ativadas",
      description: "Você receberá atualizações sobre novos concursos e prazos importantes.",
    });
  };

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
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={handleActivateNotifications}
              >
                <Bell className="h-4 w-4" />
                Ativar Notificações
              </Button>
            </div>
          </div>

          <ConcursosEmDestaque concursos={mockConcursos} />

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
              <Select value={organizacao} onValueChange={(value) => {
                setOrganizacao(value);
                if (value !== 'all') {
                  setShowOrganizadoraInfo(mockConcursos.find(c => c.organizacao === value)?.organizacao || null);
                } else {
                  setShowOrganizadoraInfo(null);
                }
              }}>
                <SelectTrigger className="w-full flex items-center">
                  <University className="h-4 w-4 mr-2" />
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
              
              {showOrganizadoraInfo && (
                <OrganizadoraInfo organizadora={showOrganizadoraInfo} />
              )}
            </div>
            <div>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <Button 
              variant="outline" 
              onClick={() => setShowFiltroAvancado(true)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtros Avançados
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {filteredConcursos.length} resultados encontrados
              </span>
              {(filtrosAvancados.area.length > 0 || 
                filtrosAvancados.localidade.length > 0 || 
                filtrosAvancados.escolaridade.length > 0 || 
                filtrosAvancados.faixaSalarial || 
                filtrosAvancados.organizadora.length > 0) && (
                <Badge variant="outline" className="gap-1">
                  <Filter className="h-3 w-3" />
                  Filtros ativos
                </Badge>
              )}
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

      <FiltroAvancado 
        isOpen={showFiltroAvancado}
        onClose={() => setShowFiltroAvancado(false)}
        filtros={filtrosAvancados}
        setFiltros={setFiltrosAvancados}
      />
    </div>
  );
};

export default Concursos;
