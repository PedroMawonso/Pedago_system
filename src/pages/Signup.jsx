import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import logo from '../assets/graduacao.png';
import { GraduationCap, BookUser } from 'lucide-react';

// Labels baseadas no role_destino do convite
const roleInfo = {
  professor: {
    Icon: GraduationCap,
    label: 'Professor',
    badge: 'bg-gray-100 text-gray-800',
  },
  secretaria: {
    Icon: BookUser,
    label: 'Secretaria',
    badge: 'bg-blue-100 text-blue-800',
  },
};

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: '', email: '', password: '', codigoConvite: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conviteValido, setConviteValido] = useState(null); // { escolaNome, role }
  const [validatingCode, setValidatingCode] = useState(false);

  // Valida o código assim que o campo perde o foco ou o utilizador pausa
  const validateCode = async (code) => {
    if (code.length < 5) { setConviteValido(null); return; }
    setValidatingCode(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('convites')
      .select('id, escola_id, role_destino, escolas(nome)')
      .eq('codigo', code)
      .eq('ativo', true)
      .single();

    if (err || !data) {
      setConviteValido(null);
      if (code.length >= 8) setError('Código inválido ou inativo. Verifique e tente novamente.');
    } else {
      setConviteValido({ escolaNome: data.escolas?.nome, role: data.role_destino, escola_id: data.escola_id, convite_id: data.id });
      setError(null);
    }
    setValidatingCode(false);
  };

  const handleCodeChange = (val) => {
    const upper = val.toUpperCase();
    setForm({ ...form, codigoConvite: upper });
    if (upper.length === 0) { setConviteValido(null); setError(null); }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!conviteValido) { setError('Por favor, insira um código de convite válido.'); return; }
    setLoading(true);
    setError(null);

    try {
      // 1. Re-validar o código (double-check)
      const { data: convite, error: conviteErr } = await supabase
        .from('convites')
        .select('id, escola_id, role_destino')
        .eq('codigo', form.codigoConvite)
        .eq('ativo', true)
        .single();

      if (conviteErr || !convite) throw new Error('Código de convite inválido ou inativo.');

      // 2. Criar a conta no Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { full_name: form.nome } },
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('Falha ao criar o utilizador. Tente novamente.');

      // 3. Aguarda o trigger criar o profile
      await new Promise(resolve => setTimeout(resolve, 1200));

      // 4. Atualiza o perfil com o cargo e escola provenientes do convite
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          nome: form.nome,
          role: convite.role_destino,
          escola_id: convite.escola_id,
        })
        .eq('id', authData.user.id);

      if (profileError) console.error('Erro ao atualizar perfil:', profileError);

      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const info = conviteValido ? roleInfo[conviteValido.role] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header colorido */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-700 px-8 pt-8 pb-10 text-center">
            <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4">
              <img src={logo} alt="Logo" className="w-14 h-14" />
            </div>
            <h1 className="text-white text-2xl font-bold">Portal de Acesso</h1>
            <p className="text-gray-400 text-sm mt-1">Crie a sua conta com o código de convite da escola</p>
          </div>

          <div className="px-8 py-8 space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100 text-center font-medium">
                {error}
              </div>
            )}

            {/* Preview do convite quando válido */}
            {conviteValido && info && (
              <div className="flex items-center space-x-3 bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="w-9 h-9 bg-green-100 text-green-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <info.Icon size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-green-800">{conviteValido.escolaNome}</p>
                  <p className="text-xs text-green-600">Cargo: <span className="font-semibold">{info.label}</span></p>
                </div>
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Código de Convite
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={form.codigoConvite}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    onBlur={() => validateCode(form.codigoConvite)}
                    className={`w-full px-4 py-3 rounded-xl border text-sm font-mono tracking-widest transition-all focus:outline-none ${
                      conviteValido
                        ? 'border-green-400 bg-green-50 focus:ring-2 focus:ring-green-300'
                        : 'border-gray-200 bg-gray-50 focus:ring-2 focus:ring-gray-900 focus:bg-white'
                    }`}
                    placeholder="Ex: PROF-A2B3 ou SEC-X9Y8"
                  />
                  {validatingCode && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nome Completo</label>
                <input type="text" required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm transition-all"
                  placeholder="O seu nome completo" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm transition-all"
                  placeholder="o.seu@email.com" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Senha</label>
                <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm transition-all"
                  placeholder="Crie uma senha forte" />
              </div>

              <button type="submit" disabled={loading || !conviteValido}
                className="w-full bg-gray-900 text-white font-semibold py-3.5 rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 cursor-pointer mt-2">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {info ? <info.Icon size={18} /> : <GraduationCap size={18} />}
                    <span>Criar Conta</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2">
              <p className="text-sm text-gray-500">
                Já tem uma conta?{' '}
                <Link to="/" className="text-gray-900 font-bold hover:underline">Fazer Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
