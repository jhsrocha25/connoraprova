
import { UserProgress } from '@/lib/types';

type OverallPerformanceTabProps = {
  progress: UserProgress;
  overallPercentage: number;
};

const OverallPerformanceTab = ({ progress, overallPercentage }: OverallPerformanceTabProps) => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center justify-center p-8">
        <div className="relative mb-4">
          <svg width="160" height="160" viewBox="0 0 160 160" className="transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="hsl(var(--secondary))"
              strokeWidth="12"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="12"
              strokeDasharray="439.8"
              strokeDashoffset={439.8 - (439.8 * overallPercentage) / 100}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-4xl font-bold">{overallPercentage}%</span>
            <span className="text-sm text-muted-foreground">desempenho</span>
          </div>
        </div>
        
        <div className="flex space-x-10 text-center">
          <div>
            <h4 className="text-2xl font-bold">{progress.correctAnswers}</h4>
            <p className="text-sm font-medium text-muted-foreground">Questões corretas</p>
          </div>
          <div>
            <h4 className="text-2xl font-bold">{progress.totalQuestionsAnswered}</h4>
            <p className="text-sm font-medium text-muted-foreground">Total respondidas</p>
          </div>
          <div>
            <h4 className="text-2xl font-bold">{progress.streak}</h4>
            <p className="text-sm font-medium text-muted-foreground">Sequência de dias</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverallPerformanceTab;
