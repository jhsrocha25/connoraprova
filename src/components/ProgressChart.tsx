import { useState } from 'react';
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  Legend, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis, 
  Line, 
  LineChart, 
  Area, 
  AreaChart, 
  ComposedChart,
  Pie,
  PieChart
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { UserProgress } from '@/lib/types';
import { 
  LayoutDashboard, 
  FileText, 
  Trophy, 
  MessageCircle, 
  History, 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Share2, 
  Award, 
  Clock, 
  BarChart2, 
  PieChart as PieChartIcon, 
  Brain, 
  CheckCircle, 
  XCircle,
  User,
  Users,
  Star,
  Calendar,
  BookOpen,
  Lightbulb
} from 'lucide-react';

type ProgressChartProps = {
  progress: UserProgress;
};

const ProgressChart = ({ progress }: ProgressChartProps) => {
  const [selectedSubTab, setSelectedSubTab] = useState("overview");

  // Data formatting functions from original code
  const formatPerformanceData = () => {
    return progress.performanceByCategory.map((category) => ({
      name: category.category,
      corretas: category.correctPercentage,
      tentativas: category.questionsAttempted,
    }));
  };

  const formatCourseData = () => {
    return progress.courseProgress.map((course) => ({
      name: `Curso ${course.courseId}`,
      progresso: course.progress,
    }));
  };

  const calculateOverallPercentage = () => {
    if (progress.totalQuestionsAnswered === 0) return 0;
    return Math.round((progress.correctAnswers / progress.totalQuestionsAnswered) * 100);
  };

  const overallPercentage = calculateOverallPercentage();

  // Mock data for new features
  const mockHistoricalData = [
    { date: '01/09', correct: 65, incorrect: 35, total: 100 },
    { date: '08/09', correct: 68, incorrect: 32, total: 100 },
    { date: '15/09', correct: 72, incorrect: 28, total: 100 },
    { date: '22/09', correct: 70, incorrect: 30, total: 100 },
    { date: '29/09', correct: 75, incorrect: 25, total: 100 },
    { date: '06/10', correct: 82, incorrect: 18, total: 100 },
    { date: '13/10', correct: 85, incorrect: 15, total: 100 },
  ];

  const mockRankingData = [
    { id: 1, name: 'Ana Silva', score: 95, medal: 'Ouro' },
    { id: 2, name: 'Carlos Oliveira', score: 93, medal: 'Prata' },
    { id: 3, name: 'Maria Santos', score: 91, medal: 'Bronze' },
    { id: 4, name: 'João Silva', score: 88, medal: null },
    { id: 5, name: 'Usuário Atual', score: 85, isCurrent: true, medal: null },
    { id: 6, name: 'Pedro Alves', score: 82, medal: null },
    { id: 7, name: 'Lucia Ferreira', score: 80, medal: null },
  ];

  const mockTimeData = [
    { category: 'Direito Constitucional', avgTime: 65, benchmark: 75 },
    { category: 'Direito Administrativo', avgTime: 82, benchmark: 77 },
    { category: 'Raciocínio Lógico', avgTime: 45, benchmark: 60 },
    { category: 'Língua Portuguesa', avgTime: 55, benchmark: 65 },
  ];

  const mockRecommendations = [
    {
      id: 1,
      topic: 'Direito Constitucional - Controle de Constitucionalidade',
      accuracy: 45,
      recommendation: 'Revisar conceitos básicos e fazer mais exercícios'
    },
    {
      id: 2,
      topic: 'Raciocínio Lógico - Proposições Compostas',
      accuracy: 58,
      recommendation: 'Praticar mais com questões de dificuldade média'
    },
    {
      id: 3,
      topic: 'Língua Portuguesa - Concordância Verbal',
      accuracy: 62,
      recommendation: 'Fortalecer com leituras específicas e exercícios direcionados'
    }
  ];

  const mockSimulados = [
    { id: 'sim1', date: '15/10/2023', title: 'Simulado Completo TRF', score: 82, total: 120, time: '4h30m' },
    { id: 'sim2', date: '01/10/2023', title: 'Simulado Parcial - Direito', score: 78, total: 60, time: '2h15m' },
    { id: 'sim3', date: '15/09/2023', title: 'Simulado Completo MPF', score: 75, total: 100, time: '4h00m' }
  ];

  const preparationLevel = () => {
    if (overallPercentage >= 85) return { level: 'Avançado', color: 'green' };
    if (overallPercentage >= 70) return { level: 'Intermediário', color: 'yellow' };
    return { level: 'Básico', color: 'red' };
  };

  const level = preparationLevel();

  // Dummy function to simulate PDF report download
  const downloadReport = () => {
    // Here we would usually generate and download a PDF
    alert('Relatório em PDF sendo gerado. O download iniciará em breve.');
  };

  // Dummy function to simulate sharing on social media
  const shareProgress = () => {
    // Here we would integrate with social media APIs
    alert('Compartilhando seu progresso nas redes sociais...');
  };

  return (
    <Card className="border shadow-sm animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Desempenho</CardTitle>
        <CardDescription>Visualize seu progresso detalhado por diversas métricas</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general">
          <TabsList className="mb-6">
            <TabsTrigger value="general">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Desempenho Geral
            </TabsTrigger>
            <TabsTrigger value="categories">
              <BarChart2 className="h-4 w-4 mr-2" />
              Por Categoria
            </TabsTrigger>
            <TabsTrigger value="courses">
              <BookOpen className="h-4 w-4 mr-2" />
              Por Curso
            </TabsTrigger>
            <TabsTrigger value="overall">
              <PieChartIcon className="h-4 w-4 mr-2" />
              Geral
            </TabsTrigger>
          </TabsList>
          
          {/* Aba Desempenho Geral */}
          <TabsContent value="general">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <TabsList className="h-9">
                      <TabsTrigger 
                        value="overview" 
                        onClick={() => setSelectedSubTab("overview")}
                        className={selectedSubTab === "overview" ? "bg-primary text-primary-foreground" : ""}
                      >
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Visão Geral
                      </TabsTrigger>
                      <TabsTrigger 
                        value="reports" 
                        onClick={() => setSelectedSubTab("reports")}
                        className={selectedSubTab === "reports" ? "bg-primary text-primary-foreground" : ""}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Relatórios
                      </TabsTrigger>
                      <TabsTrigger 
                        value="ranking" 
                        onClick={() => setSelectedSubTab("ranking")}
                        className={selectedSubTab === "ranking" ? "bg-primary text-primary-foreground" : ""}
                      >
                        <Trophy className="h-4 w-4 mr-2" />
                        Rankings
                      </TabsTrigger>
                      <TabsTrigger 
                        value="feedback" 
                        onClick={() => setSelectedSubTab("feedback")}
                        className={selectedSubTab === "feedback" ? "bg-primary text-primary-foreground" : ""}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Feedback
                      </TabsTrigger>
                      <TabsTrigger 
                        value="history" 
                        onClick={() => setSelectedSubTab("history")}
                        className={selectedSubTab === "history" ? "bg-primary text-primary-foreground" : ""}
                      >
                        <History className="h-4 w-4 mr-2" />
                        Histórico
                      </TabsTrigger>
                      <TabsTrigger 
                        value="challenge" 
                        onClick={() => setSelectedSubTab("challenge")}
                        className={selectedSubTab === "challenge" ? "bg-primary text-primary-foreground" : ""}
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Desafios
                      </TabsTrigger>
                    </TabsList>
                  </h3>
                </div>

                {/* Visão Geral do Desempenho */}
                {selectedSubTab === "overview" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-card">
                        <CardContent className="pt-6">
                          <div className="flex flex-col items-center justify-center">
                            <div className="relative w-24 h-24 mb-4">
                              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                                <circle
                                  cx="50"
                                  cy="50"
                                  r="45"
                                  fill="none"
                                  stroke="hsl(var(--secondary))"
                                  strokeWidth="10"
                                />
                                <circle
                                  cx="50"
                                  cy="50"
                                  r="45"
                                  fill="none"
                                  stroke="hsl(var(--primary))"
                                  strokeWidth="10"
                                  strokeDasharray="283"
                                  strokeDashoffset={283 - (283 * overallPercentage) / 100}
                                  strokeLinecap="round"
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center flex-col">
                                <span className="text-2xl font-bold">{overallPercentage}%</span>
                                <span className="text-xs text-muted-foreground">acertos</span>
                              </div>
                            </div>
                            <h4 className="text-sm font-medium">Desempenho Geral</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {progress.correctAnswers} de {progress.totalQuestionsAnswered} questões
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-card">
                        <CardContent className="pt-6">
                          <div className="flex flex-col items-center justify-center">
                            <div className="mb-4 text-center">
                              <TrendingUp className={`h-10 w-10 mx-auto ${overallPercentage > 70 ? 'text-green-500' : 'text-yellow-500'}`} />
                              <Badge className="mt-2" variant={overallPercentage > 70 ? "outline" : "secondary"}>
                                {level.level}
                              </Badge>
                            </div>
                            <h4 className="text-sm font-medium">Nível de Preparação</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {overallPercentage > 80 ? '15% acima da média' : 'Na média dos usuários'}
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-card">
                        <CardContent className="pt-6">
                          <div className="flex flex-col items-center justify-center">
                            <div className="mb-4">
                              <div className="flex items-center justify-center mb-1">
                                <Award className="h-6 w-6 text-primary mr-1" />
                                <span className="text-lg font-bold">3</span>
                              </div>
                              <div className="flex space-x-1 mt-2">
                                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Direito Const.</Badge>
                                <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Raciocínio</Badge>
                              </div>
                            </div>
                            <h4 className="text-sm font-medium">Medalhas Obtidas</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              Seus temas mais fortes
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Evolução de Desempenho</CardTitle>
                        <CardDescription>Sua evolução nas últimas semanas</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={mockHistoricalData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="date" />
                              <YAxis 
                                tickFormatter={(value) => `${value}%`}
                                domain={[0, 100]}
                              />
                              <Tooltip
                                formatter={(value: number, name: string) => {
                                  return [
                                    `${value}%`,
                                    name === 'correct' ? 'Acertos' : 'Erros'
                                  ];
                                }}
                                contentStyle={{ 
                                  borderRadius: '8px', 
                                  border: '1px solid hsl(var(--border))',
                                  backgroundColor: 'hsl(var(--background))'
                                }}
                              />
                              <Legend />
                              <Area 
                                type="monotone" 
                                dataKey="correct" 
                                name="Acertos" 
                                fill="hsl(var(--primary))" 
                                stroke="hsl(var(--primary))" 
                                fillOpacity={0.3} 
                              />
                              <Line 
                                type="monotone" 
                                dataKey="correct" 
                                name="Acertos" 
                                stroke="hsl(var(--primary))" 
                                strokeWidth={2} 
                                dot={{ r: 4 }} 
                                activeDot={{ r: 6 }} 
                              />
                            </ComposedChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                          <span className="text-green-500 font-medium">+20%</span>
                          <span className="ml-1">nos últimos 30 dias</span>
                        </div>
                        <Badge variant="outline">
                          85% <span className="ml-1 text-muted-foreground">média da semana</span>
                        </Badge>
                      </CardFooter>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Comparação com a Média</CardTitle>
                          <CardDescription>Seu desempenho comparado à média da plataforma</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {progress.performanceByCategory.map((category) => (
                              <div key={category.category} className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">{category.category}</span>
                                  <div className="flex items-center">
                                    <span className="text-sm font-medium">{category.correctPercentage}%</span>
                                    <span className="text-xs text-muted-foreground ml-2">vs 70%</span>
                                    {category.correctPercentage >= 70 ? (
                                      <TrendingUp className="h-4 w-4 ml-1 text-green-500" />
                                    ) : (
                                      <TrendingDown className="h-4 w-4 ml-1 text-red-500" />
                                    )}
                                  </div>
                                </div>
                                <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className="absolute top-0 left-0 h-full bg-primary rounded-full"
                                    style={{ width: `${category.correctPercentage}%` }}
                                  />
                                  <div 
                                    className="absolute top-0 left-0 h-full border-r-2 border-dashed border-orange-500"
                                    style={{ width: '70%' }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Progresso por Concurso</CardTitle>
                          <CardDescription>Seu nível de preparação para cada concurso</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Tribunal Regional Federal</span>
                                <span className="text-sm font-medium">75%</span>
                              </div>
                              <Progress value={75} className="h-2" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Ministério Público</span>
                                <span className="text-sm font-medium">62%</span>
                              </div>
                              <Progress value={62} className="h-2" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Polícia Federal</span>
                                <span className="text-sm font-medium">48%</span>
                              </div>
                              <Progress value={48} className="h-2" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Receita Federal</span>
                                <span className="text-sm font-medium">81%</span>
                              </div>
                              <Progress value={81} className="h-2" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {/* Relatórios Detalhados */}
                {selectedSubTab === "reports" && (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Desempenho por Matéria e Subtema</CardTitle>
                        <CardDescription>Análise detalhada do seu desempenho por área</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {progress.performanceByCategory.map((category) => (
                            <div key={category.category}>
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-medium flex items-center">
                                  <BookOpen className="h-4 w-4 mr-2 text-primary" />
                                  {category.category}
                                </h4>
                                <Badge 
                                  className={
                                    category.correctPercentage >= 80 ? "bg-green-100 text-green-800 hover:bg-green-100" : 
                                    category.correctPercentage >= 60 ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" : 
                                    "bg-red-100 text-red-800 hover:bg-red-100"
                                  }
                                >
                                  {category.correctPercentage}%
                                </Badge>
                              </div>
                              <Progress value={category.correctPercentage} className="h-2 mb-2" />
                              
                              {/* Subtemas da matéria (mockados) */}
                              <div className="pl-6 space-y-3 mt-3">
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs">Princípios Fundamentais</span>
                                    <span className="text-xs font-medium">85%</span>
                                  </div>
                                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 rounded-full" style={{ width: '85%' }} />
                                  </div>
                                </div>
                                
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs">Direitos e Garantias</span>
                                    <span className="text-xs font-medium">72%</span>
                                  </div>
                                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-yellow-500 rounded-full" style={{ width: '72%' }} />
                                  </div>
                                </div>
                                
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs">Organização do Estado</span>
                                    <span className="text-xs font-medium">65%</span>
                                  </div>
                                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-yellow-500 rounded-full" style={{ width: '65%' }} />
                                  </div>
                                </div>
                              </div>
                              
                              <Separator className="my-4" />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <Clock className="h-5 w-5 mr-2 text-primary" />
                          Tempo Médio de Resposta
                        </CardTitle>
                        <CardDescription>Análise do seu tempo para responder questões</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[250px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={mockTimeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="category" />
                              <YAxis label={{ value: 'Segundos', angle: -90, position: 'insideLeft' }} />
                              <Tooltip
                                formatter={(value: number, name: string) => {
                                  return [
                                    `${value} segundos`,
                                    name === 'avgTime' ? 'Seu Tempo' : 'Média Geral'
                                  ];
                                }}
                                contentStyle={{ 
                                  borderRadius: '8px', 
                                  border: '1px solid hsl(var(--border))',
                                  backgroundColor: 'hsl(var(--background))'
                                }}
                              />
                              <Legend />
                              <Bar 
                                dataKey="avgTime" 
                                name="Seu Tempo" 
                                fill="hsl(var(--primary))" 
                                radius={[4, 4, 0, 0]} 
                              />
                              <Bar 
                                dataKey="benchmark" 
                                name="Média Geral" 
                                fill="hsl(var(--muted-foreground))" 
                                radius={[4, 4, 0, 0]} 
                                fillOpacity={0.5}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="mt-4 text-sm text-muted-foreground text-center">
                          Seu tempo médio geral: <span className="font-medium">68 segundos</span> por questão
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex justify-end">
                      <Button variant="outline" className="mr-2" onClick={downloadReport}>
                        <Download className="h-4 w-4 mr-2" />
                        Baixar Relatório PDF
                      </Button>
                      <Button variant="outline" onClick={shareProgress}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Compartilhar Progresso
                      </Button>
                    </div>
                  </div>
                )}

                {/* Rankings e Comparação */}
                {selectedSubTab === "ranking" && (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <Trophy className="h-5 w-5 mr-2 text-primary" />
                          Ranking de Desempenho
                        </CardTitle>
                        <CardDescription>Os melhores desempenhos da plataforma</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {mockRankingData.map((user) => (
                            <div 
                              key={user.id} 
                              className={`flex items-center justify-between p-3 rounded-lg border ${user.isCurrent ? 'bg-primary/5 border-primary' : ''}`}
                            >
                              <div className="flex items-center">
                                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-sm font-medium mr-3">
                                  {user.id}
                                </div>
                                <div>
                                  <p className="text-sm font-medium flex items-center">
                                    {user.name}
                                    {user.isCurrent && <Badge className="ml-2 bg-primary text-primary-foreground">Você</Badge>}
                                    {user.medal && (
                                      <span className="ml-2">
                                        {user.medal === 'Ouro' && <Award className="h-4 w-4 text-yellow-500" />}
                                        {user.medal === 'Prata' && <Award className="h-4 w-4 text-gray-400" />}
                                        {user.medal === 'Bronze' && <Award className="h-4 w-4 text-amber-700" />}
                                      </span>
                                    )}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {user.medal ? `Medalha de ${user.medal}` : 'Sem medalha'}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold">{user.score}%</p>
                                <p className="text-xs text-muted-foreground">
                                  {user.id <= 3 ? 'Excelente' : user.id <= 5 ? 'Muito Bom' : 'Bom'}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center">
                            <Users className="h-4 w-4 mr-2 text-primary" />
                            Comparação com a Média
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col items-center justify-center pt-4">
                            <div className="relative w-32 h-32">
                              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                                <circle
                                  cx="50"
                                  cy="50"
                                  r="45"
                                  fill="none"
                                  stroke="hsl(var(--secondary))"
                                  strokeWidth="10"
                                />
                                <circle
                                  cx="50"
                                  cy="50"
                                  r="45"
                                  fill="none"
                                  stroke="hsl(var(--primary))"
                                  strokeWidth="10"
                                  strokeDasharray="283"
                                  strokeDashoffset={283 - (283 * 85) / 100}
                                  strokeLinecap="round"
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center flex-col">
                                <span className="text-3xl font-bold">85%</span>
                                <span className="text-xs text-muted-foreground">você</span>
                              </div>
                            </div>
                            <div className="mt-4 text-center">
                              <p className="text-sm font-medium">Média geral: 70%</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Você está <span className="text-green-500 font-medium">15%</span> acima da média
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center">
                            <Star className="h-4 w-4 mr-2 text-primary" />
                            Suas Medalhas
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4 pt-2">
                            <div className="flex items-center p-2 rounded-lg border bg-yellow-50">
                              <Award className="h-8 w-8 text-yellow-500 mr-3" />
                              <div>
                                <p className="text-sm font-medium">Expert em Direito Constitucional</p>
                                <p className="text-xs text-muted-foreground">Top 5% em acertos</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center p-2 rounded-lg border bg-blue-50">
                              <Award className="h-8 w-8 text-blue-500 mr-3" />
                              <div>
                                <p className="text-sm font-medium">Mestre em Raciocínio Lógico</p>
                                <p className="text-xs text-muted-foreground">Top 10% em velocidade</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center p-2 rounded-lg border bg-green-50">
                              <Award className="h-8 w-8 text-green-500 mr-3" />
                              <div>
                                <p className="text-sm font-medium">Dedicação Consistente</p>
                                <p className="text-xs text-muted-foreground">Ativo por 30 dias seguidos</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center">
                            <TrendingUp className="h-4 w-4 mr-2 text-primary" />
                            Posição no Ranking
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col items-center justify-center pt-4">
                            <div className="text-5xl font-bold text-primary mb-2">5º</div>
                            <Badge variant="outline" className="mb-4">
                              Top 10%
                            </Badge>
                            <div className="w-full space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span>Posição Anterior</span>
                                <span className="font-medium flex items-center">
                                  7º <TrendingUp className="h-3 w-3 ml-1 text-green-500" />
