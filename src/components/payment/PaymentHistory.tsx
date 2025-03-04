
import React, { useEffect, useState } from 'react';
import { usePayment } from '@/contexts/PaymentContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { subscriptionPlans } from '@/lib/subscriptionData';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Download, Receipt, FileText } from 'lucide-react';
import { PaymentInvoice } from '@/lib/types';

const PaymentHistory = () => {
  const { getInvoices, downloadInvoice, isLoading, subscription } = usePayment();
  const [invoices, setInvoices] = useState<PaymentInvoice[]>([]);
  const [loadingInvoice, setLoadingInvoice] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchInvoices = async () => {
      const data = await getInvoices();
      setInvoices(data);
    };
    
    fetchInvoices();
  }, [getInvoices]);
  
  const handleDownload = async (invoiceId: string) => {
    setLoadingInvoice(invoiceId);
    try {
      const url = await downloadInvoice(invoiceId);
      // Normally we would redirect to the URL
      // window.open(url, '_blank');
      
      // For demo, we'll just show a success message
      alert('Nota fiscal baixada com sucesso (simulação)');
    } finally {
      setLoadingInvoice(null);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Pago</span>;
      case 'pending':
        return <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Pendente</span>;
      case 'failed':
        return <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Falhou</span>;
      case 'refunded':
        return <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Reembolsado</span>;
      default:
        return null;
    }
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };
  
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="w-full h-8" />
        <Skeleton className="w-full h-64" />
      </div>
    );
  }
  
  if (invoices.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <Receipt className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-1">Nenhuma fatura encontrada</h3>
        <p className="text-sm text-muted-foreground">
          Você ainda não possui nenhum histórico de pagamento.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => {
              // Get the plan for this invoice
              const relatedSubscription = subscription?.id === invoice.subscriptionId ? subscription : null;
              const planId = relatedSubscription?.planId;
              const plan = planId ? subscriptionPlans.find(p => p.id === planId) : null;
              
              return (
                <TableRow key={invoice.id}>
                  <TableCell>{formatDate(invoice.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {plan ? `${plan.name}` : 'Assinatura'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {invoice.id}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell>{formatAmount(invoice.amount)}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      disabled={loadingInvoice === invoice.id || invoice.status !== 'paid'}
                      onClick={() => handleDownload(invoice.id)}
                    >
                      {loadingInvoice === invoice.id ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full mr-2" />
                          Baixando...
                        </div>
                      ) : (
                        <>
                          <FileText className="h-4 w-4 mr-2" />
                          Nota fiscal
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <Download className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h4 className="font-medium mb-1">Notas fiscais e recibos</h4>
            <p className="text-sm text-muted-foreground">
              Todas as suas notas fiscais podem ser baixadas a qualquer momento no seu histórico 
              de pagamentos. Caso precise de algum documento adicional, entre em contato com 
              nosso suporte.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
