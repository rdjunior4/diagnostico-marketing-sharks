import { MaturityLevel } from '@/types/quiz';

export const maturityLevels: MaturityLevel[] = [
  {
    id: 'critico',
    name: 'Crítico',
    sharkName: 'Baby Shark',
    minScore: 0,
    maxScore: 25,
    description: 'Estrutura de marketing praticamente inexistente ou muito frágil. A empresa depende de ações improvisadas.',
    color: '#ef4444',
  },
  {
    id: 'basico',
    name: 'Básico',
    sharkName: 'Silky Shark',
    minScore: 26,
    maxScore: 50,
    description: 'Existem ações pontuais, mas sem integração, processo, mensuração ou estratégia consistente.',
    color: '#f97316',
  },
  {
    id: 'estruturacao',
    name: 'Em Estruturação',
    sharkName: 'Bull Shark',
    minScore: 51,
    maxScore: 70,
    description: 'Possui alguns ativos e iniciativas, mas ainda precisa organizar processos e consistência.',
    color: '#eab308',
  },
  {
    id: 'estrategico',
    name: 'Estratégico',
    sharkName: 'Tiger Shark',
    minScore: 71,
    maxScore: 85,
    description: 'Boa base de marketing, com clareza, ativos relevantes e oportunidades de otimização.',
    color: '#25A7F0',
  },
  {
    id: 'alta-performance',
    name: 'Alta Performance',
    sharkName: 'White Shark',
    minScore: 86,
    maxScore: 100,
    description: 'Estrutura madura, mensurável, integrada e alinhada ao padrão Sharks.',
    color: '#1E63C6',
  },
];

export const blockInterpretations = [
  { min: 0, max: 25, label: 'Crítico', action: 'Criar estrutura básica e documentação mínima', color: '#ef4444' },
  { min: 26, max: 50, label: 'Frágil', action: 'Organizar processos e corrigir lacunas prioritárias', color: '#f97316' },
  { min: 51, max: 70, label: 'Intermediário', action: 'Padronizar, melhorar consistência e iniciar mensuração', color: '#eab308' },
  { min: 71, max: 85, label: 'Forte', action: 'Otimizar performance e aprofundar estratégia', color: '#25A7F0' },
  { min: 86, max: 100, label: 'Excelente', action: 'Escalar, automatizar e manter revisão contínua', color: '#1E63C6' },
];

export function getMaturityLevel(score: number): MaturityLevel {
  const rounded = Math.round(score);
  return maturityLevels.find(l => rounded >= l.minScore && rounded <= l.maxScore) || maturityLevels[0];
}

export function getBlockInterpretation(score: number) {
  const rounded = Math.round(score);
  return blockInterpretations.find(i => rounded >= i.min && rounded <= i.max) || blockInterpretations[0];
}
