
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

const UserManagement = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciamento de Usuários</CardTitle>
        <CardDescription>
          Visualize e gerencie os usuários da plataforma
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <p className="font-medium">Usuário {i}</p>
                  <p className="text-sm text-muted-foreground">usuario{i}@email.com</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Editar</Button>
                <Button variant="outline" size="sm">Gerenciar</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserManagement;
