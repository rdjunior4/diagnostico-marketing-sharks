'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { StarButton } from './StarButton';

export function OpeningScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen min-h-dvh flex flex-col items-center justify-center relative overflow-hidden px-6">
      <div className="depth-grid" />

      <motion.div
        className="relative z-10 flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <motion.div
          className="relative mb-10"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Image src="/shark-logo.png" alt="Sharks Company" width={140} height={140} className="relative z-10" priority />
        </motion.div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl text-[#F4F7FB] mb-2 tracking-wide leading-tight">
          DIAGNÓSTICO ESTRATÉGICO
          <span className="block text-[#25A7F0]">DE MARKETING</span>
        </h1>

        <p className="text-sm text-[#BFC4CC]/50 mt-4 mb-12" style={{ fontFamily: 'var(--font-poppins)' }}>
          Um raio-x completo do marketing da sua empresa
        </p>

<StarButton onClick={onStart} lightWidth={120} duration={2.5} lightColor="#25A7F0" className="px-12 py-5">
           <span className="text-base font-bold tracking-widest">INICIAR</span>
         </StarButton>
      </motion.div>
    </div>
  );
}
