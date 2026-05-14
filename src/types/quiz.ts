export type QuestionType = 'single' | 'multiple' | 'open' | 'link' | 'file' | 'compound';

export interface Option {
  id: string;
  label: string;
  score: number;
}

export interface Question {
  id: string;
  blockId: number;
  type: QuestionType;
  question: string;
  options?: Option[];
  maxSelections?: number;
  placeholder?: string;
  maxLength?: number;
  hasLink?: boolean;
  hasFile?: boolean;
  linkLabel?: string;
  fileLabel?: string;
  maxScore: number;
}

export interface Block {
  id: number;
  title: string;
  subtitle: string;
  weight: number;
  icon: string;
}

export interface Answer {
  questionId: string;
  blockId: number;
  selectedOptions: string[];
  openText?: string;
  linkUrl?: string;
  fileName?: string;
  rawScore: number;
  maxScore: number;
}

export interface BlockScore {
  blockId: number;
  title: string;
  weight: number;
  obtained: number;
  max: number;
  percentage: number;
  weightedContribution: number;
  interpretation: string;
  action: string;
}

export interface MaturityLevel {
  id: string;
  name: string;
  sharkName: string;
  minScore: number;
  maxScore: number;
  description: string;
  color: string;
}

export interface SwotItem {
  category: 'strength' | 'weakness' | 'opportunity' | 'threat';
  text: string;
  blockId: number;
  score: number;
}

export interface Recommendation {
  priority: 'alta' | 'media' | 'baixa';
  text: string;
  blockId: number;
  blockTitle: string;
}

export interface QuizResult {
  generalScore: number;
  maturityLevel: MaturityLevel;
  blockScores: BlockScore[];
  swot: SwotItem[];
  recommendations: Recommendation[];
  respondent: {
    companyName: string;
    cnpj: string;
    respondentName: string;
    email: string;
    phone: string;
    segment: string;
  };
  submittedAt: string;
}

export interface QuizState {
  currentScreen: 'opening' | 'registration' | 'block-intro' | 'quiz' | 'completion' | 'results';
  currentQuestionIndex: number;
  answers: Record<string, Answer>;
  respondent: {
    companyName: string;
    cnpj: string;
    respondentName: string;
    email: string;
    phone: string;
    segment: string;
  };
  direction: 1 | -1;
}
