
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, BarChart2, BookOpen, PieChart as PieChartIcon } from 'lucide-react';
import { UserProgress } from '@/lib/types';
import GeneralPerformanceTab from './tabs/GeneralPerformanceTab';
import CategoriesPerformanceTab from './tabs/CategoriesPerformanceTab';
import CoursesPerformanceTab from './tabs/CoursesPerformanceTab';
import OverallPerformanceTab from './tabs/OverallPerformanceTab';

type ProgressChartProps = {
  progress: UserProgress;
};

const ProgressChart = ({ progress }: ProgressChartProps) => {
  const calculateOverallPercentage = () => {
    if (progress.totalQuestionsAnswered === 0) return 0;
    return Math.round((progress.correctAnswers / progress.totalQuestionsAnswered) * 100);
  };

  const overallPercentage = calculateOverallPercentage();

  return (
    <Card className="border shadow-sm animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Desempenho</CardTitle>
        <CardDescription>Visualize seu progresso detalhado por diversas métricas</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general">
          <TabsList className="mb-6">
            <TabsTrigger value="general">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Desempenho Geral
            </TabsTrigger>
            <TabsTrigger value="categories">
              <BarChart2 className="h-4 w-4 mr-2" />
              Por Categoria
            </TabsTrigger>
            <TabsTrigger value="courses">
              <BookOpen className="h-4 w-4 mr-2" />
              Por Curso
            </TabsTrigger>
            <TabsTrigger value="overall">
              <PieChartIcon className="h-4 w-4 mr-2" />
              Geral
            </TabsTrigger>
          </TabsList>
          
          {/* Tabs Content */}
          <TabsContent value="general">
            <GeneralPerformanceTab progress={progress} overallPercentage={overallPercentage} />
          </TabsContent>
          
          <TabsContent value="categories">
            <CategoriesPerformanceTab progress={progress} />
          </TabsContent>
          
          <TabsContent value="courses">
            <CoursesPerformanceTab progress={progress} />
          </TabsContent>
          
          <TabsContent value="overall">
            <OverallPerformanceTab progress={progress} overallPercentage={overallPercentage} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProgressChart;
