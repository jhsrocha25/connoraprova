import { useState } from 'react';
import { 
  LayoutDashboard, 
  BarChart2, 
  BookOpen, 
  PieChart as PieChartIcon,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { mockUser } from '@/lib/data';

type UserProgress = typeof mockUser.progress;

type ProgressChartProps = {
  progress: UserProgress;
  defaultTab?: string;
};

const ProgressChart = ({ progress, defaultTab = "general" }: ProgressChartProps) => {
  const [selectedSubTab, setSelectedSubTab] = useState("overview");

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const categoryPerformanceData = progress.performanceByCategory.map(category => ({
    name: category.category,
    correct: category.correctPercentage,
    incorrect: 100 - category.correctPercentage,
  }));

  const overallPerformanceData = [
    { name: 'Corretas', value: progress.correctAnswers },
    { name: 'Incorretas', value: progress.totalQuestionsAnswered - progress.correctAnswers },
  ];

  const courseProgressData = progress.courseProgress.map(course => ({
    name: `Curso ${course.courseId}`,
    progress: course.progress,
  }));

  return (
    <Card className="border shadow-sm animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Desempenho</CardTitle>
        <CardDescription>Visualize seu progresso detalhado por diversas métricas</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={defaultTab}>
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
          
          <TabsContent value="general">
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Visão Geral do Desempenho</CardTitle>
                <CardDescription>
                  Progresso geral, incluindo questões corretas e taxa de acerto.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Total de Questões Respondidas
                    </h3>
                    <p className="text-4xl font-bold">
                      {progress.totalQuestionsAnswered}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Questões Corretas
                    </h3>
                    <p className="text-4xl font-bold">{progress.correctAnswers}</p>
                    <p className="text-sm text-muted-foreground">
                      {((progress.correctAnswers / progress.totalQuestionsAnswered) * 100).toFixed(2)}% de acerto
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Taxa de Acerto
                  </h3>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                    <span className="text-green-500 font-medium">+5%</span>
                    <span className="ml-1">esta semana</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Desempenho por Categoria</CardTitle>
                <CardDescription>
                  Análise do desempenho em diferentes categorias.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart width={500} height={300} data={categoryPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="correct" fill="#82ca9d" />
                </BarChart>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses">
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Progresso por Curso</CardTitle>
                <CardDescription>
                  Progresso individual em cada curso.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart width={500} height={300} data={courseProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="progress" fill="#8884d8" />
                </BarChart>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overall">
            <Card>
              <CardHeader>
                <CardTitle>Desempenho Geral</CardTitle>
                <CardDescription>
                  Visão geral do desempenho em todas as questões.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={overallPerformanceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {overallPerformanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProgressChart;
