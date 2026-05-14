'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { StarButton } from './StarButton';
import { SharkSelect } from './SharkSelect';

interface RegistrationData {
  companyName: string;
  cnpj: string;
  respondentName: string;
  email: string;
  phone: string;
  segment: string;
}

interface Props {
  onSubmit: (data: RegistrationData) => void;
}

export function RegistrationForm({ onSubmit }: Props) {
  const [companyName, setCompanyName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [respondentName, setRespondentName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [segment, setSegment] = useState('');

  const canSubmit = companyName.trim().length > 1 && respondentName.trim().length > 1;

  const formatCnpj = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 14);
    return digits
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 7) return `(${digits.slice(0,2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({
      companyName,
      cnpj: cnpj.replace(/\D/g, ''),
      respondentName,
      email,
      phone: phone.replace(/\D/g, ''),
      segment,
    });
  };

  const inputClass = "w-full p-3.5 text-sm border border-[#173B74]/40 rounded-xl bg-[#000000]/30 text-[#F4F7FB] placeholder:text-[#BFC4CC]/30 focus:border-[#25A7F0]/60 focus:bg-[#000000]/40 transition-all duration-300 backdrop-blur-sm";

  return (
    <div className="min-h-screen min-h-dvh flex flex-col items-center justify-center relative overflow-y-auto px-6 py-12">
      <div className="depth-grid" />

      <motion.form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md rounded-2xl p-8 bg-[#000000]/30 backdrop-blur-sm border-2 border-[#25A7F0]/40 shadow-[0_0_40px_rgba(37,167,240,0.1)]"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-center mb-6">
          <Image src="/shark-logo.png" alt="Sharks" width={100} height={100} />
        </div>

        <h2 className="text-2xl text-center text-[#F4F7FB] mb-1 tracking-wide">IDENTIFICAÇÃO</h2>
        <p className="text-xs text-center text-[#BFC4CC]/50 mb-8" style={{ fontFamily: 'var(--font-poppins)' }}>
          Preencha seus dados antes de iniciar o diagnóstico
        </p>

        <div className="space-y-4" style={{ fontFamily: 'var(--font-poppins)' }}>
          <div>
            <label className="text-xs text-[#BFC4CC]/60 mb-1.5 block font-medium">Nome da empresa *</label>
            <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Ex: Sharks Company" className={inputClass} />
          </div>
          <div>
            <label className="text-xs text-[#BFC4CC]/60 mb-1.5 block font-medium">CNPJ</label>
            <input type="text" value={cnpj} onChange={e => setCnpj(formatCnpj(e.target.value))} placeholder="00.000.000/0000-00" className={inputClass} maxLength={18} />
          </div>
          <div>
            <label className="text-xs text-[#BFC4CC]/60 mb-1.5 block font-medium">Seu nome *</label>
            <input type="text" value={respondentName} onChange={e => setRespondentName(e.target.value)} placeholder="Nome do responsável" className={inputClass} />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-[#BFC4CC]/60 mb-1.5 block font-medium">E-mail</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="contato@empresa.com" className={inputClass} />
            </div>
            <div className="flex-1">
              <label className="text-xs text-[#BFC4CC]/60 mb-1.5 block font-medium">Telefone</label>
              <input type="text" value={phone} onChange={e => setPhone(formatPhone(e.target.value))} placeholder="(11) 99999-9999" className={inputClass} maxLength={16} />
            </div>
          </div>
          <div>
            <label className="text-xs text-[#BFC4CC]/60 mb-1.5 block font-medium">Segmento</label>
            <SharkSelect value={segment} onChange={setSegment} />
          </div>

          {segment === 'outro' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <label className="text-xs text-[#25A7F0]/80 mb-1.5 block font-medium">Qual segmento?</label>
              <input
                type="text"
                value={segment}
                onChange={e => setSegment(e.target.value)}
                placeholder="Descreva o segmento da sua empresa..."
                className={inputClass + " border-[#25A7F0]/40 focus:border-[#25A7F0]"}
                autoFocus
              />
            </motion.div>
          )}
        </div>

        <StarButton onClick={handleSubmit} disabled={!canSubmit} lightWidth={140} duration={3} lightColor="#25A7F0" className="w-full mt-8 py-5" type="submit">
          COMEÇAR DIAGNÓSTICO
        </StarButton>
      </motion.form>
    </div>
  );
}
