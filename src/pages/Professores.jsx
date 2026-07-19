import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import {
  Users, Search, Trash2, KeyRound, Copy, Plus, X,
  GraduationCap, BookUser, AlertCircle, CheckCircle2, XCircle
} from 'lucide-react';

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition cursor-pointer">
            <X size={18} className="text-gray-500" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

const roleLabels = {
  professor: 'Professor', admin: 'Admin',
  secretaria: 'Secretaria', direcao: 'Direção', pedagogia: 'Pedagogia'
};
const roleColors = {
  professor: 'bg-gray-100 text-gray-700',
  admin: 'bg-purple-100 text-purple-700',
  secretaria: 'bg-blue-100 text-blue-700',
  direcao: 'bg-green-100 text-green-700',
  pedagogia: 'bg-orange-100 text-orange-700',
};

const rolePrefix = { professor: 'PROF', secretaria: 'SEC' };
const roleIcon = {
  professor: GraduationCap,
  secretaria: BookUser,
};
const roleConviteLabel = { professor: 'Professor', secretaria: 'Secretaria' };
const roleConviteColor = {
  professor: 'bg-gray-100 text-gray-800 border-gray-200',
  secretaria: 'bg-blue-50 text-blue-800 border-blue-200',
};

function Professores() {
  const { profile } = useAuth();
  const [professores, setProfessores] = useState([]);
  const [escolas, setEscolas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Convites state
  const [convites, setConvites] = useState([]);
  const [loadingConvites, setLoadingConvites] = useState(false);
  const [selectedRole, setSelectedRole] = useState('professor');
  const [generatingCode, setGeneratingCode] = useState(false);

  // Manual Creation State
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ email: '', nome: '', role: 'professor', password: '', escola_id: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Warn if escola_id is missing
  const hasNoSchool = profile && profile.role !== 'admin' && !profile.escola_id;

  useEffect(() => {
    if (profile) {
      fetchProfessores();
      if (profile.role === 'admin') fetchEscolas();
      if (canManageInvites) fetchConvites();
    }
  }, [profile]);

  const canManageInvites = profile && ['pedagogia', 'direcao'].includes(profile.role);

  const fetchProfessores = async () => {
    setLoading(true);
    let query = supabase.from('profiles').select('*, escolas(nome)').order('nome');
    if (profile.role !== 'admin') query = query.eq('escola_id', profile.escola_id);
    const { data } = await query;
    setProfessores(data || []);
    setLoading(false);
  };

  const fetchEscolas = async () => {
    const { data } = await supabase.from('escolas').select('id, nome').order('nome');
    setEscolas(data || []);
  };

  const fetchConvites = async () => {
    if (!profile.escola_id) return;
    setLoadingConvites(true);
    const { data } = await supabase
      .from('convites')
      .select('*')
      .eq('escola_id', profile.escola_id)
      .eq('ativo', true)
      .order('created_at', { ascending: false });
    setConvites(data || []);
    setLoadingConvites(false);
  };

  const generateCode = async () => {
    if (!profile.escola_id) return;
    setGeneratingCode(true);
    const prefix = rolePrefix[selectedRole] || 'INV';
    const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const newCode = `${prefix}-${suffix}`;

    const { error } = await supabase.from('convites').insert({
      codigo: newCode,
      escola_id: profile.escola_id,
      role_destino: selectedRole,
      ativo: true,
    });

    if (error) alert('Erro ao gerar código: ' + error.message);
    else await fetchConvites();
    setGeneratingCode(false);
  };

  const disableCode = async (id) => {
    if (!confirm('Desativar este código? Novos utilizadores não poderão mais usá-lo.')) return;
    await supabase.from('convites').update({ ativo: false }).eq('id', id);
    fetchConvites();
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert('Código copiado!');
  };

  const openCreate = () => {
    setForm({ email: '', nome: '', role: profile.role === 'admin' ? 'pedagogia' : 'professor', password: '', escola_id: '' });
    setError(null);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (profile.role === 'admin' && form.role !== 'admin' && !form.escola_id) {
      setError('Por favor, selecione uma escola para este utilizador.');
      return;
    }
    setSaving(true);
    setError(null);

    try {
      // Obter o token de sessão atual para passar à Edge Function
      const { data: { session } } = await supabase.auth.getSession();

      const escolaIdFinal = profile.role === 'admin'
        ? (form.role === 'admin' ? null : form.escola_id)
        : profile.escola_id;

      // Chamar a Edge Function — não afeta a sessão do Admin!
      const { data, error: fnError } = await supabase.functions.invoke('criar-utilizador', {
        body: {
          email: form.email,
          password: form.password,
          nome: form.nome,
          role: form.role,
          escola_id: escolaIdFinal,
        },
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      setShowModal(false);
      setForm({ email: '', nome: '', role: 'professor', password: '', escola_id: '' });
      await fetchProfessores();
    } catch (err) {
      setError(err.message || 'Erro ao criar utilizador.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem a certeza? Esta ação remove o utilizador completamente do sistema.')) return;
    const { error } = await supabase.rpc('apagar_utilizador', { user_id: id });
    if (error) alert('Não foi possível apagar o utilizador: ' + error.message);
    else fetchProfessores();
  };

  const filtered = professores.filter(p =>
    (p.nome || p.email || '').toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Utilizadores</h1>
          <p className="text-sm text-gray-500 mt-1">Gestão de acessos ao sistema</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-700 transition cursor-pointer">
          <Plus size={16} /><span>Criar Utilizador Manualmente</span>
        </button>
      </div>

      {/* Aviso: conta sem escola vinculada */}
      {hasNoSchool && (
        <div className="flex items-start space-x-3 bg-red-50 border border-red-200 rounded-2xl p-5">
          <AlertCircle size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-red-700">Conta sem escola vinculada!</p>
            <p className="text-sm text-red-600 mt-1">
              Esta conta ainda não foi associada a uma escola. Peça ao Administrador do sistema para vincular a sua conta à escola correta na página de Utilizadores (painel de Admin).
            </p>
          </div>
        </div>
      )}

      {/* Painel de Convites */}
      {canManageInvites && !hasNoSchool && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
          <div className="flex items-center space-x-2">
            <KeyRound size={20} className="text-purple-600" />
            <h2 className="text-lg font-bold text-gray-900">Convites de Acesso (Self-Service)</h2>
          </div>
          <p className="text-sm text-gray-500 -mt-2">
            Gere um código por cargo. O novo membro usa este código para criar a sua própria conta vinculada à escola.
          </p>

          {/* Gerador */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Gerar convite para:</span>
            <div className="flex items-center rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
              {['professor', 'secretaria'].map((role) => {
                const Icon = roleIcon[role];
                return (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium transition cursor-pointer ${selectedRole === role
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                    }`}>
                    <Icon size={15} />
                    <span>{roleConviteLabel[role]}</span>
                  </button>
                );
              })}
            </div>
            <button
              onClick={generateCode}
              disabled={generatingCode}
              className="bg-purple-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-purple-700 transition cursor-pointer disabled:opacity-50 whitespace-nowrap">
              {generatingCode ? 'A gerar...' : '+ Gerar Código'}
            </button>
          </div>

          {/* Lista de convites ativos */}
          {loadingConvites ? (
            <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin mx-auto" />
          ) : convites.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Códigos Ativos</p>
              {convites.map((c) => {
                const Icon = roleIcon[c.role_destino] || GraduationCap;
                return (
                  <div key={c.id}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border ${roleConviteColor[c.role_destino] || 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center space-x-3">
                      <Icon size={16} />
                      <span className="font-mono font-bold text-lg tracking-widest">{c.codigo}</span>
                      <span className="text-xs font-semibold opacity-60">→ {roleConviteLabel[c.role_destino]}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => copyCode(c.codigo)}
                        className="p-1.5 rounded-lg hover:bg-white/70 transition cursor-pointer" title="Copiar">
                        <Copy size={14} />
                      </button>
                      <button onClick={() => disableCode(c.id)}
                        className="p-1.5 rounded-lg hover:bg-white/70 transition cursor-pointer" title="Desativar">
                        <XCircle size={14} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                );
              })}
              <div className="flex items-center space-x-2 text-xs font-medium text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-100 mt-3">
                <span>💡</span>
                <span>Quando todos os membros estiverem cadastrados, desative os códigos por segurança.</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-sm text-gray-400">
              <CheckCircle2 size={24} className="mx-auto mb-2 text-gray-300" />
              Nenhum convite ativo. Gere um código acima para começar.
            </div>
          )}
        </div>
      )}

      {/* Pesquisa */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Pesquisar utilizadores..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white" />
      </div>

      {/* Tabela */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
          <Users size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">Nenhum utilizador encontrado</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nome</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Email</th>
                  {profile.role === 'admin' && (
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Escola</th>
                  )}
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Perfil</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-violet-100 text-violet-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {(p.nome || p.email || '?')[0].toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800">
                          {p.nome || <span className="text-gray-400 italic">Pendente</span>}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 hidden sm:table-cell">{p.email}</td>
                    {profile.role === 'admin' && (
                      <td className="px-6 py-4 text-gray-600">{p.escolas?.nome || <span className="text-red-400 text-xs">Sem escola</span>}</td>
                    )}
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${roleColors[p.role] || 'bg-gray-100 text-gray-700'}`}>
                        {roleLabels[p.role] || p.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer">
                          <Trash2 size={14} className="text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de criação manual */}
      {showModal && (
        <Modal title="Novo Utilizador (Manual)" onClose={() => setShowModal(false)}>
          <form onSubmit={handleSave} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">{error}</div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome Completo</label>
              <input type="text" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Nome do utilizador"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@escola.ao"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Senha Provisória *</label>
              <input type="password" required minLength={6} value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Mínimo 6 caracteres"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
            </div>
            <div className={`grid gap-4 ${profile.role === 'admin' && form.role !== 'admin' ? 'grid-cols-2' : 'grid-cols-1'}`}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Perfil *</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white">
                  {profile.role === 'admin' ? (
                    <>
                      <option value="pedagogia">Pedagogia</option>
                      <option value="direcao">Direção</option>
                      <option value="secretaria">Secretaria</option>
                      <option value="admin">Admin Global</option>
                    </>
                  ) : (
                    <>
                      <option value="professor">Professor</option>
                      <option value="secretaria">Secretaria</option>
                      <option value="pedagogia">Pedagogia</option>
                    </>
                  )}
                </select>
              </div>
              {profile.role === 'admin' && form.role !== 'admin' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Vincular à Escola *</label>
                  <select required value={form.escola_id} onChange={(e) => setForm({ ...form, escola_id: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white">
                    <option value="">Selecionar Escola...</option>
                    {escolas.map(escola => (
                      <option key={escola.id} value={escola.id}>{escola.nome}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div className="flex space-x-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition cursor-pointer">
                Cancelar
              </button>
              <button type="submit" disabled={saving}
                className="flex-1 bg-gray-900 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-gray-700 transition cursor-pointer disabled:opacity-50">
                {saving ? 'A criar...' : 'Criar Utilizador'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default Professores;
