import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Star, 
  Bell, 
  Calendar, 
  ChevronDown, 
  Clock, 
  MapPin, 
  BookOpen, 
  DollarSign,
  Building,
  GraduationCap,
  Tag
} from "lucide-react";
import Navbar from "@/components/Navbar";
import CourseCard from "@/components/CourseCard";
import { Course } from "@/lib/types";
import { mockCourses } from "@/lib/data";

// Mock data for autocomplete suggestions
const courseSuggestions = [
  "Polícia Federal",
  "INSS",
  "TRT",
  "Tribunal de Justiça",
  "Banco do Brasil",
  "Caixa Econômica Federal",
  "Petrobras",
  "Anvisa",
  "Receita Federal",
  "Polícia Civil",
];

// Mock data for filters
const areas = [
  "Todas",
  "Administrativa",
  "Jurídica",
  "Policial",
  "Saúde",
  "TI",
  "Educação",
  "Fiscal",
];

const regions = [
  "Nacional",
  "Norte",
  "Nordeste",
  "Centro-Oeste",
  "Sudeste",
  "Sul",
];

const educationLevels = [
  "Todos",
  "Ensino Médio",
  "Técnico",
  "Superior",
  "Pós-graduação",
];

const salaryRanges = [
  "Todos",
  "Até R$ 3.000",
  "R$ 3.000 - R$ 5.000",
  "R$ 5.000 - R$ 10.000",
  "Acima de R$ 10.000",
];

const concursoStatus = [
  "Todos",
  "Previsto",
  "Edital Publicado",
  "Inscrições Abertas",
  "Prova Aplicada",
  "Finalizado",
];

const bancas = [
  "Todas",
  "CESPE",
  "FCC",
  "FGV",
  "VUNESP",
  "IBFC",
  "AOCP",
  "CEBRASPE",
];

