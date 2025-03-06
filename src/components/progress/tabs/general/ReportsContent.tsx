
import { UserProgress } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BookOpen, Clock, Download, Share2 } from 'lucide-react';

type ReportsContentProps = {
  progress: UserProgress;
};

const ReportsContent = ({ progress }: ReportsContentProps) => {
  // Mock data for time analysis
  const mockTimeData = [
    { category: 'Direito Constitucional', avgTime: 65, benchmark: 75 },
    { category: 'Direito Administrativo', avgTime: 82, benchmark: 77 },
    { category: 'Raciocínio Lógico', avgTime: 45, benchmark: 60 },
    { category: 'Língua Portuguesa', avgTime: 55, benchmark: 65 },
  ];

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
  );
};

export default ReportsContent;
