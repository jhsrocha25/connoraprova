
import { UserProgress } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Area, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Award, BookOpen, TrendingDown, TrendingUp } from 'lucide-react';

type OverviewContentProps = {
  progress: UserProgress;
  overallPercentage: number;
  level: { level: string; color: string };
};

const OverviewContent = ({ progress, overallPercentage, level }: OverviewContentProps) => {
  // Mock data for historical performance
  const mockHistoricalData = [
    { date: '01/09', correct: 65, incorrect: 35, total: 100 },
    { date: '08/09', correct: 68, incorrect: 32, total: 100 },
    { date: '15/09', correct: 72, incorrect: 28, total: 100 },
    { date: '22/09', correct: 70, incorrect: 30, total: 100 },
    { date: '29/09', correct: 75, incorrect: 25, total: 100 },
    { date: '06/10', correct: 82, incorrect: 18, total: 100 },
    { date: '13/10', correct: 85, incorrect: 15, total: 100 },
  ];

  return (
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
  );
};

export default OverviewContent;
