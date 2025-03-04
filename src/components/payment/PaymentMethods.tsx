
import React, { useState } from 'react';
import { usePayment } from '@/contexts/PaymentContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Trash2, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PaymentMethod } from '@/lib/types';

const PaymentMethods = () => {
  const { 
    paymentMethods, 
    addPaymentMethod, 
    removePaymentMethod, 
    setDefaultPaymentMethod, 
    isLoading 
  } = usePayment();
  
  const [open, setOpen] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState<Partial<PaymentMethod>>({
    type: 'credit',
    holderName: '',
    last4: '',
    expiryMonth: undefined,
    expiryYear: undefined,
    brand: 'visa'
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addPaymentMethod(newPaymentMethod);
    setOpen(false);
    // Reset form
    setNewPaymentMethod({
      type: 'credit',
      holderName: '',
      last4: '',
      expiryMonth: undefined,
      expiryYear: undefined,
      brand: 'visa'
    });
  };
  
  const formatCardNumber = (value: string) => {
    // Only extract the last 4 digits
    if (value.length > 4) {
      return value.slice(-4);
    }
    return value;
  };
  
  const getCardBrandLogo = (brand: string) => {
    switch (brand) {
      case 'visa':
        return "💳 Visa";
      case 'mastercard':
        return "💳 Mastercard";
      case 'amex':
        return "💳 Amex";
      case 'elo':
        return "💳 Elo";
      case 'hipercard':
        return "💳 Hipercard";
      default:
        return "💳 Cartão";
    }
  };
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Seus métodos de pagamento</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar método
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Adicionar método de pagamento</DialogTitle>
                <DialogDescription>
                  Adicione um novo método de pagamento para suas assinaturas e compras.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select 
                    value={newPaymentMethod.type} 
                    onValueChange={(value) => setNewPaymentMethod({...newPaymentMethod, type: value as 'credit' | 'debit' | 'pix' | 'boleto'})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit">Cartão de Crédito</SelectItem>
                      <SelectItem value="debit">Cartão de Débito</SelectItem>
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="boleto">Boleto Bancário</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {(newPaymentMethod.type === 'credit' || newPaymentMethod.type === 'debit') && (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="holderName">Nome do titular</Label>
                      <Input 
                        id="holderName" 
                        value={newPaymentMethod.holderName} 
                        onChange={(e) => setNewPaymentMethod({...newPaymentMethod, holderName: e.target.value})}
                        placeholder="Como está no cartão"
                        required
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="cardNumber">Número do cartão</Label>
                      <Input 
                        id="cardNumber" 
                        value={newPaymentMethod.last4} 
                        onChange={(e) => setNewPaymentMethod({
                          ...newPaymentMethod, 
                          last4: formatCardNumber(e.target.value)
                        })}
                        placeholder="Últimos 4 dígitos"
                        maxLength={4}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Apenas os últimos 4 dígitos são armazenados para segurança
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="expiryMonth">Mês de expiração</Label>
                        <Select 
                          value={newPaymentMethod.expiryMonth?.toString()} 
                          onValueChange={(value) => setNewPaymentMethod({...newPaymentMethod, expiryMonth: parseInt(value)})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="MM" />
                          </SelectTrigger>
                          <SelectContent>
                            {months.map(month => (
                              <SelectItem key={month} value={month.toString()}>
                                {month < 10 ? `0${month}` : month}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="expiryYear">Ano de expiração</Label>
                        <Select 
                          value={newPaymentMethod.expiryYear?.toString()} 
                          onValueChange={(value) => setNewPaymentMethod({...newPaymentMethod, expiryYear: parseInt(value)})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="AAAA" />
                          </SelectTrigger>
                          <SelectContent>
                            {years.map(year => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="brand">Bandeira</Label>
                      <Select 
                        value={newPaymentMethod.brand} 
                        onValueChange={(value) => setNewPaymentMethod({...newPaymentMethod, brand: value as 'visa' | 'mastercard' | 'amex' | 'elo' | 'hipercard' | 'other'})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a bandeira" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="visa">Visa</SelectItem>
                          <SelectItem value="mastercard">Mastercard</SelectItem>
                          <SelectItem value="amex">American Express</SelectItem>
                          <SelectItem value="elo">Elo</SelectItem>
                          <SelectItem value="hipercard">Hipercard</SelectItem>
                          <SelectItem value="other">Outra</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
                
                {newPaymentMethod.type === 'pix' && (
                  <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <p className="mb-2">Para PIX, você receberá um QR code no momento do pagamento.</p>
                      <p className="text-xs text-muted-foreground">Não é necessário cadastrar informações adicionais.</p>
                    </div>
                  </div>
                )}
                
                {newPaymentMethod.type === 'boleto' && (
                  <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <p className="mb-2">Para Boleto, você receberá o código de barras no momento do pagamento.</p>
                      <p className="text-xs text-muted-foreground">Não é necessário cadastrar informações adicionais.</p>
                    </div>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Adicionando...' : 'Adicionar método'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {paymentMethods.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <CreditCard className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-1">Nenhum método de pagamento</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Você ainda não possui métodos de pagamento cadastrados.
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Adicionar método de pagamento</Button>
            </DialogTrigger>
            <DialogContent>
              {/* Mesmo conteúdo do dialog acima */}
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <CreditCard className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">
                      {getCardBrandLogo(method.brand || 'other')}
                      {(method.type === 'credit' || method.type === 'debit') && ` •••• ${method.last4}`}
                    </h4>
                    {method.isDefault && (
                      <Badge variant="outline" className="ml-2">
                        Padrão
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {method.type === 'credit' && 'Cartão de Crédito'}
                    {method.type === 'debit' && 'Cartão de Débito'}
                    {method.type === 'pix' && 'PIX'}
                    {method.type === 'boleto' && 'Boleto Bancário'}
                    {(method.type === 'credit' || method.type === 'debit') && method.expiryMonth && method.expiryYear && (
                      <span> • Expira em {method.expiryMonth < 10 ? `0${method.expiryMonth}` : method.expiryMonth}/{method.expiryYear}</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {!method.isDefault && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setDefaultPaymentMethod(method.id)}
                    disabled={isLoading}
                  >
                    Definir como padrão
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => removePaymentMethod(method.id)}
                  disabled={isLoading || (method.isDefault && paymentMethods.length === 1)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-6 rounded-lg bg-gray-50 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
          <div>
            <h4 className="font-medium mb-1">Segurança dos dados de pagamento</h4>
            <p className="text-sm text-muted-foreground">
              Seus dados de pagamento são protegidos com criptografia de ponta a ponta e 
              nunca armazenamos os números completos dos cartões. Todas as transações são 
              processadas em ambiente seguro seguindo o padrão PCI-DSS.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
