
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserProgress } from '@/lib/types';

type ProgressChartProps = {
  progress: UserProgress;
};

const ProgressChart = ({ progress }: ProgressChartProps) => {
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

  return (
    <Card className="border shadow-sm animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Desempenho</CardTitle>
        <CardDescription>Visualize seu progresso por categoria e curso</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="categories">
          <TabsList className="mb-6">
            <TabsTrigger value="categories">Por Categoria</TabsTrigger>
            <TabsTrigger value="courses">Por Curso</TabsTrigger>
            <TabsTrigger value="overall">Geral</TabsTrigger>
          </TabsList>
          
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
