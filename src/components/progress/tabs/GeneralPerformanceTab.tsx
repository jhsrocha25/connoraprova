
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { UserProgress } from '@/lib/types';
import { 
  LayoutDashboard, 
  FileText, 
  Trophy, 
  MessageCircle, 
  History, 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Share2, 
  Award, 
  Clock, 
  BookOpen, 
  Users,
  Star,
  CheckCircle,
  XCircle,
  Calendar,
  Lightbulb,
  Brain
} from 'lucide-react';
import OverviewContent from './general/OverviewContent';
import ReportsContent from './general/ReportsContent';
import RankingContent from './general/RankingContent';
import FeedbackContent from './general/FeedbackContent';
import HistoryContent from './general/HistoryContent';
import ChallengeContent from './general/ChallengeContent';

type GeneralPerformanceTabProps = {
  progress: UserProgress;
  overallPercentage: number;
};

const GeneralPerformanceTab = ({ progress, overallPercentage }: GeneralPerformanceTabProps) => {
  const [selectedSubTab, setSelectedSubTab] = useState("overview");

  const preparationLevel = () => {
    if (overallPercentage >= 85) return { level: 'Avançado', color: 'green' };
    if (overallPercentage >= 70) return { level: 'Intermediário', color: 'yellow' };
    return { level: 'Básico', color: 'red' };
  };

  const level = preparationLevel();

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium flex items-center">
            <TabsList className="h-9">
              <TabsTrigger 
                value="overview" 
                onClick={() => setSelectedSubTab("overview")}
                className={selectedSubTab === "overview" ? "bg-primary text-primary-foreground" : ""}
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Visão Geral
              </TabsTrigger>
              <TabsTrigger 
                value="reports" 
                onClick={() => setSelectedSubTab("reports")}
                className={selectedSubTab === "reports" ? "bg-primary text-primary-foreground" : ""}
              >
                <FileText className="h-4 w-4 mr-2" />
                Relatórios
              </TabsTrigger>
              <TabsTrigger 
                value="ranking" 
                onClick={() => setSelectedSubTab("ranking")}
                className={selectedSubTab === "ranking" ? "bg-primary text-primary-foreground" : ""}
              >
                <Trophy className="h-4 w-4 mr-2" />
                Rankings
              </TabsTrigger>
              <TabsTrigger 
                value="feedback" 
                onClick={() => setSelectedSubTab("feedback")}
                className={selectedSubTab === "feedback" ? "bg-primary text-primary-foreground" : ""}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Feedback
              </TabsTrigger>
              <TabsTrigger 
                value="history" 
                onClick={() => setSelectedSubTab("history")}
                className={selectedSubTab === "history" ? "bg-primary text-primary-foreground" : ""}
              >
                <History className="h-4 w-4 mr-2" />
                Histórico
              </TabsTrigger>
              <TabsTrigger 
                value="challenge" 
                onClick={() => setSelectedSubTab("challenge")}
                className={selectedSubTab === "challenge" ? "bg-primary text-primary-foreground" : ""}
              >
                <Zap className="h-4 w-4 mr-2" />
                Desafios
              </TabsTrigger>
            </TabsList>
          </h3>
        </div>

        {/* Visão Geral do Desempenho */}
        {selectedSubTab === "overview" && (
          <OverviewContent 
            progress={progress} 
            overallPercentage={overallPercentage} 
            level={level} 
          />
        )}

        {/* Relatórios Detalhados */}
        {selectedSubTab === "reports" && (
          <ReportsContent progress={progress} />
        )}

        {/* Rankings e Comparação */}
        {selectedSubTab === "ranking" && (
          <RankingContent />
        )}

        {/* Feedback Personalizado */}
        {selectedSubTab === "feedback" && (
          <FeedbackContent />
        )}

        {/* Histórico de Simulados */}
        {selectedSubTab === "history" && (
          <HistoryContent />
        )}

        {/* Modo Desafio */}
        {selectedSubTab === "challenge" && (
          <ChallengeContent />
        )}
      </div>
    </div>
  );
};

export default GeneralPerformanceTab;
