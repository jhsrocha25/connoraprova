
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, Eye } from 'lucide-react';
import { Concurso } from '@/lib/types';

interface ConcursoCardProps {
  concurso: Concurso;
  onDelete: (id: string) => void;
}

const ConcursoCard = ({ concurso, onDelete }: ConcursoCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between p-4 border rounded-md hover:bg-accent/10 transition-colors">
      <div className="flex items-center space-x-4">
        {concurso.thumbnail && (
          <div className="h-16 w-16 rounded overflow-hidden">
            <img 
              src={concurso.thumbnail} 
              alt={concurso.title} 
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div>
          <h3 className="font-medium">{concurso.title}</h3>
          <p className="text-sm text-muted-foreground">{concurso.organizacao}</p>
          <div className="flex items-center mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              concurso.status === 'aberto' 
                ? 'bg-green-100 text-green-800' 
                : concurso.status === 'encerrado'
                ? 'bg-gray-100 text-gray-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {concurso.status === 'aberto' 
                ? 'Edital Publicado' 
                : concurso.status === 'encerrado'
                ? 'Finalizado'
                : 'Previsto'
              }
            </span>
            {concurso.dataProva && (
              <span className="text-xs text-muted-foreground ml-2">
                Prova: {concurso.dataProva}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate(`/concursos/${concurso.id}`)}
          className="flex items-center gap-1"
        >
          <Eye className="h-3.5 w-3.5" />
          Ver
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
        >
          <Edit className="h-3.5 w-3.5" />
          Editar
        </Button>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={() => onDelete(concurso.id)}
          className="flex items-center gap-1"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Remover
        </Button>
      </div>
    </div>
  );
};

export default ConcursoCard;
