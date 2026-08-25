-- ── TABELA DE LOGS DE AUDITORIA ──
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  user_email  text,
  action      text NOT NULL,
  description text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Ativar RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Excluir políticas antigas se existirem
DROP POLICY IF EXISTS "Audit logs: leitura apenas para admin" ON public.audit_logs;
DROP POLICY IF EXISTS "Audit logs: inserção por qualquer autenticado" ON public.audit_logs;

-- Políticas de RLS
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

-- Ativar RLS
ALTER TABLE public.configuracoes_sistema ENABLE ROW LEVEL SECURITY;

-- Excluir políticas antigas se existirem
DROP POLICY IF EXISTS "Configurações: leitura para todos" ON public.configuracoes_sistema;
DROP POLICY IF EXISTS "Configurações: escrita apenas para admin" ON public.configuracoes_sistema;

-- Políticas de RLS
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
