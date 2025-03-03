
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { MessageSquare, Send, Sparkles, Clock, BookOpen, FileText, Lightbulb, Search, ChevronRight, RotateCw } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { mockUser } from '@/lib/data';
import QuestionGenerator from '@/components/QuestionGenerator';
import { Question } from '@/lib/types';
import { generateAIResponse } from '@/lib/aiService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  questions?: Question[];
}

interface QuestionExample {
  id: string;
  title: string;
  prompt: string;
  category: string;
}

const questionExamples: QuestionExample[] = [
  {
    id: '1',
    title: 'Questões de Direito Constitucional',
    prompt: 'Gere 5 questões de múltipla escolha sobre princípios fundamentais da Constituição Federal',
    category: 'Direito',
  },
  {
    id: '2',
    title: 'Questões de Matemática para Concursos',
    prompt: 'Gere 3 questões de matemática sobre juros compostos no nível de concursos públicos',
    category: 'Exatas',
  },
  {
    id: '3',
    title: 'Português - Concordância Verbal',
    prompt: 'Crie questões sobre concordância verbal para concursos públicos com explicações detalhadas',
    category: 'Língua Portuguesa',
  },
  {
    id: '4',
    title: 'Informática Básica',
    prompt: 'Gere questões sobre conceitos básicos de informática: hardware, software e redes',
    category: 'Informática',
  },
  {
    id: '5',
    title: 'Raciocínio Lógico',
    prompt: 'Crie 5 questões de raciocínio lógico no estilo CESPE',
    category: 'Raciocínio Lógico',
  },
  {
    id: '6',
    title: 'Atualidades e Conhecimentos Gerais',
    prompt: 'Gere questões sobre acontecimentos recentes no Brasil e no mundo',
    category: 'Conhecimentos Gerais',
  },
];

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [showQuestionGenerator, setShowQuestionGenerator] = useState(false);
  const [generatorPrompt, setGeneratorPrompt] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat tab is active
  useEffect(() => {
    if (activeTab === 'chat' && !showQuestionGenerator) {
      inputRef.current?.focus();
    }
  }, [activeTab, showQuestionGenerator]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Create a new user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Get response from AI service
      const aiResponse = await generateAIResponse(input);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse.text,
        timestamp: new Date(),
        questions: aiResponse.questions,
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // If there's only one question, set it as the current question
      if (aiResponse.questions && aiResponse.questions.length === 1) {
        setCurrentQuestion(aiResponse.questions[0]);
      }
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startQuestionGenerator = (prompt: string = '') => {
    setGeneratorPrompt(prompt);
    setShowQuestionGenerator(true);
  };

  const handleAnswerQuestion = (questionId: string, answerId: string) => {
    const question = messages
      .flatMap(msg => msg.questions || [])
      .find(q => q.id === questionId);
    
    if (!question) return;
    
    const selectedOption = question.options.find(opt => opt.id === answerId);
    const isCorrect = selectedOption?.isCorrect || false;
    
    const content = isCorrect 
      ? `✓ Correto! ${question.explanation}`
      : `✗ Incorreto. A resposta correta é a alternativa ${question.options.find(opt => opt.isCorrect)?.id.toUpperCase()}. ${question.explanation}`;
    
    const assistantMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    setCurrentQuestion(null);
  };

  const formatMessage = (content: string) => {
    // Split by newlines and process each line
    return content.split('\n').map((line, index) => (
      <p key={index} className={line.trim().length === 0 ? 'h-4' : 'mb-2'}>
        {line}
      </p>
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container pt-24 pb-16 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Assistente IA</h1>
          <p className="text-muted-foreground">
            Gere questões personalizadas e receba feedback instantâneo
          </p>
        </div>

        {showQuestionGenerator ? (
          <div className="animate-fade-in">
            <div className="mb-4">
              <Button 
                variant="ghost" 
                className="p-0 h-auto text-muted-foreground hover:text-foreground"
                onClick={() => setShowQuestionGenerator(false)}
              >
                <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
                <span>Voltar para o chat</span>
              </Button>
            </div>
            <QuestionGenerator initialPrompt={generatorPrompt} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="border h-[calc(100vh-220px)] flex flex-col">
                <CardHeader className="px-4 py-3 border-b">
                  <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="chat">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Chat
                      </TabsTrigger>
                      <TabsTrigger value="gerador">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Gerador de Questões
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardHeader>
                
                <TabsContent value="chat" className="flex-1 flex flex-col m-0 p-0">
                  <CardContent className="flex-1 overflow-hidden p-0">
                    <ScrollArea className="h-[calc(100vh-330px)] px-4 py-4">
                      {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <MessageSquare className="h-6 w-6 text-primary" />
                          </div>
                          <h3 className="text-lg font-medium mb-2">
                            Olá, {mockUser.name.split(' ')[0]}!
                          </h3>
                          <p className="text-muted-foreground max-w-md mb-4">
                            Eu sou seu assistente de estudos para concursos. Posso gerar questões, explicar conceitos e ajudar com sua preparação.
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
                            <Button 
                              variant="outline" 
                              className="justify-start"
                              onClick={() => setInput('Gere 3 questões sobre Direito Constitucional')}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Questões de Direito
                            </Button>
                            <Button 
                              variant="outline" 
                              className="justify-start"
                              onClick={() => setInput('Como estudar para concursos de forma eficiente?')}
                            >
                              <Lightbulb className="h-4 w-4 mr-2" />
                              Dicas de estudo
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {messages.map((message) => (
                            <div key={message.id}>
                              <div 
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                              >
                                <div 
                                  className={`max-w-[80%] rounded-lg p-4 ${
                                    message.role === 'user'
                                      ? 'bg-primary text-primary-foreground'
                                      : 'bg-muted'
                                  }`}
                                >
                                  <div className="flex items-center mb-2">
                                    {message.role === 'assistant' && (
                                      <Avatar className="h-6 w-6 mr-2">
                                        <Sparkles className="h-4 w-4" />
                                      </Avatar>
                                    )}
                                    <span className="text-xs opacity-70">
                                      {message.role === 'user' ? 'Você' : 'Assistente'} • {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                  <div className="text-sm whitespace-pre-line">
                                    {formatMessage(message.content)}
                                  </div>
                                </div>
                              </div>
                              
                              {/* Display questions if they exist */}
                              {message.questions && message.questions.length > 0 && (
                                <div className="mt-3 mb-6 pl-12">
                                  {message.questions.map((question) => (
                                    <Card key={question.id} className="mb-4 border shadow-sm">
                                      <CardHeader className="p-4 pb-2">
                                        <div className="flex justify-between items-start mb-2">
                                          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 mb-2">
                                            {question.category}
                                          </Badge>
                                          <Badge variant="outline">
                                            {question.difficulty === 'easy' ? 'Fácil' : 
                                             question.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                                          </Badge>
                                        </div>
                                        <CardTitle className="text-base font-medium">
                                          {question.question}
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="p-4 pt-2">
                                        <div className="space-y-2">
                                          {question.options.map((option) => (
                                            <div
                                              key={option.id}
                                              className="flex items-center space-x-2 rounded-md border p-2 cursor-pointer hover:bg-muted/50 transition-colors"
                                              onClick={() => handleAnswerQuestion(question.id, option.id)}
                                            >
                                              <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full border text-xs font-medium">
                                                {option.id.toUpperCase()}
                                              </div>
                                              <div className="text-sm">{option.text}</div>
                                            </div>
                                          ))}
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                          {isLoading && (
                            <div className="flex justify-start">
                              <div className="max-w-[80%] rounded-lg p-4 bg-muted">
                                <div className="flex items-center">
                                  <Avatar className="h-6 w-6 mr-2">
                                    <Sparkles className="h-4 w-4" />
                                  </Avatar>
                                  <span className="text-xs opacity-70">
                                    Assistente • Digitando...
                                  </span>
                                </div>
                                <div className="mt-2 flex space-x-1">
                                  <div className="h-2 w-2 rounded-full bg-muted-foreground/30 animate-bounce"></div>
                                  <div className="h-2 w-2 rounded-full bg-muted-foreground/30 animate-bounce delay-100"></div>
                                  <div className="h-2 w-2 rounded-full bg-muted-foreground/30 animate-bounce delay-200"></div>
                                </div>
                              </div>
                            </div>
                          )}
                          <div ref={messagesEndRef} />
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                  
                  <CardFooter className="p-4 border-t">
                    <div className="flex items-end w-full gap-2">
                      <Textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Digite sua mensagem..."
                        className="min-h-[80px] resize-none"
                      />
                      <Button 
                        onClick={handleSendMessage} 
                        size="icon" 
                        className="h-10 w-10"
                        disabled={isLoading || !input.trim()}
                      >
                        {isLoading ? <RotateCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardFooter>
                </TabsContent>
                
                <TabsContent value="gerador" className="flex-1 flex flex-col m-0 p-0">
                  <CardContent className="flex-1 p-4 overflow-auto">
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-2">Gerador de Questões</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Crie questões personalizadas sobre qualquer tema para praticar e testar seus conhecimentos.
                      </p>
                      <Button 
                        onClick={() => startQuestionGenerator()} 
                        className="h-12 md:h-10 text-base md:text-sm px-4 w-full sm:w-auto"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Criar questões personalizadas
                      </Button>
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                        <h3 className="font-medium">Exemplos populares</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">Direito</Badge>
                          <Badge variant="outline">Exatas</Badge>
                          <Badge variant="outline">Português</Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {questionExamples.map((example) => (
                          <div 
                            key={example.id}
                            className="rounded-lg border p-3 hover:border-primary hover:bg-muted/50 cursor-pointer transition-colors"
                            onClick={() => startQuestionGenerator(example.prompt)}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-sm">{example.title}</h4>
                              <Badge variant="outline" className="text-xs">
                                {example.category}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {example.prompt}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </TabsContent>
              </Card>
            </div>
            
            <div className="hidden md:block">
              <Card className="border h-[calc(100vh-220px)]">
                <CardHeader>
                  <CardTitle className="text-lg">Recursos</CardTitle>
                  <CardDescription>Conteúdo relevante para seus estudos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium flex items-center mb-3">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      Acessados Recentemente
                    </h3>
                    
                    <div className="space-y-3">
                      {mockUser.progress.courseProgress.slice(0, 3).map((course) => (
                        <div key={course.courseId} className="flex items-start space-x-3">
                          <div className="w-10 h-10 rounded bg-muted/70 flex items-center justify-center flex-shrink-0">
                            <BookOpen className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">
                              Curso {course.courseId}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {course.progress}% concluído
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm font-medium flex items-center mb-3">
                      <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                      Tópicos Populares
                    </h3>
                    
                    <div className="flex flex-wrap gap-2">
                      {['Direito Constitucional', 'Português', 'Matemática', 'Informática', 'Raciocínio Lógico', 'Direito Administrativo', 'Legislação'].map((topic) => (
                        <Badge key={topic} variant="secondary" className="cursor-pointer" onClick={() => setInput(`Gere questões sobre ${topic}`)}>
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm font-medium flex items-center mb-3">
                      <Lightbulb className="h-4 w-4 mr-2 text-muted-foreground" />
                      Dicas e Sugestões
                    </h3>
                    
                    <div className="space-y-3 text-sm">
                      <p className="text-muted-foreground">
                        Peça questões com explicações detalhadas para entender melhor cada tópico.
                      </p>
                      <p className="text-muted-foreground">
                        Use o gerador para criar questões específicas para o seu concurso-alvo.
                      </p>
                      <p className="text-muted-foreground">
                        Pratique regularmente com diferentes níveis de dificuldade.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AIChat;
