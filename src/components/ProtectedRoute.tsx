
import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Loader2 } from 'lucide-react';

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles?: string[];
  bypassForAdmin?: boolean;
  requirePayment?: boolean; // Novo parâmetro para verificar pagamento
};

const ProtectedRoute = ({ 
  children, 
  allowedRoles, 
  bypassForAdmin = false,
  requirePayment = true // Por padrão, exige pagamento
}: ProtectedRouteProps) => {
  const { user, loading, isAuthenticated, twoFactorPending } = useAuth();
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // Check for admin testing mode based on pathname
    const pathname = location.pathname;
    const isAIChat = pathname === '/aichat';
    const isSimulation = pathname === '/simulation';
    
    const aiChatTestingEnabled = localStorage.getItem('adminAiChatEnabled') === 'true';
    const simulationTestingEnabled = localStorage.getItem('adminSimulationModeEnabled') === 'true';
    
    // Allow bypass if the specific feature testing is enabled
    const bypassAuth = 
      (isAIChat && aiChatTestingEnabled) || 
      (isSimulation && simulationTestingEnabled);

    // Special bypass for admin users for testing purposes
    if (bypassForAdmin && user?.role === 'admin') {
      setIsAuthorized(true);
      return;
    }

    // Check if bypass is enabled for AI Chat or Simulation Mode
    if (bypassAuth) {
      setIsAuthorized(true);
      return;
    }

    // Check if user is authenticated, authorized based on roles, and has confirmed payment
    if (!loading) {
      if (!isAuthenticated) {
        setIsAuthorized(false);
      } else if (requirePayment && user?.paymentStatus !== 'completed') {
        // Se pagamento é necessário e não está completado, redirecionar para pagamento
        setIsAuthorized(false);
      } else if (allowedRoles && user) {
        // Check if user has the required role
        setIsAuthorized(allowedRoles.includes(user.role));
      } else {
        setIsAuthorized(true);
      }
    }
  }, [loading, isAuthenticated, user, allowedRoles, bypassForAdmin, location.pathname, requirePayment]);

  if (loading || isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If two-factor authentication is pending, redirect to register page to complete verification
  if (twoFactorPending) {
    return <Navigate to="/register" state={{ from: location }} replace />;
  }

  if (!isAuthorized) {
    // User is either not authenticated or doesn't have the required role
    if (!isAuthenticated) {
      // Redirect to login and remember where they were trying to go
      return <Navigate to="/login" state={{ from: location }} replace />;
    } else if (user?.paymentStatus !== 'completed' && requirePayment) {
      // Usuário autenticado mas sem pagamento confirmado
      return <Navigate to="/subscription/plans" state={{ from: location }} replace />;
    } else {
      // User is authenticated but doesn't have the required role
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
