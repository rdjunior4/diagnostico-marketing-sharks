'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question } from '@/types/quiz';
import { Answer } from '@/types/quiz';
import { StarButton } from './StarButton';
import { SharkCheckbox } from './SharkOption';
import { SharkRadio } from './SharkOption';

interface Props {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  blockTitle: string;
  blockNumber: number;
  answer?: Answer;
  onAnswer: (answer: Answer) => void;
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
  direction: 1 | -1;
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

export function QuizView({ question, questionIndex, totalQuestions, blockTitle, blockNumber, answer, onAnswer, onNext, onBack, canGoBack, direction }: Props) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [openText, setOpenText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const autoTimer = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isMultiple = question.type === 'multiple';
  const isOpen = question.type === 'open';
  const isSingle = question.type === 'single';
  const isCompound = question.type === 'compound';
  const isLink = question.type === 'link';
  const isFile = question.type === 'file';
  const maxSel = question.maxSelections || 1;
  const progress = ((questionIndex + 1) / totalQuestions) * 100;

  useEffect(() => {
    if (answer) {
      setSelectedOptions(answer.selectedOptions || []);
      setOpenText(answer.openText || '');
      setLinkUrl(answer.linkUrl || '');
      setFileName(answer.fileName || '');
    } else {
      setSelectedOptions([]);
      setOpenText('');
      setLinkUrl('');
      setFileName('');
    }
  }, [question.id, answer]);

  useEffect(() => {
    return () => { if (autoTimer.current) clearTimeout(autoTimer.current); };
  }, []);

  const buildAnswer = useCallback((opts: string[], text?: string, link?: string, file?: string): Answer => ({
    questionId: question.id,
    blockId: question.blockId,
    selectedOptions: opts,
    openText: text,
    linkUrl: link,
    fileName: file,
    rawScore: 0,
    maxScore: question.maxScore,
  }), [question]);

  const handleSelect = (optId: string) => {
    if (autoTimer.current) clearTimeout(autoTimer.current);

    if (isMultiple) {
      setSelectedOptions(prev => {
        if (prev.includes(optId)) return prev.filter(id => id !== optId);
        if (prev.length < maxSel) return [...prev, optId];
        return prev;
      });
    } else {
      setSelectedOptions([optId]);
      if (isSingle && !isCompound) {
        autoTimer.current = setTimeout(() => {
          onAnswer(buildAnswer([optId]));
          onNext();
        }, 500);
      }
    }
  };

  const handleContinue = () => {
    if (autoTimer.current) clearTimeout(autoTimer.current);
    onAnswer(buildAnswer(selectedOptions, openText, linkUrl, fileName));
    onNext();
  };

  const hasAnswer = selectedOptions.length > 0 || openText.length > 0 || linkUrl.length > 0 || fileName.length > 0;
  const isLast = questionIndex === totalQuestions - 1;
  const showBar = isMultiple || isOpen || isCompound || isLink || isFile;
  const isFirstQuestion = questionIndex === 0;
  const textRatio = isOpen ? openText.length / (question.maxLength || 100) : 0;

  return (
    <div className="min-h-screen min-h-dvh flex flex-col relative overflow-hidden">
      <div className="depth-grid" />

      {/* Header */}
      <div className="w-full px-4 sm:px-5 pt-3 pb-2 sticky top-0 z-50">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2 min-w-0">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#25A7F0] shadow-[0_0_8px_rgba(37,167,240,0.5)]" />
                <span className="text-[11px] font-bold text-[#25A7F0] tracking-wider whitespace-nowrap" style={{fontFamily:'var(--font-poppins)'}}>
                  Bloco {blockNumber}
                </span>
              </span>
              <span className="text-[#BFC4CC]/25 hidden sm:inline">·</span>
              <span className="text-[11px] text-[#BFC4CC]/60 truncate hidden sm:inline" style={{fontFamily:'var(--font-poppins)'}}>
                {blockTitle}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#25A7F0] tabular-nums">{Math.round(progress)}%</span>
            </div>
          </div>
          <div className="h-[18px] bg-[#173B74]/25 rounded-full relative">
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <motion.div className="h-full bg-gradient-to-r from-[#173B74] via-[#1E63C6] to-[#25A7F0] shadow-[0_0_12px_rgba(37,167,240,0.3)]"
                initial={{width:0}} animate={{width:`${progress}%`}} transition={{duration:0.5,ease:[0.25,0.46,0.45,0.94]}}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer-slow" style={{backgroundSize:'200% 100%'}}/>
              </motion.div>
            </div>
            {progress > 2 && (
              <div
                className="absolute top-1/2 -translate-y-1/2 pointer-events-none z-10"
                style={{
                  left: `${progress}%`,
                  width: '30px',
                  height: '28px',
                  marginLeft: '-2px',
                  background: 'radial-gradient(ellipse 30px 14px at 0% 50%, rgba(37,167,240,0.3) 0%, rgba(37,167,240,0.08) 50%, transparent 100%)',
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={`flex-1 overflow-y-auto px-4 sm:px-5 pt-5 sm:pt-8 ${showBar ? (isFirstQuestion ? 'pb-10' : 'pb-44 sm:pb-48') : 'pb-10'}`}>
        <div className="max-w-lg mx-auto">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={`q-${question.id}`} custom={direction} variants={slideVariants}
              initial="enter" animate="center" exit="exit" transition={{duration:0.3,ease:[0.25,0.46,0.45,0.94]}}>
              <h1 className="text-xl sm:text-2xl md:text-3xl text-[#F4F7FB] leading-tight mb-1 font-semibold" style={{fontFamily:'var(--font-poppins)'}}>
                {question.question}
              </h1>
              {isMultiple && question.maxSelections && (
                <p className="text-xs text-[#BFC4CC]/50 mt-1.5 flex items-center gap-1.5" style={{fontFamily:'var(--font-poppins)'}}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 text-[#25A7F0]/60">
                    <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01" strokeLinecap="round"/>
                  </svg>
                  Escolha até {question.maxSelections} opções
                </p>
              )}
              {isSingle && !isCompound && (
                <p className="text-[10px] text-[#BFC4CC]/30 mt-1.5" style={{fontFamily:'var(--font-poppins)'}}>Selecione para avançar</p>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-5 sm:mt-6">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div key={`opts-${question.id}`} custom={direction} variants={slideVariants}
                initial="enter" animate="center" exit="exit" transition={{duration:0.25}} className="space-y-2 sm:space-y-2.5">

                {/* Open text */}
                {isOpen && (
                  <div>
                    <textarea value={openText} onChange={e=>setOpenText(e.target.value.slice(0,question.maxLength||200))}
                      placeholder={question.placeholder} rows={3}
                      className="w-full p-4 text-sm border border-[#173B74]/40 rounded-xl bg-[#000]/30 text-[#F4F7FB] placeholder:text-[#BFC4CC]/30 focus:border-[#25A7F0]/60 transition-all resize-none backdrop-blur-sm"
                      style={{fontFamily:'var(--font-poppins)'}}/>
                    <div className="mt-2 flex justify-between text-[10px] text-[#BFC4CC]/40" style={{fontFamily:'var(--font-poppins)'}}>
                      <span>Resposta aberta</span>
                      <span className="tabular-nums" style={{color: textRatio<0.2?'#BFC4CC':textRatio<0.5?'#25A7F0':'#1E63C6', opacity:0.6}}>
                        {openText.length}/{question.maxLength||200}
                      </span>
                    </div>
                    <div className="h-0.5 bg-[#173B74]/15 rounded-full overflow-hidden mt-1">
                      <motion.div className="h-full rounded-full" style={{backgroundColor:textRatio<0.2?'#BFC4CC':textRatio<0.5?'#25A7F0':'#1E63C6'}}
                        animate={{width:`${textRatio*100}%`}} transition={{duration:0.3}}/>
                    </div>
                  </div>
                )}

{/* Options (single, multiple, compound) */}
                 {!isOpen && question.options?.map((opt, i) => {
                   const isSelected = selectedOptions.includes(opt.id);
                   const isDisabled = isMultiple && selectedOptions.length >= maxSel && !isSelected;

                   if (isMultiple) {
                     return (
                       <SharkCheckbox
                         key={opt.id}
                         id={opt.id}
                         label={opt.label}
                         checked={isSelected}
                         onChange={() => handleSelect(opt.id)}
                         disabled={isDisabled}
                         score={opt.score}
                         delay={i * 0.05}
                       />
                     );
                   }

                   return (
                     <SharkRadio
                       key={opt.id}
                       id={opt.id}
                       name={`question-${question.id}`}
                       value={opt.id}
                       label={opt.label}
                       checked={isSelected}
                       onChange={() => handleSelect(opt.id)}
                       disabled={isDisabled}
                       score={opt.score}
                       delay={i * 0.05}
                     />
                   );
                 })}

                {/* Compound: Link input */}
                {isCompound && question.hasLink && selectedOptions.includes('sim') && (
                  <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} className="mt-3">
                    <label className="text-xs text-[#BFC4CC]/50 mb-1.5 block" style={{fontFamily:'var(--font-poppins)'}}>
                      🔗 {question.linkLabel || 'Cole o link aqui'}
                    </label>
                    <input type="url" value={linkUrl} onChange={e=>setLinkUrl(e.target.value)} placeholder="https://..."
                      className="w-full p-3.5 text-sm border border-[#25A7F0]/30 rounded-xl bg-[#000]/30 text-[#F4F7FB] focus:border-[#25A7F0]/60 backdrop-blur-sm"
                      style={{fontFamily:'var(--font-poppins)'}}/>
                  </motion.div>
                )}

                {/* Compound: File upload */}
                {isCompound && question.hasFile && selectedOptions.includes('sim') && (
                  <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} className="mt-3">
                    <input type="file" ref={fileInputRef} className="hidden" onChange={e=>{
                      const f = e.target.files?.[0];
                      if(f) setFileName(f.name);
                    }}/>
                    <div onClick={()=>fileInputRef.current?.click()}
                      className={`upload-zone ${fileName?'has-file':''}`}>
                      {fileName ? (
                        <div className="flex items-center justify-center gap-2 text-sm text-[#25A7F0]" style={{fontFamily:'var(--font-poppins)'}}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {fileName}
                        </div>
                      ) : (
                        <div className="text-sm text-[#BFC4CC]/40" style={{fontFamily:'var(--font-poppins)'}}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 mx-auto mb-2 text-[#173B74]">
                            <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {question.fileLabel || 'Clique para anexar arquivo'}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Inline button for first question */}
            {isFirstQuestion && showBar && (
              <div className="mt-8 flex justify-center pb-2">
                <StarButton onClick={handleContinue} disabled={!hasAnswer} lightWidth={130} duration={2.5} lightColor="#25A7F0" className={`px-10 py-3.5 ${!hasAnswer ? 'opacity-50' : ''}`}>
                  <span className="text-sm font-bold">{isLast?'FINALIZAR':'CONTINUAR'}</span>
                </StarButton>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      {showBar && !isFirstQuestion && (
        <div className="fixed bottom-0 left-0 right-0 z-40">
          <div className="bg-gradient-to-t from-[#0A1018] via-[#0A1018]/98 to-transparent pt-6 pb-4 px-4 safe-bottom">
            <div className="max-w-lg mx-auto flex gap-3" style={{fontFamily:'var(--font-poppins)'}}>
{canGoBack ? (
                <button onClick={onBack}
                  className="flex-1 py-3.5 px-4 rounded-xl border border-[#25A7F0]/25 text-[#BFC4CC]/60 text-sm font-semibold flex items-center justify-center gap-1.5 hover:border-[#25A7F0]/40 hover:text-[#BFC4CC]/80 transition-all duration-300"
                  style={{fontFamily:'var(--font-poppins)'}}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>VOLTAR
                </button>
              ) : <div className="flex-1"/>}
              <StarButton onClick={handleContinue} disabled={!hasAnswer} lightWidth={130} duration={2.5} lightColor="#25A7F0" className={`flex-[1.2] py-3.5 ${!hasAnswer ? 'opacity-50' : ''}`}>
                <span className="text-sm font-bold">{isLast?'FINALIZAR':'CONTINUAR'}</span>
              </StarButton>
            </div>
          </div>
        </div>
      )}

{/* Single-select back button (no bottom bar) */}
       {!showBar && canGoBack && (
         <div className="fixed bottom-0 left-0 right-0 z-40">
           <div className="bg-gradient-to-t from-[#0A1018] via-[#0A1018]/98 to-transparent pt-6 pb-4 px-4 safe-bottom">
             <div className="max-w-lg mx-auto" style={{fontFamily:'var(--font-poppins)'}}>
               <button onClick={onBack}
                 className="w-full py-3.5 px-4 rounded-xl border border-[#25A7F0]/25 text-[#BFC4CC]/60 text-sm font-semibold flex items-center justify-center gap-1.5 hover:border-[#25A7F0]/40 hover:text-[#BFC4CC]/80 transition-all duration-300"
                 style={{fontFamily:'var(--font-poppins)'}}>
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                   <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>VOLTAR
               </button>
             </div>
           </div>
         </div>
       )}
    </div>
  );
}
