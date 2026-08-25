-- ============================================================
-- PEDAGO SYSTEM — Schema Completo
-- Execute este script no SQL Editor do novo projeto Supabase
-- (Dashboard → SQL Editor → New query → colar → Run)
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. TABELAS BASE (sem dependências externas)
-- ────────────────────────────────────────────────────────────

-- Escolas
CREATE TABLE IF NOT EXISTS public.escolas (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome        text NOT NULL,
  endereco    text,
  nif         text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Cursos
CREATE TABLE IF NOT EXISTS public.cursos (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome        text NOT NULL,
  descricao   text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Classes (ex: 10ª, 11ª, 12ª)
CREATE TABLE IF NOT EXISTS public.classes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome        text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Disciplinas
CREATE TABLE IF NOT EXISTS public.disciplinas (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome        text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ────────────────────────────────────────────────────────────
-- 2. PROFILES (ligada a auth.users)
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       text,
  nome        text,
  -- Roles: admin | pedagogia | direcao | secretaria | professor
  role        text NOT NULL DEFAULT 'professor',
  escola_id   uuid REFERENCES public.escolas(id) ON DELETE SET NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ────────────────────────────────────────────────────────────
-- 3. TURMAS (ligada a cursos e classes)
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.turmas (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome        text NOT NULL,
  curso_id    uuid REFERENCES public.cursos(id) ON DELETE SET NULL,
  classe_id   uuid REFERENCES public.classes(id) ON DELETE SET NULL,
  ano_letivo  integer NOT NULL DEFAULT EXTRACT(YEAR FROM now())::integer,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ────────────────────────────────────────────────────────────
-- 4. ALUNOS (ligada a turmas)
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.alunos (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_completo   text NOT NULL,
  data_nascimento date,
  turma_id        uuid REFERENCES public.turmas(id) ON DELETE SET NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- ────────────────────────────────────────────────────────────
-- 5. CONVITES (códigos de acesso por escola)
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.convites (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo       text NOT NULL UNIQUE,
  escola_id    uuid NOT NULL REFERENCES public.escolas(id) ON DELETE CASCADE,
  role_destino text NOT NULL, -- 'professor' | 'secretaria'
  ativo        boolean NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- ────────────────────────────────────────────────────────────
-- 6. TRIGGER — Criar profile automaticamente quando registo no Auth
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nome, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'professor'  -- role padrão; será atualizado pelo signup ou pela Edge Function
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Remover trigger antigo se existir, e recriar
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ────────────────────────────────────────────────────────────
-- 7. FUNÇÃO RPC — Apagar utilizador completamente
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.apagar_utilizador(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Apagar o perfil primeiro (cascata limpa o resto)
  DELETE FROM public.profiles WHERE id = user_id;
  -- Apagar do Auth (requer service_role; funciona dentro de SECURITY DEFINER)
  DELETE FROM auth.users WHERE id = user_id;
END;
$$;

-- ── FUNÇÕES AUXILIARES DE RLS ───────────────────────────────
-- Evitam a recursão infinita ao consultar a própria tabela profiles
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.get_my_escola()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT escola_id FROM public.profiles WHERE id = auth.uid();
$$;

-- ────────────────────────────────────────────────────────────
-- 8. ROW LEVEL SECURITY (RLS)
-- ────────────────────────────────────────────────────────────

-- Ativar RLS em todas as tabelas
ALTER TABLE public.escolas     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cursos      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.turmas      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disciplinas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alunos      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.convites    ENABLE ROW LEVEL SECURITY;

-- ── ESCOLAS ──────────────────────────────────────────────────
-- Qualquer utilizador autenticado pode ler escolas
CREATE POLICY "Escolas: leitura para autenticados"
  ON public.escolas FOR SELECT
  TO authenticated
  USING (true);

-- Apenas admins podem gerir escolas
CREATE POLICY "Escolas: gestão por admin"
  ON public.escolas FOR ALL
  TO authenticated
  USING (
    public.get_my_role() = 'admin'
  );

-- ── PROFILES ─────────────────────────────────────────────────
-- Cada utilizador lê o seu próprio perfil
CREATE POLICY "Profiles: utilizador lê o próprio"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Admins lêem todos os profiles
CREATE POLICY "Profiles: admin lê todos"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    public.get_my_role() = 'admin'
  );

-- Gestores da escola lêem profiles da mesma escola
CREATE POLICY "Profiles: gestores lêem da mesma escola"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    escola_id = public.get_my_escola()
  );

-- Utilizadores atualizam o próprio perfil
CREATE POLICY "Profiles: utilizador atualiza o próprio"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

-- Service role tem acesso total (Edge Functions usam service_role)
CREATE POLICY "Profiles: service role acesso total"
  ON public.profiles FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ── CURSOS, CLASSES, DISCIPLINAS ────────────────────────────
-- Autenticados lêem; admins e gestores escrevem
CREATE POLICY "Cursos: leitura para autenticados"
  ON public.cursos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Cursos: escrita para gestores"
  ON public.cursos FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid()
    AND role IN ('admin', 'pedagogia', 'direcao')
  ));

CREATE POLICY "Classes: leitura para autenticados"
  ON public.classes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Classes: escrita para gestores"
  ON public.classes FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid()
    AND role IN ('admin', 'pedagogia', 'direcao')
  ));

CREATE POLICY "Disciplinas: leitura para autenticados"
  ON public.disciplinas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Disciplinas: escrita para gestores"
  ON public.disciplinas FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid()
    AND role IN ('admin', 'pedagogia', 'direcao')
  ));

