
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Concurso, Question } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, FileText, Download, ChevronLeft, MessageCircle } from 'lucide-react';

// Mock data for concursos (This would typically come from an API)
const mockConcursos: Concurso[] = [
  {
    id: '1',
    title: 'Concurso INSS 2023',
    description: 'Concurso para Técnico do Seguro Social do INSS com 1.000 vagas em todo o Brasil.',
    thumbnail: '/placeholder.svg',
    organizacao: 'Instituto Nacional do Seguro Social',
    dataProva: '15/12/2023',
    status: 'aberto',
    materias: [
      {
        id: '101',
        title: 'Direito Constitucional',
        description: 'Princípios fundamentais, direitos e garantias fundamentais.',
        questoes: [],
        progress: 45
      },
      {
        id: '102',
        title: 'Direito Administrativo',
        description: 'Administração pública, atos administrativos.',
        questoes: [],
        progress: 30
      },
      {
        id: '103',
        title: 'Legislação Previdenciária',
        description: 'Seguridade Social, Previdência Social, Regimes.',
        questoes: [],
        progress: 65
      }
    ],
    documentos: [
      {
        id: 'd1',
        tipo: 'edital',
        titulo: 'Edital INSS 2023',
        url: '#',
        dataCriacao: new Date('2023-05-10'),
        processado: true
      },
      {
        id: 'd2',
        tipo: 'prova',
        titulo: 'Prova Anterior INSS 2022',
        url: '#',
        dataCriacao: new Date('2022-12-15'),
        processado: true
      }
    ]
  },
  {
    id: '2',
    title: 'Concurso TRT 10ª Região',
    description: 'Concurso para Técnico e Analista Judiciário do TRT da 10ª Região.',
    thumbnail: '/placeholder.svg',
    organizacao: 'Tribunal Regional do Trabalho da 10ª Região',
    dataProva: '22/01/2024',
    status: 'aberto',
    materias: [
      {
        id: '201',
        title: 'Direito do Trabalho',
        description: 'Consolidação das Leis do Trabalho, contratos, rescisões.',
        questoes: [],
        progress: 20
      },
      {
        id: '202',
        title: 'Processo do Trabalho',
        description: 'Justiça do Trabalho, Ministério Público do Trabalho, processo judiciário.',
        questoes: [],
        progress: 15
      }
    ],
    documentos: [
      {
        id: 'd3',
        tipo: 'edital',
        titulo: 'Edital TRT 10ª Região',
        url: '#',
        dataCriacao: new Date('2023-07-20'),
        processado: true
      }
    ]
  }
];

const ConcursoDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("visao-geral");
  const { toast } = useToast();
  
  // Find the concurso with the matching id
  const concurso = mockConcursos.find(c => c.id === id);
  
  if (!concurso) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Concurso não encontrado</h1>
        <Link to="/concursos">
          <Button>Voltar para Concursos</Button>
        </Link>
      </div>
    );
  }

  const handleStartPractice = (materiaId: string) => {
    toast({
      title: "Modo Prática Iniciado",
      description: `Iniciando prática para ${concurso.materias.find(m => m.id === materiaId)?.title}`,
    });
  };

  const handleDownload = (documentoId: string) => {
    toast({
      title: "Download Iniciado",
      description: `Baixando ${concurso.documentos.find(d => d.id === documentoId)?.titulo}`,
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <Link to="/concursos" className="flex items-center text-primary hover:underline mb-2">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Voltar para Concursos
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{concurso.title}</h1>
            <p className="text-muted-foreground">{concurso.organizacao}</p>
          </div>
          {concurso.status === 'aberto' && (
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Inscrições Abertas
            </div>
          )}
          {concurso.status === 'encerrado' && (
            <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
              Inscrições Encerradas
            </div>
          )}
          {concurso.status === 'previsto' && (
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Previsão de Edital
            </div>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="materias">Matérias</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
        </TabsList>

        <TabsContent value="visao-geral">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Sobre o Concurso</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{concurso.description}</p>
                
                {concurso.dataProva && (
                  <div className="mb-4">
                    <h3 className="font-semibold">Data da Prova:</h3>
                    <p>{concurso.dataProva}</p>
                  </div>
                )}
                
                <div className="mb-4">
                  <h3 className="font-semibold">Status:</h3>
                  <p className="capitalize">{concurso.status.replace('-', ' ')}</p>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-semibold">Organização:</h3>
                  <p>{concurso.organizacao}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recursos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full flex items-center justify-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Resumos da Banca
                </Button>
                
                <Button className="w-full flex items-center justify-center gap-2" variant="outline">
                  <MessageCircle className="h-4 w-4" />
                  Perguntar à IA
                </Button>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full flex items-center justify-center gap-2" variant="outline">
                      <FileText className="h-4 w-4" />
                      Visualizar Edital
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edital do Concurso</DialogTitle>
                    </DialogHeader>
                    <div className="max-h-[60vh] overflow-y-auto">
                      <div className="p-4 border rounded">
                        <p className="text-center text-muted-foreground">
                          Visualização do edital indisponível. Baixe o arquivo para visualizar.
                        </p>
                      </div>
                    </div>
                    <Button className="mt-4 w-full flex items-center justify-center gap-2">
                      <Download className="h-4 w-4" />
                      Baixar Edital
                    </Button>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="materias">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {concurso.materias.map((materia) => (
              <Card key={materia.id}>
                <CardHeader>
                  <CardTitle>{materia.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-muted-foreground">{materia.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Seu progresso</span>
                      <span>{materia.progress || 0}%</span>
                    </div>
                    <Progress value={materia.progress || 0} />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      className="flex-1"
                      onClick={() => handleStartPractice(materia.id)}
                    >
                      Praticar
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Conteúdo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="documentos">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {concurso.documentos.map((documento) => (
              <Card key={documento.id}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    {documento.titulo}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2 text-sm text-muted-foreground">
                    Tipo: <span className="capitalize">{documento.tipo}</span>
                  </p>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Adicionado em: {documento.dataCriacao.toLocaleDateString()}
                  </p>
                  
                  <div className="flex space-x-2">
                    <Button
                      className="flex-1 flex items-center justify-center gap-2"
                      onClick={() => handleDownload(documento.id)}
                    >
                      <Download className="h-4 w-4" />
                      Baixar
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Visualizar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConcursoDetails;
