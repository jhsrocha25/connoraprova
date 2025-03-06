
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { usePayment } from '@/contexts/PaymentContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

// Import the new components
import SessionTimer from '@/components/subscription/SessionTimer';
import CheckoutProgressBar from '@/components/subscription/CheckoutProgressBar';
import OrderSummary from '@/components/subscription/OrderSummary';
import PaymentOptions from '@/components/subscription/PaymentOptions';

const SubscriptionCheckout = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { 
    selectedPlan, 
    paymentMethods, 
    createSubscription, 
    isLoading, 
    appliedCoupon,
    applyCoupon,
    generatePixPayment,
    generateBoletoPayment
  } = usePayment();
  
  // State
  const [couponCode, setCouponCode] = useState('');
  const [paymentTab, setPaymentTab] = useState('card');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [sessionTimeLeft, setSessionTimeLeft] = useState(900); // 15 minutes in seconds
  const [sessionExpired, setSessionExpired] = useState(false);
  const [pixData, setPixData] = useState<any>(null);
  const [boletoData, setBoletoData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Check if user selected a plan
  useEffect(() => {
    if (!selectedPlan) {
      navigate('/subscription/plans');
    }
  }, [selectedPlan, navigate]);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { 
        state: { 
          redirectAfterLogin: '/subscription/plans'
        } 
      });
    }
  }, [isAuthenticated, navigate]);

  // Session timer
  useEffect(() => {
    if (sessionTimeLeft <= 0) {
      setSessionExpired(true);
      toast({
        title: "Sessão expirada",
        description: "Sua sessão de pagamento expirou. Por favor, tente novamente.",
        variant: "destructive"
      });
      return;
    }

    const timer = setInterval(() => {
      setSessionTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionTimeLeft]);

  const handleResetSession = () => {
    setSessionTimeLeft(900);
    setSessionExpired(false);
    setPixData(null);
    setBoletoData(null);
  };

  if (!selectedPlan) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container pt-24 pb-16">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </main>
      </div>
    );
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setIsApplyingCoupon(true);
    const success = await applyCoupon(couponCode);
    setIsApplyingCoupon(false);
    
    if (success) {
      setCouponCode('');
    }
  };

  const handlePixPayment = async () => {
    if (!selectedPlan) return;
    
    setIsProcessing(true);
    try {
      const pixResponse = await generatePixPayment?.(priceDetails?.finalPrice || selectedPlan.price, `Assinatura ${selectedPlan.name}`);
      setPixData(pixResponse);
      setPaymentTab('pix');
    } catch (error) {
      console.error('Error generating PIX payment:', error);
      toast({
        variant: "destructive",
        title: "Erro ao gerar pagamento PIX",
        description: "Não foi possível gerar o pagamento. Tente novamente ou use outro método.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBoletoPayment = async () => {
    if (!selectedPlan) return;
    
    setIsProcessing(true);
    try {
      const boletoResponse = await generateBoletoPayment?.(priceDetails?.finalPrice || selectedPlan.price, `Assinatura ${selectedPlan.name}`);
      setBoletoData(boletoResponse);
      setPaymentTab('boleto');
    } catch (error) {
      console.error('Error generating boleto payment:', error);
      toast({
        variant: "destructive",
        title: "Erro ao gerar boleto",
        description: "Não foi possível gerar o boleto. Tente novamente ou use outro método.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleComplete = async () => {
    if (sessionExpired) {
      toast({
        variant: "destructive",
        title: "Sessão expirada",
        description: "Sua sessão expirou. Por favor, reinicie o processo.",
      });
      return;
    }

    let paymentMethodId;
    
    if (paymentTab === 'card' && paymentMethods.length > 0) {
      paymentMethodId = selectedPaymentMethod || paymentMethods.find(m => m.isDefault)?.id;
    }
    
    if (!paymentMethodId && paymentTab === 'card' && paymentMethods.length > 0) {
      toast({
        variant: "destructive",
        title: "Método de pagamento necessário",
        description: "Por favor, selecione um cartão ou adicione um novo.",
      });
      return;
    }
    
    setIsProcessing(true);
    try {
      await createSubscription(selectedPlan.id, paymentMethodId);
      navigate('/subscription/success');
    } catch (error) {
      console.error('Error creating subscription:', error);
      toast({
        variant: "destructive",
        title: "Erro ao processar assinatura",
        description: "Não foi possível criar sua assinatura. Tente novamente.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateTotal = () => {
    if (!selectedPlan) return 0;
    
    let total = selectedPlan.price;
    
    if (appliedCoupon) {
      const discount = total * (appliedCoupon.discountPercentage / 100);
      total -= discount;
    }
    
    return total;
  };

  const priceDetails = {
    originalPrice: selectedPlan.price,
    discount: appliedCoupon ? selectedPlan.price * (appliedCoupon.discountPercentage / 100) : 0,
    finalPrice: calculateTotal()
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => navigate('/subscription/plans')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para planos
          </Button>
          
          <CheckoutProgressBar currentStep={2} />
          
          <SessionTimer 
            sessionTimeLeft={sessionTimeLeft} 
            sessionExpired={sessionExpired}
          />
          
          <h1 className="text-3xl font-bold tracking-tight mb-8">Finalizar Assinatura</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <PaymentOptions 
                paymentTab={paymentTab}
                setPaymentTab={setPaymentTab}
                paymentMethods={paymentMethods}
                selectedPaymentMethod={selectedPaymentMethod}
                setSelectedPaymentMethod={setSelectedPaymentMethod}
                isProcessing={isProcessing}
                sessionExpired={sessionExpired}
                handleComplete={handleComplete}
                handleResetSession={handleResetSession}
                handlePixPayment={handlePixPayment}
                handleBoletoPayment={handleBoletoPayment}
                pixData={pixData}
                boletoData={boletoData}
                selectedPlan={selectedPlan}
                priceDetails={priceDetails}
              />
            </div>
            
            <div className="space-y-6">
              <OrderSummary 
                selectedPlan={selectedPlan}
                appliedCoupon={appliedCoupon}
                couponCode={couponCode}
                setCouponCode={setCouponCode}
                handleApplyCoupon={handleApplyCoupon}
                isApplyingCoupon={isApplyingCoupon}
                sessionExpired={sessionExpired}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubscriptionCheckout;
