
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Concurso } from '@/lib/types';
import ConcursoCard from './ConcursoCard';
import AddConcursoDialog from './AddConcursoDialog';
import DeleteConfirmDialog from './DeleteConfirmDialog';

// Mock concursos data for demonstration
const mockConcursos: Concurso[] = [
  {
    id: '1',
    title: 'Concurso INSS 2023',
    description: 'Concurso para Técnico do Seguro Social do Instituto Nacional do Seguro Social',
    thumbnail: 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    organizacao: 'INSS',
    dataProva: '10/12/2023',
    status: 'encerrado',
    materias: [],
    documentos: []
  },
  {
    id: '2',
    title: 'Concurso Polícia Federal 2024',
    description: 'Concurso para Agente, Escrivão e Delegado da Polícia Federal',
    thumbnail: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    organizacao: 'Polícia Federal',
    dataProva: '15/03/2024',
    status: 'aberto',
    materias: [],
    documentos: []
  },
  {
    id: '3',
    title: 'Concurso TRT 4ª Região 2024',
    description: 'Concurso para Técnico e Analista Judiciário do Tribunal Regional do Trabalho',
    thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    organizacao: 'TRT 4ª Região',
    dataProva: '22/05/2024',
    status: 'previsto',
    materias: [],
    documentos: []
  }
];

const ConcursoManagement = () => {
  const [concursos, setConcursos] = useState<Concurso[]>(mockConcursos);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [concursoToDelete, setConcursoToDelete] = useState<string | null>(null);

  const handleAddConcurso = (newConcurso: Concurso) => {
    setConcursos(prev => [...prev, newConcurso]);
  };

  const handleConfirmDelete = (id: string) => {
    setConcursoToDelete(id);
    setIsConfirmDeleteOpen(true);
  };

  const handleDeleteConcurso = () => {
    if (!concursoToDelete) return;
    
    const concursoName = concursos.find(c => c.id === concursoToDelete)?.title;
    setConcursos(prev => prev.filter(concurso => concurso.id !== concursoToDelete));
    setIsConfirmDeleteOpen(false);
    setConcursoToDelete(null);
    
    toast({
      title: "Concurso removido",
      description: `O concurso "${concursoName}" foi removido com sucesso.`
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Gerenciamento de Concursos</CardTitle>
          <CardDescription>
            Crie, edite e remova concursos na plataforma
          </CardDescription>
        </div>
        <AddConcursoDialog onAddConcurso={handleAddConcurso} />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {concursos.length > 0 ? (
            concursos.map((concurso) => (
              <ConcursoCard 
                key={concurso.id} 
                concurso={concurso} 
                onDelete={handleConfirmDelete} 
              />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhum concurso cadastrado.</p>
            </div>
          )}
        </div>
      </CardContent>

      <DeleteConfirmDialog 
        isOpen={isConfirmDeleteOpen}
        onOpenChange={setIsConfirmDeleteOpen}
        onConfirm={handleDeleteConcurso}
      />
    </Card>
  );
};

export default ConcursoManagement;