-- ── TURMAS ──────────────────────────────────────────────────
CREATE POLICY "Turmas: leitura para autenticados"
  ON public.turmas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Turmas: escrita para gestores"
  ON public.turmas FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid()
    AND role IN ('admin', 'pedagogia', 'direcao', 'secretaria')
  ));

-- ── ALUNOS ──────────────────────────────────────────────────
CREATE POLICY "Alunos: leitura para autenticados"
  ON public.alunos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Alunos: escrita para gestores"
  ON public.alunos FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid()
    AND role IN ('admin', 'pedagogia', 'direcao', 'secretaria')
  ));

-- ── CONVITES ─────────────────────────────────────────────────
-- Leitura pública (necessário para validar código no Signup sem login)
CREATE POLICY "Convites: leitura pública"
  ON public.convites FOR SELECT
  TO anon, authenticated
  USING (true);

-- Gestão apenas por pedagogia, direção e admin
CREATE POLICY "Convites: gestão por gestores"
  ON public.convites FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid()
    AND role IN ('admin', 'pedagogia', 'direcao')
  ));

-- ────────────────────────────────────────────────────────────
-- 9. CRIAR UTILIZADOR ADMIN INICIAL
-- (Substitui o email e a senha antes de executar!)
-- ────────────────────────────────────────────────────────────
-- ATENÇÃO: Executa esta parte SEPARADAMENTE, depois das tabelas estarem criadas.
-- Vai a Authentication → Users → "Add user" no dashboard do Supabase
-- e depois executa só o UPDATE abaixo com o UUID do utilizador criado:
--
-- UPDATE public.profiles
-- SET role = 'admin', nome = 'Administrador'
-- WHERE email = 'SEU_EMAIL_ADMIN_AQUI';

-- ────────────────────────────────────────────────────────────
-- 10. TABELAS DE PLATAFORMA (LOGS E CONFIGURAÇÕES)
-- ────────────────────────────────────────────────────────────

-- ── TABELA DE LOGS DE AUDITORIA ──
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  user_email  text,
  action      text NOT NULL,
  description text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Audit logs: leitura apenas para admin"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (public.get_my_role() = 'admin');

CREATE POLICY "Audit logs: inserção por qualquer autenticado"
  ON public.audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ── TABELA DE CONFIGURAÇÕES DO SISTEMA ──
CREATE TABLE IF NOT EXISTS public.configuracoes_sistema (
  chave       text PRIMARY KEY,
  valor       text NOT NULL,
  descricao   text,
  updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.configuracoes_sistema ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Configurações: leitura para todos"
  ON public.configuracoes_sistema FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Configurações: escrita apenas para admin"
  ON public.configuracoes_sistema FOR ALL
  TO authenticated
  USING (public.get_my_role() = 'admin');

-- Valores padrão iniciais
INSERT INTO public.configuracoes_sistema (chave, valor, descricao) VALUES
  ('ano_letivo_padrao', '2026', 'Ano letivo ativo por defeito no sistema'),
  ('permite_novos_registos', 'true', 'Se novas escolas podem auto-registar-se'),
  ('nome_sistema', 'Pedago System', 'Nome do sistema exibido no cabeçalho'),
  ('contacto_suporte', 'suporte@pedagosystem.com', 'Email de contacto de suporte global')
ON CONFLICT (chave) DO UPDATE SET
  valor = EXCLUDED.valor,
  descricao = EXCLUDED.descricao;

