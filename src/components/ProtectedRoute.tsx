
import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles?: string[];
};

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user is authenticated and authorized based on roles
    if (!loading) {
      if (!isAuthenticated) {
        setIsAuthorized(false);
      } else if (allowedRoles && user) {
        // Check if user has the required role
        setIsAuthorized(allowedRoles.includes(user.role));
      } else {
        setIsAuthorized(true);
      }
    }
  }, [loading, isAuthenticated, user, allowedRoles]);

  if (loading || isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthorized) {
    // User is either not authenticated or doesn't have the required role
    if (!isAuthenticated) {
      // Redirect to login and remember where they were trying to go
      return <Navigate to="/login" state={{ from: location }} replace />;
    } else {
      // User is authenticated but doesn't have the required role
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
