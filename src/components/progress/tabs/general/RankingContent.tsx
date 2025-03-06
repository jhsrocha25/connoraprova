
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Award, Trophy, TrendingUp, Users, Star } from 'lucide-react';

const RankingContent = () => {
  // Mock data for ranking
  const mockRankingData = [
    { id: 1, name: 'Ana Silva', score: 95, medal: 'Ouro' },
    { id: 2, name: 'Carlos Oliveira', score: 93, medal: 'Prata' },
    { id: 3, name: 'Maria Santos', score: 91, medal: 'Bronze' },
    { id: 4, name: 'João Silva', score: 88, medal: null },
    { id: 5, name: 'Usuário Atual', score: 85, isCurrent: true, medal: null },
    { id: 6, name: 'Pedro Alves', score: 82, medal: null },
    { id: 7, name: 'Lucia Ferreira', score: 80, medal: null },
  ];

  return (
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
  );
};

export default RankingContent;
