
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronLeft } from 'lucide-react';

// Import the new component files
import DocumentManagement from '@/components/admin/DocumentManagement';
import UserManagement from '@/components/admin/UserManagement';
import ConcursoManagement from '@/components/admin/ConcursoManagement';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="mb-8 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          className="mr-2"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">Painel Administrativo - Connor Aprova</h1>
      </div>

      <Tabs defaultValue="concursos" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="concursos">Concursos</TabsTrigger>
        </TabsList>

        <TabsContent value="documents">
          <DocumentManagement />
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="concursos">
          <ConcursoManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
