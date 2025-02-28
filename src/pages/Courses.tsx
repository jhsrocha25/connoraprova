
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import Navbar from '@/components/Navbar';
import CourseCard from '@/components/CourseCard';
import { Course } from '@/lib/types';
import { mockCourses } from '@/lib/data';

const Courses = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [level, setLevel] = useState('all');
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(mockCourses);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let results = [...mockCourses];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      results = results.filter(course => 
        course.title.toLowerCase().includes(query) || 
        course.description.toLowerCase().includes(query) ||
        course.category.toLowerCase().includes(query)
      );
    }
    
    // Apply category filter
    if (category !== 'all') {
      results = results.filter(course => course.category === category);
    }
    
    // Apply level filter
    if (level !== 'all') {
      results = results.filter(course => course.level === level);
    }
    
    setFilteredCourses(results);
  }, [searchQuery, category, level]);

  const categories = ['all', ...new Set(mockCourses.map(course => course.category))];
  const levels = ['all', 'beginner', 'intermediate', 'advanced'];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container pt-24 pb-16 animate-fade-in">
        <div className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex flex-col md:flex-row items-start justify-between mb-8 gap-4">
            <div className="space-y-1 mb-4 md:mb-0">
              <h1 className="text-3xl font-bold tracking-tight">Cursos</h1>
              <p className="text-muted-foreground">
                Explore nossa biblioteca completa de cursos para concursos públicos.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Pesquisar cursos..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat === 'all' ? 'Todas as categorias' : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Nível" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((lvl) => (
                    <SelectItem key={lvl} value={lvl}>
                      {lvl === 'all' ? 'Todos os níveis' : 
                       lvl === 'beginner' ? 'Iniciante' : 
                       lvl === 'intermediate' ? 'Intermediário' : 'Avançado'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
              <TabsTrigger value="all" className="rounded-md px-3 py-1 text-sm font-medium">
                Todos
              </TabsTrigger>
              <TabsTrigger value="in-progress" className="rounded-md px-3 py-1 text-sm font-medium">
                Em Progresso
              </TabsTrigger>
              <TabsTrigger value="not-started" className="rounded-md px-3 py-1 text-sm font-medium">
                Não Iniciados
              </TabsTrigger>
              <TabsTrigger value="completed" className="rounded-md px-3 py-1 text-sm font-medium">
                Completados
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filteredCourses.map((course, index) => (
                    <div key={course.id} className="animate-scale-in" style={{ animationDelay: `${index * 50}ms` }}>
                      <CourseCard course={course} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">Nenhum curso encontrado</h3>
                  <p className="text-muted-foreground">
                    Tente ajustar seus filtros ou termos de pesquisa.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="in-progress" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredCourses
                  .filter(course => (course.progress || 0) > 0 && (course.progress || 0) < 100)
                  .map((course, index) => (
                    <div key={course.id} className="animate-scale-in" style={{ animationDelay: `${index * 50}ms` }}>
                      <CourseCard course={course} />
                    </div>
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="not-started" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredCourses
                  .filter(course => !course.progress || course.progress === 0)
                  .map((course, index) => (
                    <div key={course.id} className="animate-scale-in" style={{ animationDelay: `${index * 50}ms` }}>
                      <CourseCard course={course} />
                    </div>
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="completed" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredCourses
                  .filter(course => course.progress === 100)
                  .map((course, index) => (
                    <div key={course.id} className="animate-scale-in" style={{ animationDelay: `${index * 50}ms` }}>
                      <CourseCard course={course} />
                    </div>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Courses;
