
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText } from 'lucide-react';

const DocumentManagement = () => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Documentos</CardTitle>
          <CardDescription>
            Faça upload de editais, provas e outros documentos para análise pela IA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-dashed border-2 p-4 text-center hover:bg-accent/50 cursor-pointer transition-colors">
              <div className="flex flex-col items-center justify-center h-40">
                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="font-medium">Upload de Edital</p>
                <p className="text-sm text-muted-foreground">
                  PDF, DOC, DOCX (max 10MB)
                </p>
              </div>
            </Card>

            <Card className="border-dashed border-2 p-4 text-center hover:bg-accent/50 cursor-pointer transition-colors">
              <div className="flex flex-col items-center justify-center h-40">
                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="font-medium">Upload de Prova</p>
                <p className="text-sm text-muted-foreground">
                  PDF, DOC, DOCX (max 10MB)
                </p>
              </div>
            </Card>

            <Card className="border-dashed border-2 p-4 text-center hover:bg-accent/50 cursor-pointer transition-colors">
              <div className="flex flex-col items-center justify-center h-40">
                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="font-medium">Upload de Gabarito</p>
                <p className="text-sm text-muted-foreground">
                  PDF, DOC, DOCX (max 10MB)
                </p>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Documentos Recentes</CardTitle>
          <CardDescription>
            Lista de documentos enviados recentemente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <p className="font-medium">Edital Concurso INSS {i}</p>
                    <p className="text-sm text-muted-foreground">Enviado em 01/06/2023</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Visualizar</Button>
                  <Button variant="outline" size="sm">Processar</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default DocumentManagement;
