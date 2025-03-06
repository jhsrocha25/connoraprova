
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Calendar, Clock, FileText, History, TrendingUp } from 'lucide-react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const HistoryContent = () => {
  // Mock data for simulados
  const mockSimulados = [
    { id: 'sim1', date: '15/10/2023', title: 'Simulado Completo TRF', score: 82, total: 120, time: '4h30m' },
    { id: 'sim2', date: '01/10/2023', title: 'Simulado Parcial - Direito', score: 78, total: 60, time: '2h15m' },
    { id: 'sim3', date: '15/09/2023', title: 'Simulado Completo MPF', score: 75, total: 100, time: '4h00m' }
  ];

  return (
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
  );
};

export default HistoryContent;
