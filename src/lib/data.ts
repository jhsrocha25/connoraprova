
import { Course, User, Question } from './types';

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Direito Constitucional',
    description: 'Aprenda os fundamentos do Direito Constitucional para concursos públicos',
    thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    category: 'Direito',
    level: 'intermediate',
    duration: '40h',
    progress: 45,
    modules: [
      {
        id: 'm1',
        title: 'Princípios Fundamentais',
        description: 'Estudo dos princípios fundamentais da Constituição Federal',
        isCompleted: true,
        content: [
          {
            id: 'c1',
            type: 'video',
            title: 'Introdução aos Princípios Fundamentais',
            url: '#',
            duration: '32min',
            isCompleted: true
          },
          {
            id: 'c2',
            type: 'pdf',
            title: 'Material de Apoio - Princípios Fundamentais',
            url: '#',
            isCompleted: true
          }
        ]
      },
      {
        id: 'm2',
        title: 'Direitos e Garantias Fundamentais',
        description: 'Análise dos direitos e garantias fundamentais',
        isCompleted: false,
        content: [
          {
            id: 'c3',
            type: 'video',
            title: 'Direitos e Deveres Individuais e Coletivos',
            url: '#',
            duration: '45min',
            isCompleted: true
          },
          {
            id: 'c4',
            type: 'interactive',
            title: 'Exercícios - Direitos Fundamentais',
            url: '#',
            isCompleted: false
          }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Raciocínio Lógico',
    description: 'Desenvolva habilidades de raciocínio lógico para provas de concursos',
    thumbnail: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    category: 'Matemática',
    level: 'beginner',
    duration: '25h',
    progress: 70,
    modules: [
      {
        id: 'm3',
        title: 'Lógica Proposicional',
        description: 'Fundamentos da lógica proposicional e tabela verdade',
        isCompleted: true,
        content: [
          {
            id: 'c5',
            type: 'video',
            title: 'Proposições e Conectivos Lógicos',
            url: '#',
            duration: '28min',
            isCompleted: true
          },
          {
            id: 'c6',
            type: 'pdf',
            title: 'Tabelas Verdade - Exercícios Resolvidos',
            url: '#',
            isCompleted: true
          }
        ]
      },
      {
        id: 'm4',
        title: 'Raciocínio Sequencial',
        description: 'Técnicas para resolver problemas de sequências lógicas',
        isCompleted: false,
        content: [
          {
            id: 'c7',
            type: 'video',
            title: 'Sequências Numéricas',
            url: '#',
            duration: '35min',
            isCompleted: true
          },
          {
            id: 'c8',
            type: 'interactive',
            title: 'Exercícios Práticos - Sequências',
            url: '#',
            isCompleted: false
          }
        ]
      }
    ]
  },
  {
    id: '3',
    title: 'Português para Concursos',
    description: 'Domine a língua portuguesa para se destacar nas provas de concursos',
    thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    category: 'Língua Portuguesa',
    level: 'intermediate',
    duration: '30h',
    progress: 25,
    modules: [
      {
        id: 'm5',
        title: 'Análise Sintática',
        description: 'Estudo da estrutura sintática da língua portuguesa',
        isCompleted: false,
        content: [
          {
            id: 'c9',
            type: 'video',
            title: 'Período Simples e Composto',
            url: '#',
            duration: '40min',
            isCompleted: true
          },
          {
            id: 'c10',
            type: 'pdf',
            title: 'Análise Sintática em Concursos - Casos Práticos',
            url: '#',
            isCompleted: false
          }
        ]
      },
      {
        id: 'm6',
        title: 'Interpretação de Textos',
        description: 'Técnicas avançadas para interpretação de textos',
        isCompleted: false,
        content: [
          {
            id: 'c11',
            type: 'video',
            title: 'Estratégias de Interpretação',
            url: '#',
            duration: '38min',
            isCompleted: false
          },
          {
            id: 'c12',
            type: 'interactive',
            title: 'Exercícios de Interpretação Textual',
            url: '#',
            isCompleted: false
          }
        ]
      }
    ]
  },
  {
    id: '4',
    title: 'Direito Administrativo',
    description: 'Estudo completo sobre Direito Administrativo para concursos',
    thumbnail: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    category: 'Direito',
    level: 'advanced',
    duration: '35h',
    progress: 10,
    modules: [
      {
        id: 'm7',
        title: 'Atos Administrativos',
        description: 'Conceito, requisitos e atributos dos atos administrativos',
        isCompleted: false,
        content: [
          {
            id: 'c13',
            type: 'video',
            title: 'Classificação dos Atos Administrativos',
            url: '#',
            duration: '42min',
            isCompleted: true
          },
          {
            id: 'c14',
            type: 'pdf',
            title: 'Material Complementar - Atos Administrativos',
            url: '#',
            isCompleted: false
          }
        ]
      },
      {
        id: 'm8',
        title: 'Licitações e Contratos',
        description: 'Estudo da Lei 8.666/93 e da Nova Lei de Licitações',
        isCompleted: false,
        content: [
          {
            id: 'c15',
            type: 'video',
            title: 'Modalidades de Licitação',
            url: '#',
            duration: '48min',
            isCompleted: false
          },
          {
            id: 'c16',
            type: 'interactive',
            title: 'Questionário - Licitações',
            url: '#',
            isCompleted: false
          }
        ]
      }
    ]
  }
];

export const mockQuestions: Question[] = [
  {
    id: 'q1',
    question: 'De acordo com a Constituição Federal, a soberania, a cidadania e o pluralismo político são:',
    options: [
      { id: 'a', text: 'Objetivos fundamentais da República Federativa do Brasil', isCorrect: false },
      { id: 'b', text: 'Fundamentos da República Federativa do Brasil', isCorrect: true },
      { id: 'c', text: 'Princípios que regem as relações internacionais do Brasil', isCorrect: false },
      { id: 'd', text: 'Direitos sociais garantidos a todos os brasileiros', isCorrect: false },
      { id: 'e', text: 'Dispositivos referentes à organização político-administrativa do Estado', isCorrect: false }
    ],
    explanation: 'De acordo com o art. 1º da Constituição Federal, a soberania, a cidadania e o pluralismo político são fundamentos da República Federativa do Brasil, juntamente com a dignidade da pessoa humana e os valores sociais do trabalho e da livre iniciativa.',
    difficulty: 'medium',
    category: 'Direito Constitucional'
  },
  {
    id: 'q2',
    question: 'Em uma sequência lógica, os números aparecem na seguinte ordem: 2, 6, 12, 20, 30, 42, ... Qual é o próximo número dessa sequência?',
    options: [
      { id: 'a', text: '52', isCorrect: false },
      { id: 'b', text: '54', isCorrect: false },
      { id: 'c', text: '56', isCorrect: true },
      { id: 'd', text: '60', isCorrect: false },
      { id: 'e', text: '64', isCorrect: false }
    ],
    explanation: 'A sequência segue o padrão: 2, 2+4=6, 6+6=12, 12+8=20, 20+10=30, 30+12=42. O próximo número seria 42+14=56. Perceba que os valores somados aumentam de 2 em 2: +4, +6, +8, +10, +12, +14...',
    difficulty: 'medium',
    category: 'Raciocínio Lógico'
  },
  {
    id: 'q3',
    question: 'Assinale a alternativa em que a concordância verbal está correta:',
    options: [
      { id: 'a', text: 'Fazem dois anos que me formei.', isCorrect: false },
      { id: 'b', text: 'Haviam muitos candidatos na sala.', isCorrect: false },
      { id: 'c', text: 'Precisam-se de profissionais qualificados.', isCorrect: false },
      { id: 'd', text: 'Aluga-se casas para temporada.', isCorrect: false },
      { id: 'e', text: 'Mais de um candidato se apresentou para a vaga.', isCorrect: true }
    ],
    explanation: 'A concordância verbal está correta em "Mais de um candidato se apresentou para a vaga". As demais alternativas apresentam erros: o correto seria "Faz dois anos" (impessoal), "Havia muitos candidatos" (impessoal), "Precisa-se de profissionais" (impessoal com SE) e "Alugam-se casas" (voz passiva sintética, concordando com "casas").',
    difficulty: 'hard',
    category: 'Língua Portuguesa'
  }
];

export const mockUser: User = {
  id: '1',
  name: 'João Silva',
  email: 'joao.silva@example.com',
  avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
  role: 'student',
  joinedDate: new Date(2023, 5, 15),
  progress: {
    userId: '1',
    totalQuestionsAnswered: 87,
    correctAnswers: 65,
    incorrectAnswers: 22,
    questionsHistory: [],
    courseProgress: [
      {
        courseId: '1',
        progress: 45,
        lastAccessed: new Date(2023, 9, 28)
      },
      {
        courseId: '2',
        progress: 70,
        lastAccessed: new Date(2023, 10, 1)
      },
      {
        courseId: '3',
        progress: 25,
        lastAccessed: new Date(2023, 9, 22)
      },
      {
        courseId: '4',
        progress: 10,
        lastAccessed: new Date(2023, 9, 15)
      }
    ],
    performanceByCategory: [
      {
        category: 'Direito Constitucional',
        correctPercentage: 82,
        questionsAttempted: 35
      },
      {
        category: 'Raciocínio Lógico',
        correctPercentage: 75,
        questionsAttempted: 28
      },
      {
        category: 'Língua Portuguesa',
        correctPercentage: 68,
        questionsAttempted: 24
      }
    ],
    streak: 5,
    lastActive: new Date()
  }
};
