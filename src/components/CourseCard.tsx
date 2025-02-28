
import { Link } from "react-router-dom";
import { Course } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, BookOpen, BarChart3 } from "lucide-react";

interface CourseCardProps {
  course: Course;
}

const getLevelColor = (level: string) => {
  switch (level) {
    case "beginner":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "intermediate":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "advanced":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

const CourseCard = ({ course }: CourseCardProps) => {
  const levelColorClass = getLevelColor(course.level);

  return (
    <Link
      to={`/courses/${course.id}`}
      className="group block h-full overflow-hidden rounded-lg border border-border bg-card shadow-sm card-hover focus-ring"
    >
      <div className="relative">
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <Badge className={`absolute right-3 top-3 ${levelColorClass}`}>
          {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
        </Badge>
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <Badge variant="outline" className="text-xs capitalize">
            {course.category}
          </Badge>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="mr-1 h-3 w-3" />
            <span>{course.duration}</span>
          </div>
        </div>

        <h3 className="mb-2 text-xl font-semibold tracking-tight">
          {course.title}
        </h3>
        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
          {course.description}
        </p>

        {course.progress !== undefined && (
          <div className="mt-auto">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <div className="flex items-center">
                <BarChart3 className="mr-1 h-3 w-3" />
                <span>Progresso</span>
              </div>
              <span>{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-1.5" />
          </div>
        )}
      </div>
      <div className="border-t border-border px-4 py-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-muted-foreground">
            <BookOpen className="mr-1 h-4 w-4" />
            <span>{course.modules.length} Módulos</span>
          </div>
          <span className="font-medium text-primary">Ver curso</span>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
