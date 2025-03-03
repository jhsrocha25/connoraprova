
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, BookOpen, BarChart2, TrendingUp, Award, MessageSquare } from 'lucide-react';
import Navbar from '@/components/Navbar';
import CourseCard from '@/components/CourseCard';
import { mockCourses, mockUser } from '@/lib/data';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Calculate overall progress
  const totalProgress = mockUser.progress.courseProgress.reduce((sum, course) => sum + course.progress, 0);
  const averageProgress = Math.round(totalProgress / mockUser.progress.courseProgress.length);

  // Get courses sorted by progress
  const inProgressCourses = [...mockCourses]
    .filter(course => (course.progress || 0) > 0 && (course.progress || 0) < 100)
    .sort((a, b) => (b.progress || 0) - (a.progress || 0))
    .slice(0, 3);
  
  // Get courses sorted by last accessed (most recent first)
  const recentCourses = [...mockCourses]
    .sort((a, b) => {
      const courseAProgress = mockUser.progress.courseProgress.find(p => p.courseId === a.id);
      const courseBProgress = mockUser.progress.courseProgress.find(p => p.courseId === b.id);
      
      if (!courseAProgress?.lastAccessed) return 1;
      if (!courseBProgress?.lastAccessed) return -1;
      
      return new Date(courseBProgress.lastAccessed).getTime() - new Date(courseAProgress.lastAccessed).getTime();
    })
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container pt-24 pb-16 animate-fade-in">
        <div className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex flex-col md:flex-row items-start justify-between mb-8 gap-4">
            <div className="space-y-1 mb-4 md:mb-0">
              <h1 className="text-3xl font-bold tracking-tight">Bem-vindo, {mockUser.name.split(' ')[0]}</h1>
              <p className="text-muted-foreground">
                Continue seus estudos para sua preparação em concursos públicos.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="h-12 md:h-10 w-full sm:w-auto text-base md:text-sm px-4">
                <Link to="/courses" className="flex items-center justify-center">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Explorar Cursos
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-12 md:h-10 w-full sm:w-auto text-base md:text-sm px-4">
                <Link to="/aichat" className="flex items-center justify-center">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Gerar Questões
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border animate-slide-up delay-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Award className="h-4 w-4 mr-2 text-primary" />
                  Desempenho Geral
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockUser.progress.correctAnswers} / {mockUser.progress.totalQuestionsAnswered}
                </div>
                <p className="text-xs text-muted-foreground">Questões corretas</p>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="text-sm font-medium">Taxa de acerto</p>
                    <p className="text-2xl font-bold">
                      {Math.round((mockUser.progress.correctAnswers / mockUser.progress.totalQuestionsAnswered) * 100)}%
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                      <span className="text-green-500 font-medium">+5%</span>
                      <span className="ml-1">esta semana</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border animate-slide-up delay-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-primary" />
                  Progresso nos Cursos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {averageProgress}%
                </div>
                <p className="text-xs text-muted-foreground">Progresso médio</p>
                <div className="mt-3 space-y-2">
                  {mockUser.progress.courseProgress.slice(0, 3).map((course, index) => (
                    <div key={course.courseId} className="space-y-1">
                      <div className="flex justify-between items-center text-sm">
                        <span>Curso {course.courseId}</span>
                        <span className="font-medium">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border animate-slide-up delay-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <BarChart2 className="h-4 w-4 mr-2 text-primary" />
                  Desempenho por Categoria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockUser.progress.performanceByCategory[0].category}
                </div>
                <p className="text-xs text-muted-foreground">Melhor categoria</p>
                <div className="mt-3 space-y-3">
                  {mockUser.progress.performanceByCategory.map((category) => (
                    <div key={category.category} className="flex items-center justify-between">
                      <span className="text-sm mr-4 truncate max-w-[180px]">{category.category}</span>
                      <div className="flex items-center">
                        <span className="text-sm font-semibold mr-2">{category.correctPercentage}%</span>
                        <div className="w-16 h-2 bg-muted overflow-hidden rounded-full">
                          <div 
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${category.correctPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-8">
            <Tabs defaultValue="in-progress" className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                <TabsList className="h-12 sm:h-10">
                  <TabsTrigger value="in-progress">Em Progresso</TabsTrigger>
                  <TabsTrigger value="recent">Acessados Recentemente</TabsTrigger>
                </TabsList>
                <Link 
                  to="/courses" 
                  className="text-sm font-medium text-primary hover:underline flex items-center bg-transparent py-2 px-3 border border-transparent rounded-md hover:bg-primary/5 transition-colors"
                >
                  Ver todos
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-1"
                  >
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </Link>
              </div>
              <TabsContent value="in-progress" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {inProgressCourses.map((course) => (
                    <div key={course.id} className="animate-scale-in">
                      <CourseCard course={course} />
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="recent" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {recentCourses.map((course) => (
                    <div key={course.id} className="animate-scale-in">
                      <CourseCard course={course} />
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="animate-slide-up">
              <Card className="border h-full">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                    Assistente IA
                  </CardTitle>
                  <CardDescription>
                    Gere questões personalizadas e receba feedback instantâneo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg bg-muted/50 p-4 mb-4">
                    <p className="text-sm font-medium mb-2">Com o nosso assistente de IA, você pode:</p>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        Gerar questões de concursos sobre qualquer tema
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        Receber explicações detalhadas sobre as respostas
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        Praticar com diferentes níveis de dificuldade
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        Focar em temas específicos para fortalecer seus conhecimentos
                      </li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full h-12 md:h-10 text-base md:text-sm">
                    <Link to="/aichat">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Iniciar Conversa com IA
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="animate-slide-up delay-100">
              <Card className="border h-full">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-primary" />
                    Modo Simulado
                  </CardTitle>
                  <CardDescription>
                    Pratique com provas cronometradas para simular a experiência do concurso
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg bg-muted/50 p-4 mb-4">
                    <p className="text-sm font-medium mb-2">Benefícios do Modo Simulado:</p>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        Experimente a pressão do tempo real de prova
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        Provas personalizadas com base nas matérias dos concursos
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        Feedback detalhado sobre seu desempenho
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        Compare seus resultados com outros candidatos
                      </li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full h-12 md:h-10 text-base md:text-sm"
                    asChild
                  >
                    <Link to="/aichat">
                      <Clock className="h-4 w-4 mr-2" />
                      Iniciar Simulado
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