const Courses = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(mockCourses);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  // Filter states
  const [area, setArea] = useState("Todas");
  const [region, setRegion] = useState("Nacional");
  const [educationLevel, setEducationLevel] = useState("Todos");
  const [salaryRange, setSalaryRange] = useState("Todos");
  const [status, setStatus] = useState("Todos");
  const [banca, setBanca] = useState("Todas");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Notification preferences
  const [notifyNewCourses, setNotifyNewCourses] = useState(true);
  const [notifyDeadlines, setNotifyDeadlines] = useState(true);
  const [notifyUpdates, setNotifyUpdates] = useState(true);
  
  // Favorites
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Filter suggestions as user types
    if (searchQuery.length > 1) {
      const filtered = courseSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    // Apply all filters
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
    
    // Apply area filter
    if (area !== "Todas") {
      results = results.filter(course => 
        course.category.toLowerCase() === area.toLowerCase()
      );
    }
    
    // Apply education level filter
    if (educationLevel !== "Todos") {
      const levelMap: Record<string, string> = {
        "Ensino Médio": "beginner",
        "Técnico": "beginner",
        "Superior": "intermediate",
        "Pós-graduação": "advanced"
      };
      
      results = results.filter(course => 
        course.level === levelMap[educationLevel]
      );
    }
    
    setFilteredCourses(results);
  }, [searchQuery, area, region, educationLevel, salaryRange, status, banca]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Add to recent searches if not already present
      if (!recentSearches.includes(searchQuery)) {
        setRecentSearches(prev => [searchQuery, ...prev].slice(0, 5));
      }
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    handleSearch();
  };

  const toggleFavorite = (courseId: string) => {
    setFavorites(prev => {
      if (prev.includes(courseId)) {
        toast({
          title: "Removido dos favoritos",
          description: "O curso foi removido dos seus favoritos"
        });
        return prev.filter(id => id !== courseId);
      } else {
        toast({
          title: "Adicionado aos favoritos",
          description: "O curso foi adicionado aos seus favoritos"
        });
        return [...prev, courseId];
      }
    });
  };

  const toggleNotification = (type: "newCourses" | "deadlines" | "updates") => {
    switch(type) {
      case "newCourses":
        setNotifyNewCourses(prev => !prev);
        toast({
          title: notifyNewCourses ? "Notificações desativadas" : "Notificações ativadas",
          description: `Você ${notifyNewCourses ? "não" : ""} receberá notificações sobre novos cursos`
        });
        break;
      case "deadlines":
        setNotifyDeadlines(prev => !prev);
        toast({
          title: notifyDeadlines ? "Notificações desativadas" : "Notificações ativadas",
          description: `Você ${notifyDeadlines ? "não" : ""} receberá notificações sobre prazos de inscrição`
        });
        break;
      case "updates":
        setNotifyUpdates(prev => !prev);
        toast({
          title: notifyUpdates ? "Notificações desativadas" : "Notificações ativadas",
          description: `Você ${notifyUpdates ? "não" : ""} receberá notificações sobre atualizações de editais`
        });
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container pt-24 pb-16 animate-fade-in">
        <div className={`transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
          <div className="flex flex-col md:flex-row items-start justify-between mb-8 gap-4">
            <div className="space-y-1 mb-4 md:mb-0">
              <h1 className="text-3xl font-bold tracking-tight">Explorar Cursos</h1>
              <p className="text-muted-foreground">
                Encontre os melhores cursos para sua preparação para concursos públicos
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Bell className="h-4 w-4" />
                    <span className="hidden sm:inline">Notificações</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="p-2">
                    <h4 className="font-medium mb-2">Preferências de notificação</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="notify-new" className="flex-1">Novos cursos</Label>
                        <Switch 
                          id="notify-new" 
                          checked={notifyNewCourses} 
                          onCheckedChange={() => toggleNotification("newCourses")} 
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="notify-deadlines" className="flex-1">Prazos de inscrição</Label>
                        <Switch 
                          id="notify-deadlines" 
                          checked={notifyDeadlines} 
                          onCheckedChange={() => toggleNotification("deadlines")} 
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="notify-updates" className="flex-1">Atualizações de edital</Label>
                        <Switch 
                          id="notify-updates" 
                          checked={notifyUpdates} 
                          onCheckedChange={() => toggleNotification("updates")} 
                        />
                      </div>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <div className="flex items-center rounded-md border">
                <Button 
                  variant={viewMode === "grid" ? "default" : "ghost"} 
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === "list" ? "default" : "ghost"} 
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Search and filters section */}
          <div className="mb-8 space-y-4">
            <div className="relative">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar cursos ou concursos..."
                    className="pl-10 pr-4"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        handleSearch();
                        setShowSuggestions(false);
                      }
                    }}
                    onBlur={() => {
                      setTimeout(() => setShowSuggestions(false), 200);
                    }}
                    onFocus={() => {
                      if (searchQuery.length > 1) {
                        setShowSuggestions(true);
                      }
                    }}
                  />
                  {showSuggestions && searchSuggestions.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full rounded-md border border-border bg-background shadow-lg">
                      <ul className="py-1">
                        {searchSuggestions.map((suggestion, index) => (
                          <li 
                            key={index}
                            className="px-4 py-2 hover:bg-accent cursor-pointer text-sm"
                            onClick={() => handleSelectSuggestion(suggestion)}
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="gap-1"
                >
                  <Filter className="h-4 w-4" />
                  Filtros
                  <ChevronDown className={`h-4 w-4 transition-transform ${showAdvancedFilters ? "rotate-180" : ""}`} />
                </Button>
                <Button onClick={handleSearch}>Buscar</Button>
              </div>
            </div>

            {/* Advanced filters */}
            {showAdvancedFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 rounded-md border border-border bg-card animate-fade-in">
                <div>
                  <Label htmlFor="area-filter" className="mb-2 block">Área</Label>
                  <Select value={area} onValueChange={setArea}>
                    <SelectTrigger id="area-filter">
                      <SelectValue placeholder="Selecione a área" />
                    </SelectTrigger>
                    <SelectContent>
                      {areas.map(a => (
                        <SelectItem key={a} value={a}>{a}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="region-filter" className="mb-2 block">Região</Label>
                  <Select value={region} onValueChange={setRegion}>
                    <SelectTrigger id="region-filter">
                      <SelectValue placeholder="Selecione a região" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map(r => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="education-filter" className="mb-2 block">Escolaridade</Label>
                  <Select value={educationLevel} onValueChange={setEducationLevel}>
                    <SelectTrigger id="education-filter">
                      <SelectValue placeholder="Selecione o nível" />
                    </SelectTrigger>
                    <SelectContent>
                      {educationLevels.map(e => (
                        <SelectItem key={e} value={e}>{e}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="salary-filter" className="mb-2 block">Faixa Salarial</Label>
                  <Select value={salaryRange} onValueChange={setSalaryRange}>
                    <SelectTrigger id="salary-filter">
                      <SelectValue placeholder="Selecione a faixa" />
                    </SelectTrigger>
                    <SelectContent>
                      {salaryRanges.map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="status-filter" className="mb-2 block">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger id="status-filter">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      {concursoStatus.map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="banca-filter" className="mb-2 block">Banca</Label>
                  <Select value={banca} onValueChange={setBanca}>
                    <SelectTrigger id="banca-filter">
                      <SelectValue placeholder="Selecione a banca" />
                    </SelectTrigger>
                    <SelectContent>
                      {bancas.map(b => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Recent searches */}
            {recentSearches.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Buscas recentes:</span>
                <div className="flex flex-wrap gap-1">
                  {recentSearches.map((search, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="cursor-pointer"
                      onClick={() => {
                        setSearchQuery(search);
                        handleSearch();
                      }}
                    >
                      {search}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Featured courses section */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Cursos em Destaque</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockCourses.slice(0, 3).map((course, index) => (
                <div key={course.id} className="relative animate-scale-in" style={{ animationDelay: `${index * 50}ms` }}>
                  <CourseCard course={course} />
                  <button 
                    className={`absolute top-3 right-3 z-10 p-1.5 rounded-full bg-background/80 backdrop-blur-sm ${
                      favorites.includes(course.id) ? "text-yellow-500" : "text-muted-foreground"
                    }`}
                    onClick={() => toggleFavorite(course.id)}
                  >
                    <Star className="h-5 w-5" fill={favorites.includes(course.id) ? "currentColor" : "none"} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Main courses browse section */}
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
              <TabsTrigger value="all" className="rounded-md px-3 py-1 text-sm font-medium">
                Todos
              </TabsTrigger>
              <TabsTrigger value="popular" className="rounded-md px-3 py-1 text-sm font-medium">
                Populares
              </TabsTrigger>
              <TabsTrigger value="recent" className="rounded-md px-3 py-1 text-sm font-medium">
                Recentes
              </TabsTrigger>
              <TabsTrigger value="favoritos" className="rounded-md px-3 py-1 text-sm font-medium">
                Favoritos
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {filteredCourses.length > 0 ? (
                viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {filteredCourses.map((course, index) => (
                      <div key={course.id} className="relative animate-scale-in" style={{ animationDelay: `${index * 50}ms` }}>
                        <CourseCard course={course} />
                        <button 
                          className={`absolute top-3 right-3 z-10 p-1.5 rounded-full bg-background/80 backdrop-blur-sm ${
                            favorites.includes(course.id) ? "text-yellow-500" : "text-muted-foreground"
                          }`}
                          onClick={() => toggleFavorite(course.id)}
                        >
                          <Star className="h-5 w-5" fill={favorites.includes(course.id) ? "currentColor" : "none"} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredCourses.map((course, index) => (
                      <Card key={course.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                        <div className="flex flex-col md:flex-row">
                          <div className="w-full md:w-48 h-48 md:h-auto overflow-hidden">
                            <img 
                              src={course.thumbnail} 
                              alt={course.title} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div className="flex-1 p-6">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline" className="text-xs capitalize">
                                    {course.category}
                                  </Badge>
                                  <Badge className={`text-xs ${
                                    course.level === "beginner" ? "bg-green-100 text-green-800" : 
                                    course.level === "intermediate" ? "bg-blue-100 text-blue-800" : 
                                    "bg-red-100 text-red-800"
                                  }`}>
                                    {course.level === "beginner" ? "Iniciante" : 
                                     course.level === "intermediate" ? "Intermediário" : "Avançado"}
                                  </Badge>
                                </div>
                                <h3 className="text-xl font-semibold">{course.title}</h3>
                              </div>
                              <button 
                                className={`p-1.5 rounded-full ${
                                  favorites.includes(course.id) ? "text-yellow-500" : "text-muted-foreground"
                                }`}
                                onClick={() => toggleFavorite(course.id)}
                              >
                                <Star className="h-5 w-5" fill={favorites.includes(course.id) ? "currentColor" : "none"} />
                              </button>
                            </div>
                            <p className="mt-2 text-muted-foreground line-clamp-2">{course.description}</p>
                            <div className="mt-4 flex flex-wrap gap-4">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="mr-1 h-4 w-4" />
                                <span>{course.duration}</span>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <BookOpen className="mr-1 h-4 w-4" />
                                <span>{course.modules.length} Módulos</span>
                              </div>
                              {course.progress !== undefined && (
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <span>Progresso: {course.progress}%</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">Nenhum curso encontrado</h3>
                  <p className="text-muted-foreground">
                    Tente ajustar seus filtros ou termos de pesquisa.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="popular" className="space-y-4">
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {mockCourses.slice(0, 6).map((course, index) => (
                    <div key={course.id} className="relative animate-scale-in" style={{ animationDelay: `${index * 50}ms` }}>
                      <CourseCard course={course} />
                      <button 
                        className={`absolute top-3 right-3 z-10 p-1.5 rounded-full bg-background/80 backdrop-blur-sm ${
                          favorites.includes(course.id) ? "text-yellow-500" : "text-muted-foreground"
                        }`}
                        onClick={() => toggleFavorite(course.id)}
                      >
                        <Star className="h-5 w-5" fill={favorites.includes(course.id) ? "currentColor" : "none"} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {mockCourses.slice(0, 6).map((course, index) => (
                    <Card key={course.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-48 h-48 md:h-auto overflow-hidden">
                          <img 
                            src={course.thumbnail} 
                            alt={course.title} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="flex-1 p-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-xs capitalize">
                                  {course.category}
                                </Badge>
                                <Badge className={`text-xs ${
                                  course.level === "beginner" ? "bg-green-100 text-green-800" : 
                                  course.level === "intermediate" ? "bg-blue-100 text-blue-800" : 
                                  "bg-red-100 text-red-800"
                                }`}>
                                  {course.level === "beginner" ? "Iniciante" : 
                                   course.level === "intermediate" ? "Intermediário" : "Avançado"}
                                </Badge>
                              </div>
                              <h3 className="text-xl font-semibold">{course.title}</h3>
                            </div>
                            <button 
                              className={`p-1.5 rounded-full ${
                                favorites.includes(course.id) ? "text-yellow-500" : "text-muted-foreground"
                              }`}
                              onClick={() => toggleFavorite(course.id)}
                            >
                              <Star className="h-5 w-5" fill={favorites.includes(course.id) ? "currentColor" : "none"} />
                            </button>
                          </div>
                          <p className="mt-2 text-muted-foreground line-clamp-2">{course.description}</p>
                          <div className="mt-4 flex flex-wrap gap-4">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="mr-1 h-4 w-4" />
                              <span>{course.duration}</span>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <BookOpen className="mr-1 h-4 w-4" />
                              <span>{course.modules.length} Módulos</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="recent" className="space-y-4">
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {mockCourses.slice(3, 9).map((course, index) => (
                    <div key={course.id} className="relative animate-scale-in" style={{ animationDelay: `${index * 50}ms` }}>
                      <CourseCard course={course} />
                      <button 
                        className={`absolute top-3 right-3 z-10 p-1.5 rounded-full bg-background/80 backdrop-blur-sm ${
                          favorites.includes(course.id) ? "text-yellow-500" : "text-muted-foreground"
                        }`}
                        onClick={() => toggleFavorite(course.id)}
                      >
                        <Star className="h-5 w-5" fill={favorites.includes(course.id) ? "currentColor" : "none"} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {mockCourses.slice(3, 9).map((course, index) => (
                    <Card key={course.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-48 h-48 md:h-auto overflow-hidden">
                          <img 
                            src={course.thumbnail} 
                            alt={course.title} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="flex-1 p-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-xs capitalize">
                                  {course.category}
                                </Badge>
                                <Badge className={`text-xs ${
                                  course.level === "beginner" ? "bg-green-100 text-green-800" : 
                                  course.level === "intermediate" ? "bg-blue-100 text-blue-800" : 
                                  "bg-red-100 text-red-800"
                                }`}>
                                  {course.level === "beginner" ? "Iniciante" : 
                                   course.level === "intermediate" ? "Intermediário" : "Avançado"}
                                </Badge>
                              </div>
                              <h3 className="text-xl font-semibold">{course.title}</h3>
                            </div>
                            <button 
                              className={`p-1.5 rounded-full ${
                                favorites.includes(course.id) ? "text-yellow-500" : "text-muted-foreground"
                              }`}
                              onClick={() => toggleFavorite(course.id)}
                            >
                              <Star className="h-5 w-5" fill={favorites.includes(course.id) ? "currentColor" : "none"} />
                            </button>
                          </div>
                          <p className="mt-2 text-muted-foreground line-clamp-2">{course.description}</p>
                          <div className="mt-4 flex flex-wrap gap-4">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="mr-1 h-4 w-4" />
                              <span>{course.duration}</span>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <BookOpen className="mr-1 h-4 w-4" />
                              <span>{course.modules.length} Módulos</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="favoritos" className="space-y-4">
              {favorites.length > 0 ? (
                viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {mockCourses
                      .filter(course => favorites.includes(course.id))
                      .map((course, index) => (
                        <div key={course.id} className="relative animate-scale-in" style={{ animationDelay: `${index * 50}ms` }}>
                          <CourseCard course={course} />
                          <button 
                            className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-background/80 backdrop-blur-sm text-yellow-500"
                            onClick={() => toggleFavorite(course.id)}
                          >
                            <Star className="h-5 w-5" fill="currentColor" />
                          </button>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {mockCourses
                      .filter(course => favorites.includes(course.id))
                      .map((course, index) => (
                        <Card key={course.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                          <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-48 h-48 md:h-auto overflow-hidden">
                              <img 
                                src={course.thumbnail} 
                                alt={course.title} 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                            <div className="flex-1 p-6">
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline" className="text-xs capitalize">
                                      {course.category}
                                    </Badge>
                                    <Badge className={`text-xs ${
                                      course.level === "beginner" ? "bg-green-100 text-green-800" : 
                                      course.level === "intermediate" ? "bg-blue-100 text-blue-800" : 
                                      "bg-red-100 text-red-800"
                                    }`}>
                                      {course.level === "beginner" ? "Iniciante" : 
                                       course.level === "intermediate" ? "Intermediário" : "Avançado"}
                                    </Badge>
                                  </div>
                                  <h3 className="text-xl font-semibold">{course.title}</h3>
                                </div>
                                <button 
                                  className="p-1.5 rounded-full text-yellow-500"
                                  onClick={() => toggleFavorite(course.id)}
                                >
                                  <Star className="h-5 w-5" fill="currentColor" />
                                </button>
                              </div>
                              <p className="mt-2 text-muted-foreground line-clamp-2">{course.description}</p>
                              <div className="mt-4 flex flex-wrap gap-4">
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Clock className="mr-1 h-4 w-4" />
                                  <span>{course.duration}</span>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <BookOpen className="mr-1 h-4 w-4" />
                                  <span>{course.modules.length} Módulos</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                  </div>
                )
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">Você ainda não tem favoritos</h3>
                  <p className="text-muted-foreground mb-4">
                    Adicione cursos aos seus favoritos para acompanhar atualizações.
                  </p>
                  <Button variant="outline" onClick={() => document.getElementById("all-tab")?.click()}>
                    Explorar cursos
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Course details dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <span className="hidden">Abrir detalhes</span>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Detalhes do Curso</DialogTitle>
                <DialogDescription>
                  Informações detalhadas sobre o curso selecionado.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="aspect-video w-full overflow-hidden rounded-md">
                  <img 
                    src={mockCourses[0].thumbnail} 
                    alt={mockCourses[0].title} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <h2 className="text-xl font-semibold">{mockCourses[0].title}</h2>
                <p className="text-muted-foreground">{mockCourses[0].description}</p>
                
                <div className="grid grid-cols-2 gap-4 py-2">
                  <div className="flex items-center">
                    <GraduationCap className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {mockCourses[0].level === "beginner" ? "Iniciante" : 
                       mockCourses[0].level === "intermediate" ? "Intermediário" : "Avançado"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{mockCourses[0].duration}</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{mockCourses[0].modules.length} Módulos</span>
                  </div>
                  <div className="flex items-center">
                    <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm capitalize">{mockCourses[0].category}</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Módulos</h3>
                  <div className="space-y-2">
                    {mockCourses[0].modules.map((module, index) => (
                      <div key={index} className="flex items-center justify-between rounded-md border p-3">
                        <span className="text-sm">{module.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Salvar para depois</Button>
                <Button>Iniciar curso</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
};

export default Courses;
