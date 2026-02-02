-- ============================================
-- SETUP COMPLETO DO SUPABASE PARA MANDABEM
-- ============================================
-- Execute este arquivo no Supabase SQL Editor
-- (Dashboard > SQL Editor > New Query > Cole e Execute)

-- 1. Criar tabela de perfis
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  cpf TEXT UNIQUE,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Habilitar RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Policies de segurança
-- Usuários podem ver próprio perfil
CREATE POLICY "Usuários podem ver próprio perfil" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
  
-- Usuários podem atualizar próprio perfil
CREATE POLICY "Usuários podem atualizar próprio perfil" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Inserir perfil no cadastro
CREATE POLICY "Inserir perfil no cadastro" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 4. Criar função para criar perfil automaticamente após signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, cpf)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'cpf'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Criar trigger para executar a função
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Verificar se as tabelas existem
SELECT 
  'profiles' as tabela,
  COUNT(*) as registros
FROM public.profiles
UNION ALL
SELECT 
  'users' as tabela,
  COUNT(*) as registros
FROM public.users
UNION ALL
SELECT 
  'challenges' as tabela,
  COUNT(*) as registros
FROM public.challenges
UNION ALL
SELECT 
  'submissions' as tabela,
  COUNT(*) as registros
FROM public.submissions;

-- ============================================
-- PRONTO! Agora você pode:
-- 1. Criar contas na plataforma
-- 2. Fazer login
-- 3. Ver perfil em /meus-envios
-- ============================================
