// supabase/functions/criar-utilizador/index.ts
// Edge Function: Criação de utilizadores sem perder a sessão do Admin.
// Usa a SERVICE_ROLE_KEY (super-admin) para criar contas via Admin API.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Responder ao preflight OPTIONS (necessário para CORS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Verificar que o chamador é um utilizador autenticado
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Não autorizado.' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. Criar cliente com SERVICE ROLE KEY (tem poderes de super-admin)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // 3. Verificar que o chamador tem role de 'admin' (segurança extra)
    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user } } = await supabaseUser.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Sessão inválida.' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verificar o perfil do chamador
    const { data: callerProfile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!callerProfile || callerProfile.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Apenas o Admin pode criar utilizadores.' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 4. Obter dados do corpo do pedido
    const { email, password, nome, role, escola_id } = await req.json();

    if (!email || !password || !role) {
      return new Response(JSON.stringify({ error: 'Email, password e role são obrigatórios.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 5. Criar o utilizador via Admin API (não afeta a sessão do frontend!)
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Confirmar o email automaticamente (sem precisar de verificação)
      user_metadata: { full_name: nome },
    });

    if (createError) throw createError;

    // 6. Atualizar o perfil com role, nome e escola_id
    // (O trigger on_auth_user_created já criou o registo base)
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({
        nome: nome,
        role: role,
        escola_id: escola_id || null,
      })
      .eq('id', newUser.user.id);

    if (profileError) {
      // Se o trigger ainda não criou o profile, inserir manualmente
      await supabaseAdmin.from('profiles').insert({
        id: newUser.user.id,
        email: email,
        nome: nome,
        role: role,
        escola_id: escola_id || null,
      });
    }

    return new Response(JSON.stringify({ success: true, user_id: newUser.user.id }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
