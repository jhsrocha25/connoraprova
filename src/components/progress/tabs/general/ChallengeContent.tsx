
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Brain, Trophy, Zap } from 'lucide-react';

const ChallengeContent = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Zap className="h-5 w-5 mr-2 text-primary" />
            Modo Desafio
          </CardTitle>
          <CardDescription>Teste seus conhecimentos com desafios personalizados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 flex flex-col items-center text-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h4 className="text-sm font-medium mb-1">Desafio Rápido</h4>
              <p className="text-xs text-muted-foreground mb-4">10 questões em 10 minutos</p>
              <Button className="w-full mt-auto" variant="outline">Iniciar</Button>
            </div>
            
            <div className="border rounded-lg p-4 flex flex-col items-center text-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h4 className="text-sm font-medium mb-1">Pontos Fracos</h4>
              <p className="text-xs text-muted-foreground mb-4">Foco nas áreas que você precisa melhorar</p>
              <Button className="w-full mt-auto" variant="outline">Iniciar</Button>
            </div>
            
            <div className="border rounded-lg p-4 flex flex-col items-center text-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <h4 className="text-sm font-medium mb-1">Desafio Semanal</h4>
              <p className="text-xs text-muted-foreground mb-4">Ganhe pontos de experiência e conquistas</p>
              <Button className="w-full mt-auto" variant="outline">Iniciar</Button>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Desafios Concluídos</h4>
            
            <div className="border rounded-lg p-3 flex justify-between items-center">
              <div>
                <h5 className="text-sm font-medium">Desafio Rápido - Direito Constitucional</h5>
                <p className="text-xs text-muted-foreground">Concluído em 18/10/2023</p>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-bold mr-2">8/10</span>
                <Badge>80%</Badge>
              </div>
            </div>
            
            <div className="border rounded-lg p-3 flex justify-between items-center">
              <div>
                <h5 className="text-sm font-medium">Pontos Fracos - Português</h5>
                <p className="text-xs text-muted-foreground">Concluído em 15/10/2023</p>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-bold mr-2">12/15</span>
                <Badge>80%</Badge>
              </div>
            </div>
            
            <div className="border rounded-lg p-3 flex justify-between items-center">
              <div>
                <h5 className="text-sm font-medium">Desafio Semanal #42</h5>
                <p className="text-xs text-muted-foreground">Concluído em 10/10/2023</p>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-bold mr-2">18/25</span>
                <Badge>72%</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChallengeContent;
