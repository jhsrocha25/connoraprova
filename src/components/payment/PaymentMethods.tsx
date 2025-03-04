import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MoreHorizontal, Trash2, CreditCard, CheckCircle, PlusCircle, Landmark, QrCode } from 'lucide-react';
import { PaymentMethod } from '@/lib/types';
import { usePayment } from '@/contexts/PaymentContext';
import PaymentForm from './PaymentForm';

interface PaymentMethodCardProps {
  method: PaymentMethod;
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
}

const PaymentMethodCard = ({ method, onSetDefault, onDelete }: PaymentMethodCardProps) => {
  const getBrandLogo = (brand?: string) => {
    if (!brand) return null;
    
    switch (brand) {
      case 'visa':
        return <span className="font-bold text-blue-600">VISA</span>;
      case 'mastercard':
        return <span className="font-bold text-red-600">MasterCard</span>;
      case 'amex':
        return <span className="font-bold text-blue-800">AMEX</span>;
      case 'elo':
        return <span className="font-bold text-purple-600">ELO</span>;
      case 'hipercard':
        return <span className="font-bold text-orange-600">Hipercard</span>;
      default:
        return <span className="font-bold">Cartão</span>;
    }
  };

  return (
    <Card className={`relative ${method.isDefault ? 'border-primary' : ''}`}>
      {method.isDefault && (
        <Badge 
          className="absolute right-4 top-4 bg-primary text-primary-foreground"
          variant="outline"
        >
          Padrão
        </Badge>
      )}
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            {method.type === 'credit' || method.type === 'debit' ? (
              <CreditCard className="h-5 w-5 mr-2" />
            ) : method.type === 'pix' ? (
              <QrCode className="h-5 w-5 mr-2" />
            ) : (
              <Landmark className="h-5 w-5 mr-2" />
            )}
            <CardTitle className="text-lg">
              {method.type === 'credit' ? 'Cartão de Crédito' : 
               method.type === 'debit' ? 'Cartão de Débito' : 
               method.type === 'pix' ? 'PIX' : 'Boleto'}
            </CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!method.isDefault && (
                <DropdownMenuItem onClick={() => onSetDefault(method.id)}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Definir como padrão
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onDelete(method.id)} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Remover
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent>
        {(method.type === 'credit' || method.type === 'debit') && (
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <div>
                {getBrandLogo(method.brand)}
              </div>
              <div>
                <p className="text-lg font-mono">•••• {method.last4}</p>
              </div>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{method.holderName}</span>
              <span>{method.expiryMonth}/{method.expiryYear}</span>
            </div>
          </div>
        )}
        
        {method.type === 'pix' && (
          <p className="text-sm text-muted-foreground">
            Pagamento instantâneo via PIX
          </p>
        )}
        
        {method.type === 'boleto' && (
          <p className="text-sm text-muted-foreground">
            Boleto bancário com vencimento em 3 dias úteis
          </p>
        )}
      </CardContent>
      
      <CardFooter className="pt-0">
        <p className="text-xs text-muted-foreground">
          Adicionado em {new Date(method.createdAt).toLocaleDateString()}
        </p>
      </CardFooter>
    </Card>
  );
};

const PaymentMethods = () => {
  const { paymentMethods, removePaymentMethod, setDefaultPaymentMethod, isLoading } = usePayment();
  const [activeTab, setActiveTab] = useState('cards');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [methodToDelete, setMethodToDelete] = useState<string | null>(null);

  const handleDelete = (methodId: string) => {
    setMethodToDelete(methodId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (methodToDelete) {
      await removePaymentMethod(methodToDelete);
      setMethodToDelete(null);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Métodos de Pagamento</h3>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Método de Pagamento</DialogTitle>
              <DialogDescription>
                Adicione um novo método de pagamento à sua conta
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="card" className="mt-4">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="card">Cartão</TabsTrigger>
                <TabsTrigger value="pix">PIX</TabsTrigger>
                <TabsTrigger value="boleto">Boleto</TabsTrigger>
              </TabsList>
              <TabsContent value="card">
                <PaymentForm />
              </TabsContent>
              <TabsContent value="pix">
                <div className="space-y-4 p-4 text-center">
                  <QrCode className="h-24 w-24 mx-auto" />
                  <p>Para pagamentos via PIX, você receberá um QR code e as informações de pagamento no momento da cobrança.</p>
                  <Button onClick={() => {
                    usePayment().addPaymentMethod({
                      type: 'pix',
                      isDefault: false
                    });
                    setShowAddDialog(false);
                  }}>
                    Ativar Pagamento via PIX
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="boleto">
                <div className="space-y-4 p-4 text-center">
                  <Landmark className="h-24 w-24 mx-auto" />
                  <p>Para pagamentos via boleto, você receberá o boleto bancário por e-mail com antecedência da data de vencimento.</p>
                  <Button onClick={() => {
                    usePayment().addPaymentMethod({
                      type: 'boleto',
                      isDefault: false
                    });
                    setShowAddDialog(false);
                  }}>
                    Ativar Pagamento via Boleto
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover Método de Pagamento</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover este método de pagamento? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isLoading}>
              {isLoading ? 'Removendo...' : 'Remover'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {paymentMethods.length === 0 ? (
        <Card className="bg-muted/40">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">Você não possui métodos de pagamento cadastrados</p>
            <Button onClick={() => setShowAddDialog(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Adicionar Método de Pagamento
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {paymentMethods.map((method) => (
            <PaymentMethodCard
              key={method.id}
              method={method}
              onSetDefault={setDefaultPaymentMethod}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;
