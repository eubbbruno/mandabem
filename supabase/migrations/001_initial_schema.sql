-- MandaBem - Schema Inicial
-- Criado: 2026-01-19

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  cpf TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Locations (locais físicos onde rolam os desafios)
CREATE TABLE public.locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Challenges (desafios criativos)
CREATE TABLE public.challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  theme TEXT NOT NULL,
  prize DECIMAL(10,2) NOT NULL,
  rules JSONB NOT NULL, -- Array de strings com regras
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft', -- draft, active, evaluating, finished
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (status IN ('draft', 'active', 'evaluating', 'finished'))
);

-- Submissions (participações)
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL, -- photo, text
  content_url TEXT, -- URL no Supabase Storage (se foto) ou NULL (se texto)
  content_text TEXT, -- Texto da submissão (se tipo text)
  payment_amount DECIMAL(10,2) NOT NULL,
  attempt_number INTEGER NOT NULL DEFAULT 1,
  score_final DECIMAL(5,2), -- Score final calculado (0-10)
  status TEXT NOT NULL DEFAULT 'pending_payment', -- pending_payment, paid, evaluating, evaluated
  payment_id TEXT, -- ID do pagamento no Mercado Pago
  created_at TIMESTAMPTZ DEFAULT NOW(),
  evaluated_at TIMESTAMPTZ,
  CHECK (content_type IN ('photo', 'text')),
  CHECK (status IN ('pending_payment', 'paid', 'evaluating', 'evaluated')),
  UNIQUE(challenge_id, user_id, attempt_number)
);

-- Judges (jurados)
CREATE TABLE public.judges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Evaluations (avaliações dos jurados)
CREATE TABLE public.evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  judge_id UUID NOT NULL REFERENCES judges(id) ON DELETE CASCADE,
  strategy INTEGER NOT NULL CHECK (strategy BETWEEN 0 AND 10),
  engagement INTEGER NOT NULL CHECK (engagement BETWEEN 0 AND 10),
  adequacy INTEGER NOT NULL CHECK (adequacy BETWEEN 0 AND 10),
  execution INTEGER NOT NULL CHECK (execution BETWEEN 0 AND 10),
  creativity INTEGER NOT NULL CHECK (creativity BETWEEN 0 AND 10),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(submission_id, judge_id)
);

-- Indexes para performance
CREATE INDEX idx_challenges_location ON challenges(location_id);
CREATE INDEX idx_challenges_status ON challenges(status);
CREATE INDEX idx_challenges_dates ON challenges(starts_at, ends_at);
CREATE INDEX idx_submissions_challenge ON submissions(challenge_id);
CREATE INDEX idx_submissions_user ON submissions(user_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_evaluations_submission ON evaluations(submission_id);
CREATE INDEX idx_locations_city ON locations(city);

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE judges ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- Policies para users
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Policies para locations (público)
CREATE POLICY "Anyone can view active locations" ON locations
  FOR SELECT USING (active = true);

-- Policies para challenges (público)
CREATE POLICY "Anyone can view active challenges" ON challenges
  FOR SELECT USING (status IN ('active', 'evaluating', 'finished'));

-- Policies para submissions
CREATE POLICY "Users can view their own submissions" ON submissions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create submissions" ON submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view evaluated submissions for ranking" ON submissions
  FOR SELECT USING (status = 'evaluated' AND score_final IS NOT NULL);

-- Policies para judges
CREATE POLICY "Judges can view active judges" ON judges
  FOR SELECT USING (active = true);

-- Policies para evaluations
CREATE POLICY "Judges can view evaluations" ON evaluations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM judges WHERE judges.user_id = auth.uid() AND judges.active = true
    )
  );

CREATE POLICY "Judges can create evaluations" ON evaluations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM judges WHERE judges.id = judge_id AND judges.user_id = auth.uid() AND judges.active = true
    )
  );

-- Function para calcular score final
CREATE OR REPLACE FUNCTION calculate_submission_score(submission_uuid UUID)
RETURNS DECIMAL(5,2) AS $$
DECLARE
  avg_strategy DECIMAL(5,2);
  avg_engagement DECIMAL(5,2);
  avg_adequacy DECIMAL(5,2);
  avg_execution DECIMAL(5,2);
  avg_creativity DECIMAL(5,2);
  attempt_num INTEGER;
  weighted_score DECIMAL(5,2);
  penalty DECIMAL(5,2);
  final_score DECIMAL(5,2);
BEGIN
  -- Pega médias das avaliações
  SELECT 
    AVG(strategy)::DECIMAL(5,2),
    AVG(engagement)::DECIMAL(5,2),
    AVG(adequacy)::DECIMAL(5,2),
    AVG(execution)::DECIMAL(5,2),
    AVG(creativity)::DECIMAL(5,2)
  INTO avg_strategy, avg_engagement, avg_adequacy, avg_execution, avg_creativity
  FROM evaluations
  WHERE submission_id = submission_uuid;

  -- Se não tem avaliações, retorna NULL
  IF avg_strategy IS NULL THEN
    RETURN NULL;
  END IF;

  -- Pega número da tentativa
  SELECT attempt_number INTO attempt_num
  FROM submissions
  WHERE id = submission_uuid;

  -- Calcula score ponderado
  weighted_score := (
    (avg_strategy * 0.30) +
    (avg_engagement * 0.30) +
    (avg_adequacy * 0.20) +
    (avg_execution * 0.10) +
    (avg_creativity * 0.05)
  );

  -- Aplica penalidade por tentativas (max 2.5 = 5%)
  penalty := LEAST((attempt_num - 1) * 0.5, 2.5);
  final_score := GREATEST(weighted_score - penalty, 0);

  RETURN ROUND(final_score, 2);
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar score quando avaliação é inserida
CREATE OR REPLACE FUNCTION update_submission_score()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE submissions
  SET 
    score_final = calculate_submission_score(NEW.submission_id),
    status = 'evaluated',
    evaluated_at = NOW()
  WHERE id = NEW.submission_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_score
AFTER INSERT ON evaluations
FOR EACH ROW
EXECUTE FUNCTION update_submission_score();

-- Function para calcular número de tentativa do usuário
CREATE OR REPLACE FUNCTION get_user_attempt_number(
  p_challenge_id UUID,
  p_user_id UUID
)
RETURNS INTEGER AS $$
DECLARE
  attempt_count INTEGER;
BEGIN
  SELECT COALESCE(MAX(attempt_number), 0) + 1
  INTO attempt_count
  FROM submissions
  WHERE challenge_id = p_challenge_id AND user_id = p_user_id;
  
  RETURN attempt_count;
END;
$$ LANGUAGE plpgsql;

-- Dados seed para desenvolvimento
INSERT INTO locations (name, address, city, active) VALUES
  ('Bar do Zé', 'Rua das Flores, 123', 'São Paulo', true),
  ('Boteco da Esquina', 'Av. Principal, 456', 'Rio de Janeiro', true),
  ('Pub Central', 'Rua do Centro, 789', 'Belo Horizonte', true);

COMMENT ON TABLE users IS 'Usuários da plataforma (extends auth.users)';
COMMENT ON TABLE locations IS 'Locais físicos onde acontecem os desafios';
COMMENT ON TABLE challenges IS 'Desafios criativos com prêmios';
COMMENT ON TABLE submissions IS 'Participações dos usuários nos desafios';
COMMENT ON TABLE judges IS 'Jurados que avaliam as submissões';
COMMENT ON TABLE evaluations IS 'Avaliações dos jurados para cada submissão';
