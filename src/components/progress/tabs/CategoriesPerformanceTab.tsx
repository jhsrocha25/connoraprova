
import { UserProgress } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type CategoriesPerformanceTabProps = {
  progress: UserProgress;
};

const CategoriesPerformanceTab = ({ progress }: CategoriesPerformanceTabProps) => {
  const formatPerformanceData = () => {
    return progress.performanceByCategory.map((category) => ({
      name: category.category,
      corretas: category.correctPercentage,
      tentativas: category.questionsAttempted,
    }));
  };

  return (
    <div className="space-y-4">
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formatPerformanceData()}
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} horizontal={true} />
            <XAxis dataKey="name" scale="band" axisLine={false} tickLine={false} />
            <YAxis
              tickFormatter={(value) => `${value}%`}
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              formatter={(value: number) => [`${value}%`, 'Acertos']}
              contentStyle={{ 
                borderRadius: '8px', 
                border: '1px solid hsl(var(--border))',
                backgroundColor: 'hsl(var(--background))'
              }}
            />
            <Bar
              dataKey="corretas"
              name="Acertos"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {progress.performanceByCategory.map((category) => (
          <Card key={category.category} className="border">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground mb-1">{category.category}</p>
                <div className="flex justify-center items-baseline">
                  <h4 className="text-2xl font-bold">{category.correctPercentage}%</h4>
                  <span className="text-xs ml-1 text-muted-foreground">acertos</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{category.questionsAttempted} questões</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPerformanceTab;
