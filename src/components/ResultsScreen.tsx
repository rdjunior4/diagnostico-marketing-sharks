'use client';
import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QuizResult } from '@/types/quiz';
import Image from 'next/image';
import { StarButton } from './StarButton';

interface Props {
  result: QuizResult;
  onRestart: () => void;
}

function RadarChart({ blockScores }: { blockScores: QuizResult['blockScores'] }) {
  const cx = 200, cy = 200, r = 120;
  const n = blockScores.length;
  const angles = blockScores.map((_, i) => (Math.PI * 2 * i) / n - Math.PI / 2);

  const gridLevels = [25, 50, 75, 100];
  const dataPoints = blockScores.map((bs, i) => {
    const pct = bs.percentage / 100;
    const x = cx + r * pct * Math.cos(angles[i]);
    const y = cy + r * pct * Math.sin(angles[i]);
    return `${x},${y}`;
  }).join(' ');

  const getScoreColor = (pct: number) => pct >= 70 ? '#25A7F0' : pct >= 50 ? '#eab308' : '#ef4444';

  function splitTitle(title: string): [string, string] {
    if (title.length <= 16) return [title, ''];
    const mid = title.indexOf(',');
    if (mid > 0 && mid <= 16) return [title.slice(0, mid), title.slice(mid + 1).trim()];
    const space = title.lastIndexOf(' ', 14);
    if (space > 0) return [title.slice(0, space), title.slice(space + 1)];
    return [title.slice(0, 14), title.slice(14)];
  }

  return (
    <svg viewBox="0 0 420 440" className="w-full max-w-sm mx-auto">
      {/* Grid backgrounds */}
      {gridLevels.map(level => {
        const pts = angles.map(a => {
          const pr = (level / 100) * r;
          return `${cx + pr * Math.cos(a)},${cy + pr * Math.sin(a)}`;
        }).join(' ');
        return <polygon key={level} points={pts} fill="none" stroke="rgba(30,99,198,0.3)" strokeWidth="0.75" />;
      })}
      {/* Axes */}
      {angles.map((a, i) => (
        <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(a)} y2={cy + r * Math.sin(a)} stroke="rgba(30,99,198,0.15)" strokeWidth="0.5" />
      ))}
      {/* Data polygon */}
      <motion.polygon points={dataPoints} fill="rgba(37,167,240,0.1)" stroke="#25A7F0" strokeWidth="2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3 }} />
      <motion.polygon points={dataPoints} fill="none" stroke="#25A7F0" strokeWidth="4" opacity="0.2"
        initial={{ opacity: 0 }} animate={{ opacity: 0.2 }} transition={{ duration: 1, delay: 0.5 }}
        style={{ filter: 'blur(3px)' }} />
      {/* Data points */}
      {blockScores.map((bs, i) => {
        const pct = bs.percentage / 100;
        const x = cx + r * pct * Math.cos(angles[i]);
        const y = cy + r * pct * Math.sin(angles[i]);
        const color = getScoreColor(bs.percentage);
        return (
          <g key={i}>
            <motion.circle cx={x} cy={y} r="4" fill={color}
              initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.6 + i * 0.05 }} />
            <motion.circle cx={x} cy={y} r="7" fill="none" stroke={color} strokeWidth="1" opacity="0.3"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.7 + i * 0.05 }} />
            <motion.text x={x} y={y - 10} textAnchor="middle" dominantBaseline="central"
              className="text-[8px] font-bold fill-[#F4F7FB]/80"
              style={{ fontFamily: 'var(--font-poppins)' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 + i * 0.05 }}>
              {Math.round(bs.percentage)}%
            </motion.text>
          </g>
        );
      })}
      {/* Labels */}
      {blockScores.map((bs, i) => {
        const lx = cx + (r + 32) * Math.cos(angles[i]);
        const ly = cy + (r + 32) * Math.sin(angles[i]);
        const isLeft = angles[i] > Math.PI / 2 || angles[i] < -Math.PI / 2;
        const [line1, line2] = splitTitle(bs.title);
        return (
          <g key={`l-${i}`}>
            <motion.text x={lx} y={line2 ? ly - 5 : ly}
              textAnchor={isLeft ? 'end' : Math.abs(angles[i]) < 0.1 || Math.abs(angles[i] - Math.PI) < 0.1 ? 'middle' : 'start'}
              dominantBaseline="central"
              className="text-[7.5px] fill-[#BFC4CC]/80 font-medium"
              style={{ fontFamily: 'var(--font-poppins)' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 + i * 0.05 }}>
              {line1}
            </motion.text>
            {line2 && (
              <motion.text x={lx} y={ly + 9}
                textAnchor={isLeft ? 'end' : Math.abs(angles[i]) < 0.1 || Math.abs(angles[i] - Math.PI) < 0.1 ? 'middle' : 'start'}
                dominantBaseline="central"
                className="text-[7px] fill-[#BFC4CC]/50"
                style={{ fontFamily: 'var(--font-poppins)' }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 + i * 0.05 }}>
                {line2}
              </motion.text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function SwotGrid({ swot }: { swot: QuizResult['swot'] }) {
  const cats = [
    { key: 'strength' as const, label: 'Forças', color: '#25A7F0', icon: '💪' },
    { key: 'weakness' as const, label: 'Fraquezas', color: '#ef4444', icon: '⚠️' },
    { key: 'opportunity' as const, label: 'Oportunidades', color: '#22c55e', icon: '🚀' },
    { key: 'threat' as const, label: 'Ameaças', color: '#f97316', icon: '🔥' },
  ];
  return (
    <div className="grid grid-cols-2 gap-3">
      {cats.map(cat => {
        const items = swot.filter(s => s.category === cat.key);
        return (
          <div key={cat.key} className="rounded-xl p-4" style={{ background: `${cat.color}08`, border: `1px solid ${cat.color}25` }}>
            <div className="flex items-center gap-2 mb-3">
              <span>{cat.icon}</span>
              <span className="text-xs font-bold tracking-wider" style={{ color: cat.color, fontFamily: 'var(--font-poppins)' }}>{cat.label}</span>
            </div>
            {items.length > 0 ? items.map((item, i) => (
              <p key={i} className="text-[11px] text-[#BFC4CC]/70 mb-1.5 leading-relaxed" style={{ fontFamily: 'var(--font-poppins)' }}>{item.text}</p>
            )) : <p className="text-[11px] text-[#BFC4CC]/30 italic" style={{ fontFamily: 'var(--font-poppins)' }}>Nenhum identificado</p>}
          </div>
        );
      })}
    </div>
  );
}

export function ResultsScreen({ result, onRestart }: Props) {
  const { generalScore, maturityLevel, blockScores, swot, recommendations, respondent } = result;
  const resultsRef = useRef<HTMLDivElement>(null);
  const submittedRef = useRef(false);

  useEffect(() => {
    if (submittedRef.current) return;
    submittedRef.current = true;

    const submit = async () => {
      try {
        await fetch('/api/submit-quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...respondent,
            generalScore,
            maturityLevel,
            blockScores,
            swot,
            recommendations,
          }),
        });
      } catch (err) {
        console.error('Erro ao salvar resultado:', err);
      }
    };
    submit();
  }, [respondent, generalScore, maturityLevel, blockScores, swot, recommendations]);

  const handleExportPDF = async () => {
    if (!resultsRef.current) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(resultsRef.current, {
        background: '#0A1018',
        scale: 2,
        useCORS: true,
        logging: false,
      } as any);

      const link = document.createElement('a');
      link.download = `diagnostico-marketing-${respondent.companyName || 'sharks'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Erro ao exportar imagem:', err);
    }
  };

  const handlePrint = async () => {
    if (!resultsRef.current) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(resultsRef.current, {
        background: '#0A1018',
        scale: 2,
        useCORS: true,
        logging: false,
      } as any);

      const win = window.open('', '_blank');
      if (!win) return;
      win.document.write(`<img src="${canvas.toDataURL()}" style="width:100%;max-width:800px;margin:0 auto;display:block;" />`);
      win.document.title = `Diagnóstico Marketing - ${respondent.companyName || 'Sharks'}`;
      win.document.close();
      win.focus();
      setTimeout(() => win.print(), 500);
    } catch (err) {
      console.error('Erro ao imprimir:', err);
    }
  };

  return (
    <div className="min-h-screen min-h-dvh relative overflow-hidden">
      <div className="depth-grid" />


      <div ref={resultsRef} className="relative z-10 max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Image src="/shark-logo.png" alt="Sharks" width={120} height={120} className="mx-auto mb-4" />
          <h1 className="text-3xl sm:text-4xl text-[#F4F7FB] tracking-wide mb-1">RESULTADO DO DIAGNÓSTICO</h1>
          {respondent.companyName && (
            <p className="text-sm text-[#BFC4CC]/60" style={{ fontFamily: 'var(--font-poppins)' }}>{respondent.companyName}</p>
          )}
        </motion.div>

        {/* Score principal */}
        <motion.div className="rounded-2xl p-8 text-center mb-6 border border-[#25A7F0]/15" style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(12px)' }}
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <p className="text-xs text-[#BFC4CC]/50 uppercase tracking-widest mb-4" style={{ fontFamily: 'var(--font-poppins)' }}>Score Geral</p>
          <motion.div className="text-7xl sm:text-8xl font-bold mb-3 drop-shadow-[0_0_20px_rgba(37,167,240,0.3)]" style={{ color: maturityLevel.color }}
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.4 }}>
            {Math.round(generalScore)}%
          </motion.div>
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-3xl">🦈</span>
            <div>
              <p className="text-xl font-bold text-[#F4F7FB]" style={{ fontFamily: 'var(--font-poppins)' }}>{maturityLevel.sharkName}</p>
              <p className="text-sm font-semibold" style={{ color: maturityLevel.color, fontFamily: 'var(--font-poppins)' }}>{maturityLevel.name}</p>
            </div>
          </div>
          <p className="text-sm text-[#BFC4CC]/60 max-w-md mx-auto leading-relaxed" style={{ fontFamily: 'var(--font-poppins)' }}>{maturityLevel.description}</p>

          {/* Maturity bar */}
          <div className="mt-8 max-w-sm mx-auto">
            <div className="h-[10px] bg-[#173B74]/20 rounded-full overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]">
              <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, #ef4444, #f97316, #eab308, #25A7F0, #1E63C6)` }}
                initial={{ width: 0 }} animate={{ width: `${generalScore}%` }} transition={{ duration: 1.2, delay: 0.6 }} />
            </div>
            <div className="flex justify-between mt-1.5 text-[9px] text-[#BFC4CC]/30" style={{ fontFamily: 'var(--font-poppins)' }}>
              <span>Crítico</span><span>Básico</span><span>Estruturação</span><span>Estratégico</span><span>Alta Perf.</span>
            </div>
          </div>
        </motion.div>

        {/* Radar */}
        <motion.div className="rounded-2xl p-6 mb-6 border border-[#173B74]/25" style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(12px)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <h2 className="text-xl text-[#F4F7FB] text-center mb-4 tracking-wide">RADAR POR BLOCO</h2>
          <RadarChart blockScores={blockScores} />
        </motion.div>

        {/* Block scores */}
        <motion.div className="rounded-2xl p-6 mb-6 border border-[#173B74]/25" style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(12px)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <h2 className="text-xl text-[#F4F7FB] mb-4 tracking-wide">SCORE POR BLOCO</h2>
          <div className="space-y-4">
            {blockScores.map((bs, i) => (
              <motion.div key={bs.blockId} className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.05 }}>
                <div className="w-8 text-right text-xs font-bold tabular-nums" style={{ color: bs.percentage >= 70 ? '#25A7F0' : bs.percentage >= 50 ? '#eab308' : '#ef4444', fontFamily: 'var(--font-poppins)' }}>
                  {Math.round(bs.percentage)}%
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-[#F4F7FB]/80" style={{ fontFamily: 'var(--font-poppins)' }}>{bs.title}</span>
                    <span className="text-[10px] text-[#BFC4CC]/40" style={{ fontFamily: 'var(--font-poppins)' }}>{bs.interpretation}</span>
                  </div>
                  <div className="h-2 bg-[#173B74]/20 rounded-full overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]">
                    <motion.div className="h-full rounded-full" initial={{ width: 0 }}
                      animate={{ width: `${bs.percentage}%` }} transition={{ duration: 0.8, delay: 0.7 + i * 0.05 }}
                      style={{ backgroundColor: bs.percentage >= 70 ? '#25A7F0' : bs.percentage >= 50 ? '#eab308' : '#ef4444' }} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* SWOT */}
        <motion.div className="mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          <h2 className="text-xl text-[#F4F7FB] mb-4 tracking-wide text-center">ANÁLISE S.W.O.T.</h2>
          <SwotGrid swot={swot} />
        </motion.div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <motion.div className="rounded-2xl p-6 mb-8 border border-[#173B74]/25" style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(12px)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            <h2 className="text-xl text-[#F4F7FB] mb-4 tracking-wide">RECOMENDAÇÕES</h2>
            <div className="space-y-4">
              {recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    rec.priority === 'alta' ? 'bg-red-500/20 text-red-400' :
                    rec.priority === 'media' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'
                  }`} style={{ fontFamily: 'var(--font-poppins)' }}>{rec.priority.toUpperCase()}</span>
                  <div>
                    <p className="text-sm text-[#F4F7FB]/80" style={{ fontFamily: 'var(--font-poppins)' }}>{rec.blockTitle}</p>
                    <p className="text-xs text-[#BFC4CC]/50 mt-0.5" style={{ fontFamily: 'var(--font-poppins)' }}>{rec.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div className="text-center pb-8 space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <StarButton onClick={handleExportPDF} lightWidth={160} duration={3} lightColor="#25A7F0" className="px-10 py-4 text-sm">
              SALVAR IMAGEM
            </StarButton>
            <StarButton onClick={handlePrint} lightWidth={160} duration={3} lightColor="#25A7F0" className="px-10 py-4 text-sm">
              EXPORTAR PDF
            </StarButton>
          </div>
          <div>
            <button onClick={onRestart}
              className="text-sm text-[#BFC4CC]/40 hover:text-[#BFC4CC]/70 transition-colors underline underline-offset-4"
              style={{ fontFamily: 'var(--font-poppins)' }}>
              Refazer diagnóstico
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
