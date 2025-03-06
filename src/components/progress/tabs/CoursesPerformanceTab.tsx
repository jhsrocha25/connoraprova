
import { UserProgress } from '@/lib/types';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type CoursesPerformanceTabProps = {
  progress: UserProgress;
};

const CoursesPerformanceTab = ({ progress }: CoursesPerformanceTabProps) => {
  const formatCourseData = () => {
    return progress.courseProgress.map((course) => ({
      name: `Curso ${course.courseId}`,
      progresso: course.progress,
    }));
  };

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={formatCourseData()}
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
            formatter={(value: number) => [`${value}%`, 'Progresso']}
            contentStyle={{ 
              borderRadius: '8px', 
              border: '1px solid hsl(var(--border))',
              backgroundColor: 'hsl(var(--background))'
            }}
          />
          <Bar
            dataKey="progresso"
            name="Progresso"
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
            barSize={30}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CoursesPerformanceTab;
