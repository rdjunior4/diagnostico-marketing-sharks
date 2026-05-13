'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { blocks } from '@/data/blocks';
import { StarButton } from './StarButton';

interface Props {
  blockId: number;
  onContinue: () => void;
}

export function BlockTransition({ blockId, onContinue }: Props) {
  const block = blocks.find(b => b.id === blockId);
  if (!block) return null;

  return (
    <div className="min-h-screen min-h-dvh flex flex-col items-center justify-center relative overflow-hidden px-6">
      <div className="depth-grid" />

      <motion.div
        className="relative z-10 flex flex-col items-center text-center max-w-md"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <Image src="/shark-logo.png" alt="Sharks Company" width={80} height={80} className="mb-6" priority />

        <span className="text-[10px] text-[#25A7F0] font-bold tracking-[0.2em] mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>
          BLOCO {block.id} · {Math.round(block.weight * 100)}%
        </span>

        <h1 className="text-2xl sm:text-3xl text-[#F4F7FB] font-bold mb-3 leading-tight tracking-wide">
          {block.title}
        </h1>

        <p className="text-sm sm:text-base text-[#BFC4CC]/60 leading-[1.75] mb-8 max-w-xs sm:max-w-sm text-pretty" style={{ fontFamily: 'var(--font-poppins)' }}>
          {block.subtitle}
        </p>

        <StarButton onClick={onContinue} lightWidth={160} duration={2.5} lightColor="#25A7F0" className="px-14 py-5 text-base">
          CONTINUAR
        </StarButton>
      </motion.div>
    </div>
  );
}
