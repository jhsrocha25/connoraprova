
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, Line, LineChart, Area, AreaChart, ComposedChart } from 'recharts';
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
  PieChart, 
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
              <PieChart className="h-4 w-4 mr-2" />
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
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span>Próxima Posição</span>
                                <span className="font-medium">4º (88%)</span>
                              </div>
                              <Separator className="my-2" />
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>Entre 1.253 usuários</span>
                                <span>Atualizado hoje</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {/* Feedback Personalizado */}
                {selectedSubTab === "feedback" && (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <Brain className="h-5 w-5 mr-2 text-primary" />
                          Recomendações de Estudo
                        </CardTitle>
                        <CardDescription>Tópicos que precisam de reforço baseados em seu desempenho</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {mockRecommendations.map((rec) => (
                            <div key={rec.id} className="p-4 rounded-lg border">
                              <div className="flex items-start">
                                <div className="mr-3 mt-1">
                                  {rec.accuracy < 50 ? (
                                    <div className="p-2 bg-red-100 rounded-full">
                                      <XCircle className="h-5 w-5 text-red-600" />
                                    </div>
                                  ) : rec.accuracy < 70 ? (
                                    <div className="p-2 bg-yellow-100 rounded-full">
                                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                                    </div>
                                  ) : (
                                    <div className="p-2 bg-green-100 rounded-full">
                                      <CheckCircle className="h-5 w-5 text-green-600" />
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-medium">{rec.topic}</h4>
                                    <Badge variant={rec.accuracy < 50 ? "destructive" : rec.accuracy < 70 ? "outline" : "default"}>
                                      {rec.accuracy}%
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">{rec.recommendation}</p>
                                  <div className="mt-3 flex items-center space-x-2">
                                    <Button variant="outline" size="sm" className="h-8">
                                      <BookOpen className="h-3 w-3 mr-1" />
                                      Revisar Material
                                    </Button>
                                    <Button variant="outline" size="sm" className="h-8">
                                      <Zap className="h-3 w-3 mr-1" />
                                      Praticar Questões
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <Lightbulb className="h-5 w-5 mr-2 text-primary" />
                          Plano de Estudos Personalizado
                        </CardTitle>
                        <CardDescription>Sugestões para otimizar seu tempo de estudo</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="rounded-lg border p-4">
                            <h4 className="text-sm font-medium mb-2">Foco da Semana</h4>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                                  <span className="text-sm">Segunda-feira</span>
                                </div>
                                <span className="text-sm font-medium">Direito Constitucional (2h)</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                                  <span className="text-sm">Terça-feira</span>
                                </div>
                                <span className="text-sm font-medium">Raciocínio Lógico (1.5h)</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                                  <span className="text-sm">Quarta-feira</span>
                                </div>
                                <span className="text-sm font-medium">Simulado Parcial (2h)</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                                  <span className="text-sm">Quinta-feira</span>
                                </div>
                                <span className="text-sm font-medium">Língua Portuguesa (2h)</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                                  <span className="text-sm">Sexta-feira</span>
                                </div>
                                <span className="text-sm font-medium">Direito Administrativo (2h)</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="rounded-lg border p-4">
                              <h4 className="text-sm font-medium mb-2">Distribuição Recomendada</h4>
                              <div className="h-[180px]">
                                <ResponsiveContainer width="100%" height="100%">
                                  <PieChart>
                                    <Pie
                                      data={[
                                        { name: 'Dir. Constitucional', value: 30, fill: 'hsl(var(--primary))' },
                                        { name: 'Raciocínio Lógico', value: 20, fill: 'hsl(var(--secondary))' },
                                        { name: 'Língua Portuguesa', value: 25, fill: '#22c55e' },
                                        { name: 'Dir. Administrativo', value: 25, fill: '#f59e0b' }
                                      ]}
                                      cx="50%"
                                      cy="50%"
                                      labelLine={false}
                                      outerRadius={70}
                                      dataKey="value"
                                    />
                                    <Tooltip
                                      formatter={(value: number, name: string) => {
                                        return [`${value}%`, name];
                                      }}
                                      contentStyle={{ 
                                        borderRadius: '8px', 
                                        border: '1px solid hsl(var(--border))',
                                        backgroundColor: 'hsl(var(--background))'
                                      }}
                                    />
                                  </PieChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                            
                            <div className="rounded-lg border p-4">
                              <h4 className="text-sm font-medium mb-2">Próximos Marcos</h4>
                              <div className="space-y-3">
                                <div className="flex items-center">
                                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                  <span className="text-sm">Completar simulado TRF</span>
                                </div>
                                <div className="flex items-center">
                                  <Circle className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span className="text-sm">Atingir 75% em Direito Administrativo</span>
                                </div>
                                <div className="flex items-center">
                                  <Circle className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span className="text-sm">Sequência de 30 dias de estudo</span>
                                </div>
                                <div className="flex items-center">
                                  <Circle className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span className="text-sm">Completar 500 questões</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-center">
                            <Button>
                              <Download className="h-4 w-4 mr-2" />
                              Baixar Plano de Estudos
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Histórico de Simulados */}
                {selectedSubTab === "history" && (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <History className="h-5 w-5 mr-2 text-primary" />
                          Histórico de Simulados
                        </CardTitle>
                        <CardDescription>Seus simulados realizados e respectivas pontuações</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {mockSimulados.map((sim) => (
                            <div key={sim.id} className="p-4 rounded-lg border">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div>
                                  <h4 className="text-sm font-medium flex items-center">
                                    <BookOpen className="h-4 w-4 mr-2 text-primary" />
                                    {sim.title}
                                  </h4>
                                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    <span>{sim.date}</span>
                                    <Separator orientation="vertical" className="mx-2 h-3" />
                                    <Clock className="h-3 w-3 mr-1" />
                                    <span>{sim.time}</span>
                                  </div>
                                </div>
                                <div className="mt-3 md:mt-0 flex items-center">
                                  <div className="mr-4">
                                    <div className="text-sm font-medium">Pontuação</div>
                                    <div className="text-xl font-bold">{sim.score}%</div>
                                  </div>
                                  <div className="w-16 h-16 relative">
                                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
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
                                        strokeDashoffset={283 - (283 * sim.score) / 100}
                                        strokeLinecap="round"
                                      />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <span className="text-sm font-medium">{Math.round(sim.score * sim.total / 100)}/{sim.total}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-3 flex justify-end">
                                <Button variant="outline" size="sm" className="h-8">
                                  <FileText className="h-3 w-3 mr-1" />
                                  Ver Detalhes
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                          Evolução nos Simulados
                        </CardTitle>
                        <CardDescription>Sua progressão de pontuação ao longo do tempo</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[250px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={[
                                { date: '15/08', score: 68 },
                                { date: '01/09', score: 72 },
                                { date: '15/09', score: 75 },
                                { date: '01/10', score: 78 },
                                { date: '15/10', score: 82 }
                              ]}
                              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="date" />
                              <YAxis domain={[60, 100]} />
                              <Tooltip
                                formatter={(value: number) => [`${value}%`, 'Pontuação']}
                                contentStyle={{ 
                                  borderRadius: '8px', 
                                  border: '1px solid hsl(var(--border))',
                                  backgroundColor: 'hsl(var(--background))'
                                }}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="score" 
                                name="Pontuação" 
                                stroke="hsl(var(--primary))" 
                                strokeWidth={2} 
                                dot={{ r: 5 }} 
                                activeDot={{ r: 7 }} 
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="mt-4 text-sm text-center">
                          <span className="text-muted-foreground">Crescimento total:</span>
                          <span className="ml-1 font-medium text-green-500">+14%</span>
                          <span className="ml-1 text-muted-foreground">nos últimos 60 dias</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Modo Desafio */}
                {selectedSubTab === "challenge" && (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <Zap className="h-5 w-5 mr-2 text-primary" />
                          Modo Desafio
                        </CardTitle>
                        <CardDescription>Teste seus conhecimentos com desafios personalizados</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="border rounded-lg p-4 flex flex-col items-center text-center">
                            <div className="p-3 bg-primary/10 rounded-full mb-3">
                              <Zap className="h-6 w-6 text-primary" />
                            </div>
                            <h4 className="text-sm font-medium mb-1">Desafio Rápido</h4>
                            <p className="text-xs text-muted-foreground mb-4">10 questões em 10 minutos</p>
                            <Button className="w-full mt-auto" variant="outline">Iniciar</Button>
                          </div>
                          
                          <div className="border rounded-lg p-4 flex flex-col items-center text-center">
                            <div className="p-3 bg-primary/10 rounded-full mb-3">
                              <Brain className="h-6 w-6 text-primary" />
                            </div>
                            <h4 className="text-sm font-medium mb-1">Pontos Fracos</h4>
                            <p className="text-xs text-muted-foreground mb-4">Foco nas áreas que você precisa melhorar</p>
                            <Button className="w-full mt-auto" variant="outline">Iniciar</Button>
                          </div>
                          
                          <div className="border rounded-lg p-4 flex flex-col items-center text-center">
                            <div className="p-3 bg-primary/10 rounded-full mb-3">
                              <Trophy className="h-6 w-6 text-primary" />
                            </div>
                            <h4 className="text-sm font-medium mb-1">Desafio Semanal</h4>
                            <p className="text-xs text-muted-foreground mb-4">Ganhe pontos de experiência e conquistas</p>
                            <Button className="w-full mt-auto" variant="outline">Iniciar</Button>
                          </div>
                        </div>
                        
                        <Separator className="my-6" />
                        
                        <div className="space-y-4">
                          <h4 className="text-sm font-medium">Desafios Concluídos</h4>
                          
                          <div className="border rounded-lg p-3 flex justify-between items-center">
                            <div>
                              <h5 className="text-sm font-medium">Desafio Rápido - Direito Constitucional</h5>
                              <p className="text-xs text-muted-foreground">Concluído em 18/10/2023</p>
                            </div>
                            <div className="flex items-center">
                              <span className="text-sm font-bold mr-2">8/10</span>
                              <Badge>80%</Badge>
                            </div>
                          </div>
                          
                          <div className="border rounded-lg p-3 flex justify-between items-center">
                            <div>
                              <h5 className="text-sm font-medium">Pontos Fracos - Português</h5>
                              <p className="text-xs text-muted-foreground">Concluído em 15/10/2023</p>
                            </div>
                            <div className="flex items-center">
                              <span className="text-sm font-bold mr-2">12/15</span>
                              <Badge>80%</Badge>
                            </div>
                          </div>
                          
                          <div className="border rounded-lg p-3 flex justify-between items-center">
                            <div>
                              <h5 className="text-sm font-medium">Desafio Semanal #42</h5>
                              <p className="text-xs text-muted-foreground">Concluído em 10/10/2023</p>
                            </div>
                            <div className="flex items-center">
                              <span className="text-sm font-bold mr-2">18/25</span>
                              <Badge>72%</Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* Original Tabs from the initial code */}
          <TabsContent value="categories" className="space-y-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={formatPerformanceData()}
                  margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} horizontal={true} />
                  <XAxis dataKey="name" scale="band" axisLine={false} tickLine={false} />
                  <YAxis
                    tickFormatter={(value) => `${value}%`}
                    domain={[0, 100]}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${value}%`, 'Acertos']}
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: '1px solid hsl(var(--border))',
                      backgroundColor: 'hsl(var(--background))'
                    }}
                  />
                  <Bar
                    dataKey="corretas"
                    name="Acertos"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {progress.performanceByCategory.map((category) => (
                <Card key={category.category} className="border">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted-foreground mb-1">{category.category}</p>
                      <div className="flex justify-center items-baseline">
                        <h4 className="text-2xl font-bold">{category.correctPercentage}%</h4>
                        <span className="text-xs ml-1 text-muted-foreground">acertos</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{category.questionsAttempted} questões</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="courses">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={formatCourseData()}
                  margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} horizontal={true} />
                  <XAxis dataKey="name" scale="band" axisLine={false} tickLine={false} />
                  <YAxis
                    tickFormatter={(value) => `${value}%`}
                    domain={[0, 100]}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${value}%`, 'Progresso']}
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: '1px solid hsl(var(--border))',
                      backgroundColor: 'hsl(var(--background))'
                    }}
                  />
                  <Bar
                    dataKey="progresso"
                    name="Progresso"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="overall">
            <div className="space-y-8">
              <div className="flex flex-col items-center justify-center p-8">
                <div className="relative mb-4">
                  <svg width="160" height="160" viewBox="0 0 160 160" className="transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke="hsl(var(--secondary))"
                      strokeWidth="12"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="12"
                      strokeDasharray="439.8"
                      strokeDashoffset={439.8 - (439.8 * overallPercentage) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-4xl font-bold">{overallPercentage}%</span>
                    <span className="text-sm text-muted-foreground">desempenho</span>
                  </div>
                </div>
                
                <div className="flex space-x-10 text-center">
                  <div>
                    <h4 className="text-2xl font-bold">{progress.correctAnswers}</h4>
                    <p className="text-sm font-medium text-muted-foreground">Questões corretas</p>
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold">{progress.totalQuestionsAnswered}</h4>
                    <p className="text-sm font-medium text-muted-foreground">Total respondidas</p>
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold">{progress.streak}</h4>
                    <p className="text-sm font-medium text-muted-foreground">Sequência de dias</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProgressChart;

function AlertTriangle(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  )
}

function Circle(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
    </svg>
  )
}
