
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Circle, Clock, FileText, List, Lock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { mockCourses } from '@/lib/data';
import { Course, CourseModule, ModuleContent } from '@/lib/types';

const ContentTypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'pdf':
      return <FileText className="h-4 w-4 mr-2" />;
    case 'interactive':
      return <List className="h-4 w-4 mr-2" />;
    default:
      return null;
  }
};

const CourseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [activeContentId, setActiveContentId] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      const foundCourse = mockCourses.find(c => c.id === id);
      setCourse(foundCourse || null);
      
      if (foundCourse && foundCourse.modules.length > 0) {
        setActiveModuleId(foundCourse.modules[0].id);
        if (foundCourse.modules[0].content.length > 0) {
          setActiveContentId(foundCourse.modules[0].content[0].id);
        }
      }
      
      setIsLoaded(true);
    }, 800);
    return () => clearTimeout(timer);
  }, [id]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "intermediate":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const activeModule = course?.modules.find(m => m.id === activeModuleId);
  const activeContent = activeModule?.content.find(c => c.id === activeContentId);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container pt-24 pb-16">
          <div className="flex justify-center items-center h-[50vh]">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-muted rounded w-60"></div>
              <div className="h-4 bg-muted rounded w-40"></div>
              <div className="h-80 bg-muted rounded w-full max-w-3xl"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container pt-24 pb-16">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold mb-4">Curso não encontrado</h1>
            <p className="text-muted-foreground mb-8">
              O curso que você está procurando não existe ou foi removido.
            </p>
            <Button asChild>
              <Link to="/courses">Voltar para Cursos</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const levelColorClass = getLevelColor(course.level);
  const courseProgress = course.progress || 0;

  // Calculate total content items and completed items
  const totalContentItems = course.modules.reduce((sum, module) => sum + module.content.length, 0);
  const completedContentItems = course.modules.reduce((sum, module) => 
    sum + module.content.filter(content => content.isCompleted).length, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container pt-24 pb-16 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-8 animate-slide-up">
              <Link 
                to="/courses" 
                className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
                Voltar para Cursos
              </Link>
              
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge className={levelColorClass}>
                  {course.level === 'beginner' ? 'Iniciante' : 
                   course.level === 'intermediate' ? 'Intermediário' : 'Avançado'}
                </Badge>
                <Badge variant="outline">{course.category}</Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  {course.duration}
                </div>
              </div>
              
              <h1 className="text-3xl font-bold tracking-tight mb-2">{course.title}</h1>
              <p className="text-muted-foreground mb-4">{course.description}</p>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progresso do curso</span>
                  <span className="font-medium">{courseProgress}%</span>
                </div>
                <Progress value={courseProgress} className="h-2" />
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div className="bg-muted/40 px-4 py-2 rounded-md text-center">
                  <div className="text-2xl font-bold">{course.modules.length}</div>
                  <div className="text-sm text-muted-foreground">Módulos</div>
                </div>
                <div className="bg-muted/40 px-4 py-2 rounded-md text-center">
                  <div className="text-2xl font-bold">{totalContentItems}</div>
                  <div className="text-sm text-muted-foreground">Aulas</div>
                </div>
                <div className="bg-muted/40 px-4 py-2 rounded-md text-center">
                  <div className="text-2xl font-bold">{completedContentItems}</div>
                  <div className="text-sm text-muted-foreground">Completadas</div>
                </div>
              </div>
            </div>
            
            <div className="mb-8 animate-slide-up delay-100">
              <Card className="border">
                <CardHeader className="pb-3">
                  <CardTitle>Conteúdo</CardTitle>
                </CardHeader>
                <CardContent className="pb-1">
                  {activeContent ? (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{activeContent.title}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mb-4">
                          <ContentTypeIcon type={activeContent.type} />
                          <span className="capitalize mr-3">{activeContent.type}</span>
                          {activeContent.duration && (
                            <>
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{activeContent.duration}</span>
                            </>
                          )}
                        </div>
                        
                        {activeContent.type === 'pdf' && (
                          <div className="aspect-[3/4] bg-muted rounded-md border border-border flex items-center justify-center mb-4">
                            <div className="text-center">
                              <FileText className="h-12 w-12 text-muted-foreground mb-2" />
                              <p className="text-muted-foreground">Visualizar PDF</p>
                            </div>
                          </div>
                        )}
                        
                        {activeContent.type === 'interactive' && (
                          <div className="aspect-[16/10] bg-muted rounded-md border border-border flex items-center justify-center mb-4">
                            <div className="text-center">
                              <List className="h-12 w-12 text-muted-foreground mb-2" />
                              <p className="text-muted-foreground">Iniciar exercícios interativos</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Descrição</h4>
                        <p className="text-muted-foreground">
                          Este conteúdo faz parte do módulo "{activeModule?.title}". 
                          {activeContent.type === 'pdf' && " Estude este material de apoio para aprofundar seus conhecimentos sobre o tema."}
                          {activeContent.type === 'interactive' && " Complete os exercícios interativos para testar seus conhecimentos."}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Selecione um conteúdo para visualizar</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="col-span-1 animate-slide-up delay-200">
            <Card className="border">
              <CardHeader className="pb-3">
                <CardTitle>Módulos do Curso</CardTitle>
                <CardDescription>
                  {course.modules.length} módulos • {totalContentItems} aulas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {course.modules.map((module, moduleIndex) => (
                    <div key={module.id} className="border rounded-md overflow-hidden">
                      <div 
                        className={`p-3 flex items-center justify-between cursor-pointer ${
                          module.id === activeModuleId ? 'bg-muted' : ''
                        }`}
                        onClick={() => setActiveModuleId(module.id === activeModuleId ? null : module.id)}
                      >
                        <div className="flex items-center">
                          <div className="h-6 w-6 rounded-full bg-muted-foreground/20 flex items-center justify-center mr-3 text-xs font-medium">
                            {moduleIndex + 1}
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">{module.title}</h4>
                            <p className="text-xs text-muted-foreground">
                              {module.content.length} aulas
                              {module.isCompleted && ' • Completo'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {module.isCompleted ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <div className="text-xs font-medium text-muted-foreground">
                              {module.content.filter(c => c.isCompleted).length}/{module.content.length}
                            </div>
                          )}
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
                            className={`ml-2 transition-transform ${
                              module.id === activeModuleId ? 'rotate-180' : ''
                            }`}
                          >
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        </div>
                      </div>
                      
                      {module.id === activeModuleId && (
                        <div className="p-3 pt-0 border-t">
                          {module.content.map((content, index) => (
                            <div 
                              key={content.id} 
                              className={`py-2 px-3 rounded-md flex items-center justify-between cursor-pointer ${
                                content.id === activeContentId 
                                  ? 'bg-primary/10'
                                  : 'hover:bg-muted'
                              }`}
                              onClick={() => setActiveContentId(content.id)}
                            >
                              <div className="flex items-center">
                                <div className="mr-3">
                                  {content.isCompleted ? (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <Circle className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </div>
                                <div>
                                  <p className="text-sm font-medium">{content.title}</p>
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <ContentTypeIcon type={content.type} />
                                    <span className="capitalize">
                                      {content.type}
                                    </span>
                                    {content.duration && (
                                      <>
                                        <span className="mx-1">•</span>
                                        <span>{content.duration}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseDetails;
