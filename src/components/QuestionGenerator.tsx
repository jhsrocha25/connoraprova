
import React, { useState, useRef, useEffect } from 'react';
import { Question } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ChevronDown, 
  ChevronUp, 
  Send, 
  RotateCw, 
  Clock, 
  Award, 
  CheckCircle, 
  XCircle, 
  Pause, 
  Play, 
  AlertTriangle 
} from 'lucide-react';
import { mockQuestions } from '@/lib/data';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'hard':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
};

const QuestionComponent = ({ 
  question, 
  onAnswerSubmit,
  revealed = false,
  timeLimit = 0,
  isPaused = false
}: { 
  question: Question, 
  onAnswerSubmit: (answerId: string) => void,
  revealed?: boolean,
  timeLimit?: number,
  isPaused?: boolean
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(timeLimit);
  const difficultyColorClass = getDifficultyColor(question.difficulty);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Reset timer when question changes
    setTimeRemaining(timeLimit);
    
    // Clear existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Start new timer if there's a time limit and not paused
    if (timeLimit > 0 && !revealed && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Time's up - auto submit with current selection or null
            clearInterval(timerRef.current!);
            if (selectedAnswer) {
              onAnswerSubmit(selectedAnswer);
            } else {
              toast({
                title: "Tempo esgotado!",
                description: "O tempo para esta questão acabou.",
                variant: "destructive"
              });
              onAnswerSubmit("time_expired");
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeLimit, revealed, question.id, isPaused]);

  const handleAnswerChange = (value: string) => {
    setSelectedAnswer(value);
  };

  const handleSubmit = () => {
    if (selectedAnswer) {
      // Clear timer when manually submitting
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      onAnswerSubmit(selectedAnswer);
    } else {
      toast({
        title: "Seleção obrigatória",
        description: "Por favor, selecione uma alternativa antes de enviar.",
        variant: "destructive"
      });
    }
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="border border-border shadow-sm animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge className={difficultyColorClass}>
            {question.difficulty === 'easy' ? 'Fácil' : question.difficulty === 'medium' ? 'Médio' : 'Difícil'}
          </Badge>
          <div className="flex items-center gap-2">
            {timeLimit > 0 && !revealed && (
              <Badge variant="outline" className={`flex items-center gap-1 ${timeRemaining < 30 ? 'bg-red-50 text-red-800 border-red-200' : ''}`}>
                <Clock className="h-3 w-3" />
                {formatTime(timeRemaining)}
              </Badge>
            )}
            <Badge variant="outline">{question.category}</Badge>
          </div>
        </div>
        <CardTitle className="text-lg font-semibold">{question.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedAnswer || undefined} onValueChange={handleAnswerChange} className="space-y-3">
          {question.options.map((option) => (
            <div 
              key={option.id} 
              className={`flex items-center space-x-2 rounded-md border p-3 transition-colors ${
                revealed && option.isCorrect ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : ''
              } ${
                revealed && selectedAnswer === option.id && !option.isCorrect ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' : ''
              }`}
            >
              <RadioGroupItem 
                value={option.id} 
                id={`option-${question.id}-${option.id}`} 
                disabled={revealed || isPaused} 
              />
              <Label 
                htmlFor={`option-${question.id}-${option.id}`}
                className="flex-grow cursor-pointer text-base font-medium"
              >
                <span className="font-semibold mr-1.5">{option.id.toUpperCase()})</span> {option.text}
              </Label>
              {revealed && option.isCorrect && <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />}
              {revealed && selectedAnswer === option.id && !option.isCorrect && <XCircle className="h-5 w-5 text-red-600 shrink-0" />}
            </div>
          ))}
        </RadioGroup>

        {revealed && (
          <div className="mt-4 p-4 bg-muted/50 rounded-md border border-border">
            <h4 className="font-semibold mb-2">Explicação:</h4>
            <p className="text-sm text-muted-foreground">{question.explanation}</p>
          </div>
        )}
      </CardContent>
      {!revealed && (
        <CardFooter>
          <Button onClick={handleSubmit} className="w-full" disabled={isPaused}>
            Enviar resposta
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

const QuestionGenerator = () => {
  const [userPrompt, setUserPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Map<string, string>>(new Map());
  const [revealedQuestions, setRevealedQuestions] = useState<Set<string>>(new Set());
  const [chatHistory, setChatHistory] = useState<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }[]>([]);
  
  // New state for simulation mode
  const [isSimulatedMode, setIsSimulatedMode] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [timePerQuestion, setTimePerQuestion] = useState(120); // Default 2 minutes per question
  const [isPaused, setIsPaused] = useState(false);
  const [pauseJustification, setPauseJustification] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [simulationResults, setSimulationResults] = useState<{
    totalQuestions: number;
    correctAnswers: number;
    avgTimePerQuestion: number;
    suggestedTopics: string[];
  } | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  const generateQuestions = async (isSimulation = false) => {
    if (!userPrompt.trim() && !isSimulation) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, digite um tema para gerar questões.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    if (!isSimulation) {
      setChatHistory(prev => [
        ...prev,
        { role: 'user', content: userPrompt, timestamp: new Date() }
      ]);
    }

    // Determine number of questions based on mode
    const numQuestions = isSimulation ? 10 : 5;
    const promptToUse = isSimulation ? "simulado completo" : userPrompt;

    // Simulate API call with setTimeout
    setTimeout(() => {
      // Generate questions based on mode
      let newQuestions: Question[] = [];
      
      if (isSimulation) {
        // For simulation, create 10 questions with different categories
        const categories = ["Português", "Matemática", "Direito Constitucional", "Direito Administrativo", "Informática"];
        const difficulties = ["easy", "medium", "hard"] as const;
        
        for (let i = 0; i < numQuestions; i++) {
          const category = categories[i % categories.length];
          const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
          
          newQuestions.push({
            id: `sim-${Date.now()}-${i}`,
            question: `Questão ${i+1} de ${category}: ${promptToUse}`,
            options: [
              { id: 'a', text: 'Primeira alternativa', isCorrect: Math.random() > 0.8 },
              { id: 'b', text: 'Segunda alternativa', isCorrect: Math.random() > 0.8 && !newQuestions[newQuestions.length-1]?.options[0].isCorrect },
              { id: 'c', text: 'Terceira alternativa', isCorrect: Math.random() > 0.8 && !newQuestions[newQuestions.length-1]?.options.some(o => o.isCorrect) },
              { id: 'd', text: 'Quarta alternativa', isCorrect: Math.random() > 0.8 && !newQuestions[newQuestions.length-1]?.options.some(o => o.isCorrect) },
              { id: 'e', text: 'Quinta alternativa', isCorrect: !newQuestions[newQuestions.length-1]?.options.some(o => o.isCorrect) },
            ],
            explanation: `Esta é uma explicação sobre a questão de ${category}.`,
            difficulty: difficulty,
            category: category
          });
          
          // Make sure exactly one option is correct
          const question = newQuestions[newQuestions.length-1];
          if (!question.options.some(o => o.isCorrect)) {
            const randomIndex = Math.floor(Math.random() * question.options.length);
            question.options[randomIndex].isCorrect = true;
          }
        }
      } else {
        // For regular mode, add mock questions + generate some dynamic ones
        const generatedQuestion: Question = {
          id: `gen-${Date.now()}`,
          question: `Questão sobre ${userPrompt} gerada pela IA`,
          options: [
            { id: 'a', text: 'Primeira alternativa', isCorrect: false },
            { id: 'b', text: 'Segunda alternativa', isCorrect: true },
            { id: 'c', text: 'Terceira alternativa', isCorrect: false },
            { id: 'd', text: 'Quarta alternativa', isCorrect: false },
            { id: 'e', text: 'Quinta alternativa', isCorrect: false },
          ],
          explanation: `Esta é uma explicação sobre ${userPrompt} gerada pela IA. A resposta correta é a alternativa B porque demonstra o conceito corretamente.`,
          difficulty: 'medium',
          category: userPrompt
        };

        // Combine with mock questions for demonstration
        newQuestions = [...mockQuestions, generatedQuestion];
      }

      setCurrentQuestions(newQuestions);
      setCurrentQuestionIndex(0);
      setAnsweredQuestions(new Map());
      setRevealedQuestions(new Set());
      setIsSimulatedMode(isSimulation);
      
      if (isSimulation) {
        // Calculate total time for all questions (2 mins per question by default)
        const total = newQuestions.length * timePerQuestion;
        setTotalTime(total);
        
        toast({
          title: "Modo Simulado Ativado",
          description: `Simulado com ${newQuestions.length} questões iniciado. Tempo total: ${Math.floor(total/60)} minutos.`,
        });
      } else {
        setChatHistory(prev => [
          ...prev,
          { 
            role: 'assistant', 
            content: `Aqui estão 5 questões sobre "${userPrompt}". Responda cada uma delas para testar seus conhecimentos.`, 
            timestamp: new Date() 
          }
        ]);
      }

      setIsLoading(false);
      setUserPrompt('');
    }, 1500);
  };

  const handleAnswerSubmit = (answerId: string) => {
    if (currentQuestionIndex < currentQuestions.length) {
      const question = currentQuestions[currentQuestionIndex];
      
      // Save user's answer
      setAnsweredQuestions(new Map(answeredQuestions.set(question.id, answerId)));
      
      // Mark question as revealed
      setRevealedQuestions(new Set(revealedQuestions.add(question.id)));

      // Check if correct
      const selectedOption = question.options.find(opt => opt.id === answerId);
      const isCorrect = selectedOption?.isCorrect || false;

      if (!isSimulatedMode) {
        setChatHistory(prev => [
          ...prev,
          { 
            role: 'assistant', 
            content: isCorrect 
              ? `✓ Correto! ${question.explanation}`
              : `✗ Incorreto. ${question.explanation}`, 
            timestamp: new Date() 
          }
        ]);
      }

      // For simulation mode, auto advance to next question unless it's the last one
      if (isSimulatedMode && currentQuestionIndex < currentQuestions.length - 1) {
        setTimeout(() => {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        }, 1500);
      }

      // Check if this was the last question in simulation mode
      if (isSimulatedMode && currentQuestionIndex === currentQuestions.length - 1) {
        // Calculate simulation results
        let correctCount = 0;
        answeredQuestions.forEach((answerId, questionId) => {
          const question = currentQuestions.find(q => q.id === questionId);
          if (question) {
            const isCorrect = question.options.find(opt => opt.id === answerId)?.isCorrect || false;
            if (isCorrect) correctCount++;
          }
        });

        // Create performance report
        setSimulationResults({
          totalQuestions: currentQuestions.length,
          correctAnswers: correctCount,
          avgTimePerQuestion: timePerQuestion - Math.floor(Math.random() * 30), // Simulated average time
          suggestedTopics: calculateWeakTopics(currentQuestions, answeredQuestions)
        });

        toast({
          title: "Simulado Concluído!",
          description: `Você completou o simulado! Acertos: ${correctCount}/${currentQuestions.length}`,
        });
      }
    }
  };

  const calculateWeakTopics = (questions: Question[], answers: Map<string, string>): string[] => {
    // Group questions by category
    const categoriesMap = new Map<string, { total: number, correct: number }>();
    
    questions.forEach(question => {
      const answerId = answers.get(question.id);
      if (!answerId) return;
      
      const isCorrect = question.options.find(opt => opt.id === answerId)?.isCorrect || false;
      
      if (!categoriesMap.has(question.category)) {
        categoriesMap.set(question.category, { total: 0, correct: 0 });
      }
      
      const categoryStats = categoriesMap.get(question.category)!;
      categoryStats.total++;
      if (isCorrect) categoryStats.correct++;
    });
    
    // Find categories with less than 50% success rate
    const weakTopics: string[] = [];
    categoriesMap.forEach((stats, category) => {
      const successRate = stats.correct / stats.total;
      if (successRate < 0.5) {
        weakTopics.push(category);
      }
    });
    
    return weakTopics;
  };

  const handlePauseSimulation = () => {
    setIsDialogOpen(true);
  };

  const confirmPause = () => {
    if (!pauseJustification.trim()) {
      toast({
        title: "Justificativa necessária",
        description: "É necessário fornecer uma justificativa para pausar o simulado.",
        variant: "destructive"
      });
      return;
    }
    
    setIsPaused(true);
    setIsDialogOpen(false);
    
    toast({
      title: "Simulado Pausado",
      description: "O simulado foi pausado temporariamente.",
    });
  };

  const resumeSimulation = () => {
    setIsPaused(false);
    setPauseJustification('');
    
    toast({
      title: "Simulado Retomado",
      description: "O simulado foi retomado. Boa sorte!",
    });
  };

  const startNewSimulation = () => {
    setSimulationResults(null);
    generateQuestions(true);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const progressPercentage = isSimulatedMode 
    ? ((currentQuestionIndex + 1) / currentQuestions.length) * 100 
    : 0;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full px-1">
          <div className="space-y-4 pb-4">
            {isSimulatedMode && (
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Simulado em Andamento</h3>
                  <div className="flex items-center gap-2">
                    {isPaused ? (
                      <Button size="sm" onClick={resumeSimulation} className="flex items-center gap-1">
                        <Play className="h-4 w-4" /> Continuar
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={handlePauseSimulation} className="flex items-center gap-1">
                        <Pause className="h-4 w-4" /> Pausar
                      </Button>
                    )}
                  </div>
                </div>
                <Progress value={progressPercentage} className="h-2 w-full" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Questão {currentQuestionIndex + 1} de {currentQuestions.length}</span>
                </div>
              </div>
            )}

            {chatHistory.length === 0 && !isSimulatedMode && !simulationResults ? (
              <div className="text-center py-8">
                <h3 className="text-lg font-medium mb-2">Bem-vindo ao AI Chat</h3>
                <p className="text-muted-foreground mb-4">
                  Digite um tema para que a IA gere perguntas de concursos personalizadas para você.
                </p>
                <div className="flex justify-center gap-4 mt-6">
                  <Button onClick={() => startNewSimulation()} className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Iniciar Modo Simulado
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {!isSimulatedMode && chatHistory.map((message, index) => (
                  <div 
                    key={index} 
                    className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}
                    >
                      {message.content}
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </>
            )}

            {simulationResults && (
              <Card className="border shadow-md animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-500" /> 
                    Resultado do Simulado
                  </CardTitle>
                  <CardDescription>
                    Veja seu desempenho detalhado neste simulado
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Acertos</h4>
                      <p className="text-3xl font-bold">
                        {simulationResults.correctAnswers}/{simulationResults.totalQuestions}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {Math.round((simulationResults.correctAnswers / simulationResults.totalQuestions) * 100)}%
                      </p>
                    </div>
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Tempo Médio</h4>
                      <p className="text-3xl font-bold">
                        {Math.floor(simulationResults.avgTimePerQuestion / 60)}:{(simulationResults.avgTimePerQuestion % 60).toString().padStart(2, '0')}
                      </p>
                      <p className="text-sm text-muted-foreground">por questão</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Ranking</h4>
                      <p className="text-3xl font-bold">#12</p>
                      <p className="text-sm text-muted-foreground">entre 54 alunos</p>
                    </div>
                  </div>

                  {simulationResults.suggestedTopics.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        Sugestão de Estudo
                      </h4>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                        <p className="text-sm text-yellow-800 mb-2">
                          Com base no seu desempenho, recomendamos que você estude mais os seguintes tópicos:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {simulationResults.suggestedTopics.map((topic, index) => (
                            <Badge key={index} variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button onClick={startNewSimulation} className="w-full">
                    Iniciar Novo Simulado
                  </Button>
                </CardFooter>
              </Card>
            )}

            {currentQuestions.length > 0 && revealedQuestions.has(currentQuestions[currentQuestionIndex].id) && !simulationResults && (
              <div className="flex justify-center mt-4 space-x-2">
                <Button 
                  variant="outline" 
                  onClick={goToPreviousQuestion} 
                  disabled={currentQuestionIndex === 0}
                  size="sm"
                >
                  <ChevronUp className="h-4 w-4 mr-1" /> Anterior
                </Button>
                <Button 
                  variant="outline" 
                  onClick={goToNextQuestion} 
                  disabled={currentQuestionIndex === currentQuestions.length - 1}
                  size="sm"
                >
                  Próxima <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}

            {currentQuestions.length > 0 && !simulationResults && (
              <div className="mt-4">
                <QuestionComponent 
                  question={currentQuestions[currentQuestionIndex]} 
                  onAnswerSubmit={handleAnswerSubmit}
                  revealed={revealedQuestions.has(currentQuestions[currentQuestionIndex].id)}
                  timeLimit={isSimulatedMode ? timePerQuestion : 0}
                  isPaused={isPaused}
                />
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        </ScrollArea>
      </div>

      {!isSimulatedMode && !simulationResults && (
        <div className="border-t pt-4">
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <Textarea
                placeholder="Digite um tema para gerar questões..."
                className="min-h-[60px] resize-none"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    generateQuestions();
                  }
                }}
              />
            </div>
            <Button 
              onClick={() => generateQuestions()} 
              disabled={isLoading || !userPrompt.trim()}
              className="h-[60px] px-4"
            >
              {isLoading ? <RotateCw className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pausar Simulado</DialogTitle>
            <DialogDescription>
              Por favor, forneça uma justificativa para pausar o simulado. Lembre-se que isso só deve ser feito em casos de emergência.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Digite sua justificativa aqui..."
              value={pauseJustification}
              onChange={(e) => setPauseJustification(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmPause}>
              Confirmar Pausa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuestionGenerator;
