
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress as ProgressBar } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, TrendingDown, CheckCircle, XCircle, Award, Calendar, BookOpen, Clock } from 'lucide-react';
import { mockUser, mockCourses } from '@/lib/data';
import Navbar from '@/components/Navbar';
import ProgressChart from '@/components/ProgressChart';

const Progress = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Format date to human readable format
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }).format(date);
  };

  // Sort courses by progress
  const sortedCourses = [...mockCourses]
    .filter(course => {
      const courseProgress = mockUser.progress.courseProgress.find(
        cp => cp.courseId === course.id
      );
      return courseProgress && courseProgress.progress > 0;
    })
    .sort((a, b) => {
      const progressA = mockUser.progress.courseProgress.find(
        cp => cp.courseId === a.id
      )?.progress || 0;
      const progressB = mockUser.progress.courseProgress.find(
        cp => cp.courseId === b.id
      )?.progress || 0;
      return progressB - progressA;
    });

  const userProgress = mockUser.progress;
  const correctPercentage = userProgress.totalQuestionsAnswered > 0
    ? Math.round((userProgress.correctAnswers / userProgress.totalQuestionsAnswered) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container pt-24 pb-16 animate-fade-in">
        <div className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex flex-col md:flex-row items-start justify-between mb-8 gap-4">
            <div className="space-y-1 mb-4 md:mb-0">
              <h1 className="text-3xl font-bold tracking-tight">Meu Progresso</h1>
              <p className="text-muted-foreground">
                Acompanhe seu desempenho e progresso nos estudos
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border animate-slide-up delay-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Award className="h-4 w-4 mr-2 text-primary" />
                  Desempenho em Questões
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userProgress.correctAnswers} / {userProgress.totalQuestionsAnswered}
                </div>
                <p className="text-xs text-muted-foreground">Questões corretas</p>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="text-sm font-medium">Taxa de acerto</p>
                    <p className="text-2xl font-bold">
                      {correctPercentage}%
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
                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                  Sequência de Estudos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userProgress.streak} dias
                </div>
                <p className="text-xs text-muted-foreground">Sequência atual</p>
                <div className="mt-3 space-y-2">
                  <div className="flex gap-1">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-8 w-8 rounded-md flex items-center justify-center ${
                          i < userProgress.streak % 7 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {i < userProgress.streak % 7 && <CheckCircle className="h-4 w-4" />}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Último acesso: {formatDate(userProgress.lastActive)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border animate-slide-up delay-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-primary" />
                  Cursos em Andamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {sortedCourses.length}
                </div>
                <p className="text-xs text-muted-foreground">Cursos ativos</p>
                <div className="mt-3 space-y-3">
                  {sortedCourses.slice(0, 3).map((course) => {
                    const courseProgress = userProgress.courseProgress.find(
                      cp => cp.courseId === course.id
                    );
                    return (
                      <div key={course.id} className="space-y-1">
                        <div className="flex justify-between items-center text-sm">
                          <span className="truncate mr-2">{course.title}</span>
                          <span className="font-medium whitespace-nowrap">{courseProgress?.progress || 0}%</span>
                        </div>
                        <ProgressBar value={courseProgress?.progress || 0} className="h-1.5" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-8">
            <ProgressChart progress={userProgress} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="border animate-slide-up">
              <CardHeader>
                <CardTitle>Desempenho por Categoria</CardTitle>
                <CardDescription>Taxa de acerto por área de conhecimento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {userProgress.performanceByCategory.map((category) => (
                    <div key={category.category}>
                      <div className="mb-2 flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium">{category.category}</h3>
                          <p className="text-xs text-muted-foreground">{category.questionsAttempted} questões respondidas</p>
                        </div>
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
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            category.correctPercentage >= 80 ? "bg-green-500" : 
                            category.correctPercentage >= 60 ? "bg-yellow-500" : 
                            "bg-red-500"
                          }`}
                          style={{ width: `${category.correctPercentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border animate-slide-up delay-100">
              <CardHeader>
                <CardTitle>Histórico de Questões</CardTitle>
                <CardDescription>Suas últimas questões respondidas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUser.progress.questionsHistory.length > 0 ? (
                    mockUser.progress.questionsHistory.slice(0, 5).map((question, index) => (
                      <div key={question.id} className="border-b pb-3 last:border-0">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-sm font-medium line-clamp-1 flex-1">{question.question}</p>
                          {question.isCorrect ? (
                            <CheckCircle className="h-4 w-4 text-green-500 shrink-0 ml-2" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500 shrink-0 ml-2" />
                          )}
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{question.category}</span>
                          <Badge variant="outline" className="text-xs">
                            {question.difficulty}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">Você ainda não respondeu nenhuma questão.</p>
                    </div>
                  )}
                  
                  {mockUser.progress.questionsHistory.length === 0 && (
                    <div className="border-t pt-4 mt-4">
                      <p className="text-sm text-center">
                        Responda questões no AI Chat para construir seu histórico.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border animate-slide-up delay-200">
            <CardHeader>
              <CardTitle>Recomendações Personalizadas</CardTitle>
              <CardDescription>Com base no seu desempenho</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userProgress.performanceByCategory
                  .sort((a, b) => a.correctPercentage - b.correctPercentage)
                  .slice(0, 2)
                  .map((category) => (
                    <div key={category.category} className="rounded-lg border p-4">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Reforçar conhecimentos em {category.category}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Com {category.correctPercentage}% de acertos, recomendamos revisar este conteúdo para melhorar
                            sua performance.
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                
                <div className="rounded-lg border p-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Mantenha sua sequência de estudos</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Você está com uma sequência de {userProgress.streak} dias. Continue estudando para aumentar sua consistência.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Progress;
