
import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Concurso } from '@/lib/types';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface AddConcursoDialogProps {
  onAddConcurso: (concurso: Concurso) => void;
}

const AddConcursoDialog = ({ onAddConcurso }: AddConcursoDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newConcurso, setNewConcurso] = useState<Partial<Concurso>>({
    title: '',
    description: '',
    thumbnail: '',
    organizacao: '',
    dataProva: '',
    status: 'previsto'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewConcurso(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewConcurso(prev => ({ ...prev, [name]: value }));
  };

  const handleAddConcurso = () => {
    // Validation
    if (!newConcurso.title || !newConcurso.description || !newConcurso.organizacao) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const newConcursoComplete: Concurso = {
      ...newConcurso as Concurso,
      id: Date.now().toString(), // Simple ID generation
      materias: [],
      documentos: []
    };

    onAddConcurso(newConcursoComplete);
    
    setNewConcurso({
      title: '',
      description: '',
      thumbnail: '',
      organizacao: '',
      dataProva: '',
      status: 'previsto'
    });
    
    setIsOpen(false);
    
    toast({
      title: "Concurso adicionado",
      description: `O concurso "${newConcursoComplete.title}" foi adicionado com sucesso.`
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Adicionar Novo Concurso
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Concurso</DialogTitle>
          <DialogDescription>
            Preencha os detalhes do novo concurso que será exibido na plataforma.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              name="title"
              placeholder="Ex: Concurso INSS 2024"
              value={newConcurso.title}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Descreva os detalhes do concurso"
              value={newConcurso.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="thumbnail">URL da Imagem</Label>
            <Input
              id="thumbnail"
              name="thumbnail"
              placeholder="https://exemplo.com/imagem.jpg"
              value={newConcurso.thumbnail}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="organizacao">Organização *</Label>
            <Input
              id="organizacao"
              name="organizacao"
              placeholder="Ex: INSS, Polícia Federal, etc."
              value={newConcurso.organizacao}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dataProva">Data da Prova</Label>
            <Input
              id="dataProva"
              name="dataProva"
              placeholder="DD/MM/AAAA"
              value={newConcurso.dataProva}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={newConcurso.status} 
              onValueChange={(value) => handleSelectChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="previsto">Previsto</SelectItem>
                <SelectItem value="aberto">Edital Publicado</SelectItem>
                <SelectItem value="encerrado">Finalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
          <Button onClick={handleAddConcurso}>Adicionar Concurso</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddConcursoDialog;
