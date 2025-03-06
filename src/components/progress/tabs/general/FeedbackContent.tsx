
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  Lightbulb, 
  CheckCircle, 
  XCircle, 
  BookOpen, 
  Zap, 
  Calendar, 
  Download
} from 'lucide-react';
import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { AlertTriangle } from './icons/AlertTriangle';
import { Circle } from './icons/Circle';

const FeedbackContent = () => {
  // Mock data for recommendations
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

  return (
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
  );
};

export default FeedbackContent;
