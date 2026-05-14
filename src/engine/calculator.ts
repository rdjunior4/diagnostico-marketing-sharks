import { Answer, BlockScore, SwotItem, Recommendation, QuizResult } from '@/types/quiz';
import { blocks } from '@/data/blocks';
import { questions } from '@/data/questions';
import { getMaturityLevel, getBlockInterpretation } from '@/data/scoring';

export function calculateQuestionScore(questionId: string, answer: Answer): number {
  const question = questions.find(q => q.id === questionId);
  if (!question) return 0;

  let score = 0;

  if (question.type === 'open') {
    const text = answer.openText || '';
    if (text.length >= 20) score = 1;
    else if (text.length >= 5) score = 0.5;
    else score = 0;
  } else if (question.type === 'link') {
    score = answer.linkUrl && answer.linkUrl.length > 5 ? 1 : 0;
  } else if (question.type === 'file') {
    score = answer.fileName ? 1 : 0;
  } else if (question.type === 'compound') {
    const optionScore = question.options?.find(o => answer.selectedOptions.includes(o.id))?.score || 0;
    const linkScore = question.hasLink && answer.linkUrl && answer.linkUrl.length > 5 ? 1 : 0;
    const fileScore = question.hasFile && answer.fileName ? 1 : 0;
    score = optionScore + linkScore + fileScore;
  } else if (question.type === 'multiple') {
    const hasNegative = answer.selectedOptions.some(id => {
      const opt = question.options?.find(o => o.id === id);
      return opt && opt.score === 0;
    });
    if (hasNegative) {
      score = 0;
    } else {
      score = answer.selectedOptions.length > 0 ? 1 : 0;
    }
  } else {
    const selectedOpt = question.options?.find(o => answer.selectedOptions.includes(o.id));
    score = selectedOpt?.score || 0;
  }

  return Math.min(score, question.maxScore);
}

export function calculateBlockScores(answers: Record<string, Answer>): BlockScore[] {
  return blocks.map(block => {
    const blockQuestions = questions.filter(q => q.blockId === block.id);
    let obtained = 0;
    let max = 0;

    blockQuestions.forEach(q => {
      max += q.maxScore;
      const answer = answers[q.id];
      if (answer) {
        obtained += calculateQuestionScore(q.id, answer);
      }
    });

    const percentage = max > 0 ? (obtained / max) * 100 : 0;
    const interp = getBlockInterpretation(percentage);

    return {
      blockId: block.id,
      title: block.title,
      weight: block.weight,
      obtained,
      max,
      percentage,
      weightedContribution: percentage * block.weight,
      interpretation: interp.label,
      action: interp.action,
    };
  });
}

export function calculateGeneralScore(blockScores: BlockScore[]): number {
  return blockScores.reduce((sum, bs) => sum + bs.weightedContribution, 0);
}

export function generateSwot(blockScores: BlockScore[]): SwotItem[] {
  const items: SwotItem[] = [];

  blockScores.forEach(bs => {
    if (bs.percentage >= 75) {
      items.push({ category: 'strength', text: `${bs.title} — ${bs.interpretation}`, blockId: bs.blockId, score: bs.percentage });
    }
    if (bs.percentage < 50) {
      items.push({ category: 'weakness', text: `${bs.title} — ${bs.interpretation}`, blockId: bs.blockId, score: bs.percentage });
    }
    if (bs.percentage >= 30 && bs.percentage < 70) {
      items.push({ category: 'opportunity', text: `${bs.title} pode ser fortalecido para gerar crescimento`, blockId: bs.blockId, score: bs.percentage });
    }
    if (bs.percentage < 40 && bs.weight >= 0.10) {
      items.push({ category: 'threat', text: `${bs.title} é frágil e tem alto impacto no negócio`, blockId: bs.blockId, score: bs.percentage });
    }
  });

  return items;
}

export function generateRecommendations(blockScores: BlockScore[]): Recommendation[] {
  const recs: Recommendation[] = [];

  blockScores
    .sort((a, b) => a.percentage - b.percentage)
    .forEach(bs => {
      if (bs.percentage < 50) {
        recs.push({ priority: 'alta', text: bs.action, blockId: bs.blockId, blockTitle: bs.title });
      } else if (bs.percentage < 70) {
        recs.push({ priority: 'media', text: bs.action, blockId: bs.blockId, blockTitle: bs.title });
      } else if (bs.percentage < 85) {
        recs.push({ priority: 'baixa', text: bs.action, blockId: bs.blockId, blockTitle: bs.title });
      }
    });

  return recs;
}

export function generateFullResult(
  answers: Record<string, Answer>,
  respondent: { companyName: string; cnpj: string; respondentName: string; email: string; phone: string; segment: string }
): QuizResult {
  const blockScores = calculateBlockScores(answers);
  const generalScore = calculateGeneralScore(blockScores);
  const maturityLevel = getMaturityLevel(generalScore);
  const swot = generateSwot(blockScores);
  const recommendations = generateRecommendations(blockScores);

  return {
    generalScore,
    maturityLevel,
    blockScores,
    swot,
    recommendations,
    respondent,
    submittedAt: new Date().toISOString(),
  };
}
