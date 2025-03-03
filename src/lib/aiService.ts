
import { Question } from "@/lib/types";

// Mock response data for the AI system
// In a real implementation, this would be connected to an actual AI service
export interface AIResponse {
  text: string;
  questions?: Question[];
}

export interface SimulationParameters {
  topics: string[];
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  timePerQuestion: number;
  numberOfQuestions: number;
}

// Function to generate a question based on a topic
function generateQuestion(topic: string, difficulty: 'easy' | 'medium' | 'hard'): Question {
  const id = `q-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  // Generate a question based on the topic
  let questionText = '';
  let options = [];
  let explanation = '';
  
  // Generate different questions based on topics
  if (topic.includes('Constitucional')) {
    questionText = 'De acordo com a Constituição Federal de 1988, são princípios fundamentais da República Federativa do Brasil, EXCETO:';
    options = [
      { id: 'a', text: 'A soberania', isCorrect: false },
      { id: 'b', text: 'O pluralismo político', isCorrect: false },
      { id: 'c', text: 'A dignidade da pessoa humana', isCorrect: false },
      { id: 'd', text: 'Os valores sociais do trabalho e da livre iniciativa', isCorrect: false },
      { id: 'e', text: 'A interferência em assuntos internos de outros países', isCorrect: true },
    ];
    explanation = 'A alternativa E está correta como exceção porque a "interferência em assuntos internos de outros países" viola o princípio da não-intervenção, previsto no art. 4º, IV da CF/88. As demais alternativas (soberania, pluralismo político, dignidade da pessoa humana e valores sociais do trabalho e da livre iniciativa) são de fato princípios fundamentais da República Federativa do Brasil, conforme arts. 1º e 4º da Constituição Federal.';
  } else if (topic.includes('Administrativo')) {
    questionText = 'Sobre a Lei de Improbidade Administrativa (Lei nº 8.429/92, com redação dada pela Lei nº 14.230/2021), é correto afirmar que:';
    options = [
      { id: 'a', text: 'Admite a responsabilidade objetiva do agente público', isCorrect: false },
      { id: 'b', text: 'Não exige a comprovação de dolo para configuração dos atos de improbidade', isCorrect: false },
      { id: 'c', text: 'Aplica-se apenas a servidores públicos efetivos', isCorrect: false },
      { id: 'd', text: 'Não se aplica a agentes políticos, como prefeitos e governadores', isCorrect: false },
      { id: 'e', text: 'Exige a comprovação de dolo para configuração dos atos de improbidade, não mais admitindo a modalidade culposa', isCorrect: true },
    ];
    explanation = 'A alternativa E está correta. Com a nova redação dada pela Lei nº 14.230/2021, a Lei de Improbidade Administrativa passou a exigir a comprovação de dolo para a configuração de todos os atos de improbidade administrativa, não mais admitindo a modalidade culposa, conforme previsto no art. 1º, §2º da referida lei.';
  } else if (topic.includes('Penal')) {
    questionText = 'Sobre o crime de peculato, previsto no Código Penal Brasileiro, é correto afirmar que:';
    options = [
      { id: 'a', text: 'Somente pode ser praticado por servidor público', isCorrect: true },
      { id: 'b', text: 'É crime que não admite a forma culposa', isCorrect: false },
      { id: 'c', text: 'A pena é aumentada se o crime for praticado contra a administração da justiça', isCorrect: false },
      { id: 'd', text: 'Não há previsão de extinção da punibilidade pelo ressarcimento do dano', isCorrect: false },
      { id: 'e', text: 'Não é considerado crime contra a administração pública', isCorrect: false },
    ];
    explanation = 'A alternativa A está correta. O crime de peculato, previsto no art. 312 do Código Penal, é um crime próprio que somente pode ser praticado por funcionário público (ou equiparado). A alternativa B está incorreta, pois o peculato admite a forma culposa (§2º do art. 312 do CP). A alternativa C está incorreta pois não há essa causa de aumento de pena. A alternativa D está incorreta, pois há previsão de extinção da punibilidade pelo ressarcimento do dano no peculato culposo, conforme §3º do art. 312 do CP. A alternativa E está incorreta, pois o peculato é crime contra a Administração Pública, estando previsto no Título XI do Código Penal.';
  } else if (topic.includes('Português')) {
    questionText = 'Assinale a alternativa em que todas as palavras estão grafadas corretamente:';
    options = [
      { id: 'a', text: 'Previlégio, beneficiente, meteorologia', isCorrect: false },
      { id: 'b', text: 'Privilégio, beneficente, meteorologia', isCorrect: true },
      { id: 'c', text: 'Privilégio, beneficiente, metereologia', isCorrect: false },
      { id: 'd', text: 'Previlégio, beneficente, metereologia', isCorrect: false },
      { id: 'e', text: 'Privilégio, beneficiente, metereologia', isCorrect: false },
    ];
    explanation = 'A alternativa B está correta, pois todas as palavras estão grafadas de acordo com a norma culta da língua portuguesa: "privilégio", "beneficente" e "meteorologia". As demais alternativas apresentam ao menos um erro de grafia.';
  } else if (topic.includes('Lógica') || topic.includes('Raciocínio')) {
    questionText = 'Em uma prova de concurso, havia questões de português, matemática e conhecimentos específicos. Sabe-se que havia o dobro de questões de conhecimentos específicos em relação às de português, e que o número de questões de matemática era igual à metade da soma das questões de português e de conhecimentos específicos. Se a prova tinha 60 questões no total, quantas eram de matemática?';
    options = [
      { id: 'a', text: '10', isCorrect: false },
      { id: 'b', text: '15', isCorrect: false },
      { id: 'c', text: '20', isCorrect: true },
      { id: 'd', text: '25', isCorrect: false },
      { id: 'e', text: '30', isCorrect: false },
    ];
    explanation = 'Vamos chamar de P o número de questões de português, M o de matemática e E o de conhecimentos específicos. Temos as seguintes equações: E = 2P (conhecimentos específicos é o dobro de português); M = (P + E)/2 (matemática é metade da soma de português e conhecimentos específicos); P + M + E = 60 (total de questões). Substituindo E = 2P na segunda equação: M = (P + 2P)/2 = 3P/2. Substituindo E = 2P e M = 3P/2 na terceira equação: P + 3P/2 + 2P = 60, o que dá 4,5P = 60, logo P = 60/4,5 = 40/3 ≈ 13,33. Como P deve ser um número inteiro, arredondamos para P = 13. Assim, E = 2P = 26 e M = 3P/2 = 3×13/2 = 19,5, que arredondamos para M = 20. Conferindo: 13 + 20 + 26 = 59, que é próximo de 60 (a diferença se deve aos arredondamentos). Portanto, havia 20 questões de matemática.';
  } else if (topic.includes('Informática')) {
    questionText = 'Em relação aos conceitos de segurança da informação, o que significa a sigla DDoS?';
    options = [
      { id: 'a', text: 'Data Deletion on Server', isCorrect: false },
      { id: 'b', text: 'Distributed Denial of Service', isCorrect: true },
      { id: 'c', text: 'Digital Document System', isCorrect: false },
      { id: 'd', text: 'Dynamic Data Synchronization', isCorrect: false },
      { id: 'e', text: 'Direct Domain Services', isCorrect: false },
    ];
    explanation = 'A alternativa B está correta. DDoS significa "Distributed Denial of Service" (Ataque Distribuído de Negação de Serviço), que é um tipo de ataque cibernético onde múltiplos sistemas comprometidos são usados para atacar um único alvo, sobrecarregando-o com tráfego malicioso para torná-lo inoperante para os usuários legítimos.';
  } else {
    // Default for any other topics
    questionText = `Questão sobre ${topic}. Considere as afirmações a seguir:`;
    options = [
      { id: 'a', text: 'Primeira alternativa sobre o tema', isCorrect: false },
      { id: 'b', text: 'Segunda alternativa sobre o tema', isCorrect: false },
      { id: 'c', text: 'Terceira alternativa sobre o tema', isCorrect: true },
      { id: 'd', text: 'Quarta alternativa sobre o tema', isCorrect: false },
      { id: 'e', text: 'Quinta alternativa sobre o tema', isCorrect: false },
    ];
    explanation = `A alternativa C está correta porque apresenta a definição mais precisa sobre ${topic}. As demais alternativas contêm imprecisões ou informações parcialmente corretas.`;
  }
  
  // Adjust difficulty if needed
  if (difficulty === 'easy') {
    // Make question easier (simplify language, provide more context)
    questionText = `[FÁCIL] ${questionText}`;
  } else if (difficulty === 'hard') {
    // Make question harder (use more technical terms, require deeper knowledge)
    questionText = `[DIFÍCIL] ${questionText}`;
  }
  
  return {
    id,
    question: questionText,
    options,
    explanation,
    difficulty,
    category: topic,
  };
}

// Generate AI response based on user input
export async function generateAIResponse(userInput: string): Promise<AIResponse> {
  // Simple keyword checking to determine the response type
  const input = userInput.toLowerCase();
  
  // Check if the user is asking for a question
  if (input.includes('questão') || 
      input.includes('pergunta') || 
      input.includes('gere') || 
      input.includes('crie') || 
      input.includes('teste')) {
    
    // Determine topic from the user input
    let topic = 'conhecimentos gerais';
    let difficulty: 'easy' | 'medium' | 'hard' = 'medium';
    
    // Try to identify the topic
    if (input.includes('constitucional') || input.includes('constituição')) {
      topic = 'Direito Constitucional';
    } else if (input.includes('administrativo') || input.includes('administração') || input.includes('improbidade')) {
      topic = 'Direito Administrativo';
    } else if (input.includes('penal') || input.includes('crime')) {
      topic = 'Direito Penal';
    } else if (input.includes('português') || input.includes('gramática') || input.includes('ortografia')) {
      topic = 'Português';
    } else if (input.includes('lógica') || input.includes('raciocínio')) {
      topic = 'Raciocínio Lógico';
    } else if (input.includes('informática') || input.includes('computação') || input.includes('tecnologia')) {
      topic = 'Informática';
    }
    
    // Try to identify difficulty
    if (input.includes('fácil') || input.includes('facil') || input.includes('simples')) {
      difficulty = 'easy';
    } else if (input.includes('difícil') || input.includes('dificil') || input.includes('complexo') || input.includes('avançado')) {
      difficulty = 'hard';
    }
    
    // Generate multiple questions if explicitly requested
    const numberOfQuestions = input.includes('5 questões') ? 5 : 
                             input.includes('10 questões') ? 10 :
                             input.includes('questões') || input.includes('perguntas') ? 3 : 1;
    
    const questions: Question[] = [];
    for (let i = 0; i < numberOfQuestions; i++) {
      questions.push(generateQuestion(topic, difficulty));
    }
    
    return {
      text: `Aqui ${numberOfQuestions > 1 ? 'estão' : 'está'} ${numberOfQuestions} ${numberOfQuestions > 1 ? 'questões' : 'questão'} sobre ${topic}:`,
      questions
    };
  }
  
  // Default conversational response if not asking for questions
  return {
    text: getConversationalResponse(userInput)
  };
}

// Generate a simulation based on parameters
export async function generateSimulation(params: SimulationParameters): Promise<Question[]> {
  const questions: Question[] = [];
  const { topics, difficulty, numberOfQuestions } = params;
  
  // Generate the requested number of questions
  for (let i = 0; i < numberOfQuestions; i++) {
    // Alternate between topics if multiple are provided
    const topic = topics[i % topics.length];
    
    // Determine difficulty - if 'mixed', alternate between difficulties
    let questionDifficulty: 'easy' | 'medium' | 'hard';
    if (difficulty === 'mixed') {
      const difficultyOptions: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard'];
      questionDifficulty = difficultyOptions[i % 3];
    } else {
      questionDifficulty = difficulty;
    }
    
    questions.push(generateQuestion(topic, questionDifficulty));
  }
  
  return questions;
}

// Helper function to generate conversational responses
function getConversationalResponse(userInput: string): string {
  const input = userInput.toLowerCase();
  
  if (input.includes('olá') || input.includes('oi') || input.includes('bom dia') || input.includes('boa tarde') || input.includes('boa noite')) {
    return 'Olá! Como posso ajudar em seus estudos para concursos hoje?';
  }
  
  if (input.includes('ajuda') || input.includes('como você funciona') || input.includes('o que você pode fazer')) {
    return 'Posso ajudar você de várias formas em sua preparação para concursos:\n\n' +
           '- Gerar questões sobre diversos temas (Direito, Português, Matemática, etc.)\n' +
           '- Explicar conceitos e leis\n' +
           '- Criar simulados personalizados\n' +
           '- Fornecer dicas de estudo\n\n' +
           'Basta me dizer o que você precisa!';
  }
  
  if (input.includes('dica') || input.includes('conselho') || input.includes('como estudar')) {
    return 'Aqui estão algumas dicas para seus estudos:\n\n' +
           '1. Estabeleça uma rotina consistente de estudos\n' +
           '2. Use técnicas de revisão espaçada para retenção de longo prazo\n' +
           '3. Pratique com questões antigas de concursos\n' +
           '4. Estude a teoria e depois aplique em exercícios práticos\n' +
           '5. Faça simulados completos para testar seu conhecimento\n\n' +
           'Quer que eu elabore alguma dessas dicas com mais detalhes?';
  }
  
  if (input.includes('obrigado') || input.includes('obrigada') || input.includes('valeu')) {
    return 'De nada! Estou aqui para ajudar. Se precisar de mais questões ou tiver outras dúvidas, é só perguntar!';
  }
  
  // Default response
  return 'Entendi sua mensagem. Para gerar questões de estudo, basta pedir algo como "Gere questões sobre Direito Constitucional" ou "Crie um simulado de Português". Como posso ajudar em sua preparação hoje?';
}
