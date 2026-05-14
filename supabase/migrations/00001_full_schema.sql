-- ============================================
-- DIAGNÓSTICO ESTRATÉGICO DE MARKETING
-- Funil de Qualificação de Lead
-- Schema do Banco de Dados
-- ============================================

-- 1. TABELA DE LEADS (identificação + qualificação)
CREATE TABLE IF NOT EXISTS leads (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  company_name TEXT NOT NULL,
  cnpj VARCHAR(18) UNIQUE,
  respondent_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  segment TEXT,
  lead_score INTEGER DEFAULT 0,
  lead_status TEXT DEFAULT 'new' CHECK (lead_status IN ('new','contacted','qualified','disqualified','converted','lost')),
  source TEXT DEFAULT 'quiz',
  notes TEXT,
  first_contact_at TIMESTAMPTZ DEFAULT NOW(),
  last_contact_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABELA DE SUBMISSÕES DO QUIZ (cada resposta completa)
CREATE TABLE IF NOT EXISTS quiz_submissions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  lead_id BIGINT REFERENCES leads(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  respondent_name TEXT NOT NULL,
  email TEXT,
  segment TEXT,
  general_score INTEGER,
  maturity_level TEXT,
  maturity_shark TEXT,
  block_scores JSONB DEFAULT '[]',
  swot JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '[]',
  raw_answers JSONB DEFAULT '{}',
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABELA DE FILA DE E-MAILS (para automação futura)
CREATE TABLE IF NOT EXISTS email_queue (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  lead_id BIGINT REFERENCES leads(id) ON DELETE CASCADE,
  email_type TEXT NOT NULL CHECK (email_type IN (
    'welcome',
    'quiz_result',
    'commercial_notification',
    'follow_up',
    're Engagement'
  )),
  recipient_email TEXT NOT NULL,
  subject TEXT,
  body TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','sent','failed','cancelled')),
  sent_at TIMESTAMPTZ,
  error_log TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABELA DE LOG DE AUTOMAÇÕES
CREATE TABLE IF NOT EXISTS automation_logs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  lead_id BIGINT REFERENCES leads(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  details JSONB DEFAULT '{}',
  error_log TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_leads_cnpj ON leads(cnpj);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(lead_status);
CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(lead_score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_submissions_lead ON quiz_submissions(lead_id);
CREATE INDEX IF NOT EXISTS idx_submissions_date ON quiz_submissions(submitted_at DESC);

CREATE INDEX IF NOT EXISTS idx_email_queue_status ON email_queue(status);
CREATE INDEX IF NOT EXISTS idx_email_queue_type ON email_queue(email_type);

-- ============================================
-- FUNÇÃO PARA ATUALIZAR updated_at AUTOMATICAMENTE
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNÇÃO PARA DETECÇÃO DE CNPJ DUPLICADO
-- ============================================
CREATE OR REPLACE FUNCTION find_lead_by_cnpj(p_cnpj TEXT)
RETURNS TABLE(
  id BIGINT,
  company_name TEXT,
  respondent_name TEXT,
  email TEXT,
  segment TEXT,
  lead_score INTEGER,
  lead_status TEXT,
  last_contact_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT l.id, l.company_name, l.respondent_name, l.email, l.segment,
         l.lead_score, l.lead_status, l.last_contact_at
  FROM leads l
  WHERE l.cnpj = p_cnpj
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;
