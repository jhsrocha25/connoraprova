
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface GoogleAuthButtonProps {
  onSuccess?: () => void;
  loading?: boolean;
}

const GoogleAuthButton = ({ onSuccess, loading }: GoogleAuthButtonProps) => {
  const { registerWithGoogle } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      // In a real implementation, this would use the Google OAuth library
      // For this demo, we'll simulate a successful Google authentication
      
      // Simulate API call to Google
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock Google user data (in a real app, this would come from Google)
      const googleUserData = {
        name: "Usuário do Google",
        email: "usuario@gmail.com",
        imageUrl: "https://lh3.googleusercontent.com/a/default-user=s120"
      };
      
      await registerWithGoogle(googleUserData);
      
      // Notify about success
      toast({
        title: "Autenticação Google bem-sucedida",
        description: "Você foi autenticado com o Google com sucesso!",
      });
      
      // Call the onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Erro na autenticação Google:', error);
      toast({
        variant: 'destructive',
        title: "Erro na autenticação",
        description: "Não foi possível autenticar com o Google. Tente novamente.",
      });
    }
  };

  return (
    <Button 
      type="button" 
      variant="outline" 
      className="w-full flex items-center justify-center gap-2"
      onClick={handleGoogleLogin}
      disabled={loading}
    >
      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.6,20H24v8h11.3c-1.1,5.2-5.5,8-11.3,8c-6.6,0-12-5.4-12-12s5.4-12,12-12c3.1,0,5.8,1.2,8,3.1 l6.1-6.1C33.7,4.6,29.1,2,24,2C12.4,2,3,11.4,3,23s9.4,21,21,21s21-9.4,21-21C45,22.6,44.5,21.3,43.6,20z"/>
        <path fill="#FF3D00" d="M6.3,13.7l7.1,5.3c1.8-4.8,6.3-8,11.6-8c3.1,0,5.8,1.2,8,3.1l6.1-6.1C33.7,4.6,29.1,2,24,2 C16.1,2,9.3,6.8,6.3,13.7z"/>
        <path fill="#4CAF50" d="M24,44c5,0,9.6-2.5,12.2-6.7l-6.7-5.3c-1.8,2.6-5.2,4-8.5,4c-5.8,0-10.2-4.8-11.3-10H3.1 C5.9,37.2,14.1,44,24,44z"/>
        <path fill="#1976D2" d="M43.6,20H24v8h11.3c-0.5,2.6-2,4.8-4.2,6.3l6.7,5.3c4.9-4.6,7.2-11.3,7.2-18.6C45,22.6,44.5,21.3,43.6,20z"/>
      </svg>
      Cadastrar com Google
    </Button>
  );
};

export default GoogleAuthButton;
