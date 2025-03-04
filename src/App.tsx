
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Concursos from "./pages/Concursos";
import ConcursoDetails from "./pages/ConcursoDetails";
import Progress from "./pages/Progress";
import AIChat from "./pages/AIChat";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserSettings from "./pages/UserSettings";
import AdminDashboard from "./pages/AdminDashboard";
import Courses from "./pages/Courses";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/concursos" element={<Concursos />} />
            <Route path="/concursos/:id" element={<ConcursoDetails />} />
            <Route 
              path="/progress" 
              element={
                <ProtectedRoute>
                  <Progress />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/aichat" 
              element={
                <ProtectedRoute>
                  <AIChat />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/simulation" 
              element={
                <ProtectedRoute>
                  <div>Modo Simulado</div>
                </ProtectedRoute>
              } 
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/terms" element={<div>Termos de Uso</div>} />
            <Route path="/privacy" element={<div>Política de Privacidade</div>} />
            <Route path="/recovery" element={<div>Recuperação de Senha</div>} />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <UserSettings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/courses" element={<Courses />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
