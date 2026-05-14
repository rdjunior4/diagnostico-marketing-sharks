'use client';
import { useState, useCallback, useEffect } from 'react';
import { OpeningScreen } from '@/components/OpeningScreen';
import { RegistrationForm } from '@/components/RegistrationForm';
import { BlockTransition } from '@/components/BlockTransition';
import { QuizView } from '@/components/QuizView';
import { ResultsScreen } from '@/components/ResultsScreen';
import { questions } from '@/data/questions';
import { blocks } from '@/data/blocks';
import { generateFullResult } from '@/engine/calculator';
import { Answer, QuizResult } from '@/types/quiz';

type Screen = 'opening' | 'registration' | 'block-intro' | 'quiz' | 'results';

export default function DiagnosticoPage() {
  const [screen, setScreen] = useState<Screen>('opening');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [respondent, setRespondent] = useState({ companyName: '', cnpj: '', respondentName: '', email: '', phone: '', segment: '' });
  const [currentBlockIntro, setCurrentBlockIntro] = useState(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [seenBlocks, setSeenBlocks] = useState<Set<number>>(new Set());

  const currentQ = questions[currentQIndex];
  const currentBlock = currentQ ? blocks.find(b => b.id === currentQ.blockId) : null;

  const completedBlocks = new Set(
    Object.values(answers).map(a => a.blockId)
  ).size;

  // Auto-save to localStorage
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem('diag-sharks-answers', JSON.stringify(answers));
      localStorage.setItem('diag-sharks-respondent', JSON.stringify(respondent));
      localStorage.setItem('diag-sharks-index', String(currentQIndex));
    }
  }, [answers, respondent, currentQIndex]);

  const handleStart = useCallback(() => setScreen('registration'), []);

  const handleRegistration = useCallback((data: { companyName: string; cnpj: string; respondentName: string; email: string; phone: string; segment: string }) => {
    setRespondent(data);
    setCurrentBlockIntro(1);
    setSeenBlocks(new Set([1]));
    setScreen('block-intro');
  }, []);

  const handleBlockContinue = useCallback(() => setScreen('quiz'), []);

  const handleAnswer = useCallback((answer: Answer) => {
    setAnswers(prev => ({ ...prev, [answer.questionId]: answer }));
  }, []);

  const handleNext = useCallback(() => {
    setDirection(1);
    if (currentQIndex < questions.length - 1) {
      const nextQ = questions[currentQIndex + 1];
      const nextBlock = nextQ.blockId;
      if (nextBlock !== currentQ.blockId && !seenBlocks.has(nextBlock)) {
        setSeenBlocks(prev => new Set([...prev, nextBlock]));
        setCurrentBlockIntro(nextBlock);
        setCurrentQIndex(prev => prev + 1);
        setScreen('block-intro');
      } else {
        setCurrentQIndex(prev => prev + 1);
      }
    } else {
      const fullResult = generateFullResult(answers, respondent);
      setResult(fullResult);
      localStorage.setItem('diag-sharks-result', JSON.stringify(fullResult));
      setScreen('results');
    }
  }, [currentQIndex, currentQ, answers, respondent, seenBlocks]);

  const handleBack = useCallback(() => {
    setDirection(-1);
    if (currentQIndex > 0) setCurrentQIndex(prev => prev - 1);
  }, [currentQIndex]);

  const handleRestart = useCallback(() => {
    setScreen('opening');
    setCurrentQIndex(0);
    setAnswers({});
    setResult(null);
    setSeenBlocks(new Set());
    localStorage.removeItem('diag-sharks-answers');
    localStorage.removeItem('diag-sharks-respondent');
    localStorage.removeItem('diag-sharks-index');
    localStorage.removeItem('diag-sharks-result');
  }, []);

  if (screen === 'opening') return <OpeningScreen onStart={handleStart} />;
  if (screen === 'registration') return <RegistrationForm onSubmit={handleRegistration} />;
  if (screen === 'block-intro') return <BlockTransition blockId={currentBlockIntro} onContinue={handleBlockContinue} />;
  if (screen === 'results' && result) return <ResultsScreen result={result} onRestart={handleRestart} />;

  return (
    <QuizView
      question={currentQ}
      questionIndex={currentQIndex}
      totalQuestions={questions.length}
      blockTitle={currentBlock?.title || ''}
      blockNumber={currentBlock?.id || 1}
      answer={answers[currentQ.id]}
      onAnswer={handleAnswer}
      onNext={handleNext}
      onBack={handleBack}
      canGoBack={currentQIndex > 0}
      direction={direction}
    />
  );
}
