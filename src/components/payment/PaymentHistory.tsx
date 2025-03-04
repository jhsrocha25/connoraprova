
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Info } from 'lucide-react';
import { usePayment } from '@/contexts/PaymentContext';
import { PaymentInvoice } from '@/lib/types';

const PaymentHistory = () => {
  const { invoices, downloadInvoice, isLoading } = usePayment();

  const handleDownload = async (invoiceId: string) => {
    await downloadInvoice(invoiceId);
  };

  const getStatusBadge = (status: PaymentInvoice['status']) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Pago</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-amber-500 text-amber-600">Pendente</Badge>;
      case 'failed':
        return <Badge variant="destructive">Falhou</Badge>;
      case 'refunded':
        return <Badge variant="outline" className="border-blue-500 text-blue-600">Reembolsado</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const getPaymentMethodName = (method: PaymentInvoice['paymentMethod']) => {
    switch (method) {
      case 'credit':
        return 'Cartão de Crédito';
      case 'debit':
        return 'Cartão de Débito';
      case 'pix':
        return 'PIX';
      case 'boleto':
        return 'Boleto';
      default:
        return 'Desconhecido';
    }
  };

  if (invoices.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">Nenhum pagamento registrado</p>
            <p className="text-sm text-muted-foreground">
              O histórico de pagamentos aparecerá aqui após sua primeira cobrança
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Pagamentos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Método</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    {new Date(invoice.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell>{getPaymentMethodName(invoice.paymentMethod)}</TableCell>
                  <TableCell className="text-right">
                    {invoice.status === 'paid' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownload(invoice.id)}
                        disabled={isLoading}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Comprovante
                      </Button>
                    )}
                    {invoice.status === 'pending' && (
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.location.href = '/payment'}
                        >
                          <Info className="h-4 w-4 mr-2" />
                          Detalhes
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentHistory;
