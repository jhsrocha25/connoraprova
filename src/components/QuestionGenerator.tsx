
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
import { ChevronDown, ChevronUp, Send, RotateCw, Clock, Award, CheckCircle, XCircle } from 'lucide-react';
import { mockQuestions } from '@/lib/data';

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
  revealed = false
}: { 
  question: Question, 
  onAnswerSubmit: (answerId: string) => void,
  revealed?: boolean
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const difficultyColorClass = getDifficultyColor(question.difficulty);

  const handleAnswerChange = (value: string) => {
    setSelectedAnswer(value);
  };

  const handleSubmit = () => {
    if (selectedAnswer) {
      onAnswerSubmit(selectedAnswer);
    } else {
      toast({
        title: "Seleção obrigatória",
        description: "Por favor, selecione uma alternativa antes de enviar.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="border border-border shadow-sm animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge className={difficultyColorClass}>
            {question.difficulty === 'easy' ? 'Fácil' : question.difficulty === 'medium' ? 'Médio' : 'Difícil'}
          </Badge>
          <Badge variant="outline">{question.category}</Badge>
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
                disabled={revealed} 
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
          <Button onClick={handleSubmit} className="w-full">
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

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  const generateQuestions = async () => {
    if (!userPrompt.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, digite um tema para gerar questões.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setChatHistory(prev => [
      ...prev,
      { role: 'user', content: userPrompt, timestamp: new Date() }
    ]);

    // Simulate API call with setTimeout
    setTimeout(() => {
      // For demo, use mockQuestions + generate some dynamic ones
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
      const newQuestions = [...mockQuestions, generatedQuestion];
      setCurrentQuestions(newQuestions);
      setCurrentQuestionIndex(0);
      setAnsweredQuestions(new Map());
      setRevealedQuestions(new Set());

      setChatHistory(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: `Aqui estão 5 questões sobre "${userPrompt}". Responda cada uma delas para testar seus conhecimentos.`, 
          timestamp: new Date() 
        }
      ]);

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

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full px-1">
          <div className="space-y-4 pb-4">
            {chatHistory.length === 0 ? (
              <div className="text-center py-8">
                <h3 className="text-lg font-medium mb-2">Bem-vindo ao AI Chat</h3>
                <p className="text-muted-foreground mb-4">
                  Digite um tema para que a IA gere perguntas de concursos personalizadas para você.
                </p>
              </div>
            ) : (
              <>
                {chatHistory.map((message, index) => (
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

            {currentQuestions.length > 0 && revealedQuestions.has(currentQuestions[currentQuestionIndex].id) && (
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

            {currentQuestions.length > 0 && (
              <div className="mt-4">
                <QuestionComponent 
                  question={currentQuestions[currentQuestionIndex]} 
                  onAnswerSubmit={handleAnswerSubmit}
                  revealed={revealedQuestions.has(currentQuestions[currentQuestionIndex].id)}
                />
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        </ScrollArea>
      </div>

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
            onClick={generateQuestions} 
            disabled={isLoading || !userPrompt.trim()}
            className="h-[60px] px-4"
          >
            {isLoading ? <RotateCw className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestionGenerator;
