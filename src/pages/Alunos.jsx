import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Pencil, Trash2, CircleUser, X, Search } from 'lucide-react';
import { twMerge as cn } from 'tailwind-merge';

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

const defaultForm = {
  nome_completo: '',
  data_nascimento: '',
  turma_id: '',
};

function Alunos() {
  const [alunos, setAlunos] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const fetchAll = async () => {
    setLoading(true);
    const [{ data: alunosData }, { data: turmasData }] = await Promise.all([
      supabase
        .from('alunos')
        .select('*, turmas(nome, classes(nome), cursos(nome))')
        .order('nome_completo'),
      supabase
        .from('turmas')
        .select('id, nome, classes(nome), cursos(nome)')
        .order('nome'),
    ]);
    setAlunos(alunosData || []);
    setTurmas(turmasData || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setError(null);
    setShowModal(true);
  };

  const openEdit = (aluno) => {
    setEditing(aluno);
    setForm({
      nome_completo: aluno.nome_completo,
      data_nascimento: aluno.data_nascimento || '',
      turma_id: aluno.turma_id || '',
    });
    setError(null);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = { ...form, turma_id: form.turma_id || null, data_nascimento: form.data_nascimento || null };
    if (editing) {
      const { error } = await supabase.from('alunos').update(payload).eq('id', editing.id);
      if (error) { setError(error.message); setSaving(false); return; }
    } else {
      const { error } = await supabase.from('alunos').insert(payload);
      if (error) { setError(error.message); setSaving(false); return; }
    }
    setSaving(false);
    setShowModal(false);
    fetchAll();
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem a certeza que quer eliminar este aluno?')) return;
    await supabase.from('alunos').delete().eq('id', id);
    fetchAll();
  };

  const filtered = alunos.filter(a =>
    a.nome_completo.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alunos</h1>
          <p className="text-sm text-gray-500 mt-1">Gerir os alunos matriculados</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-700 transition cursor-pointer">
          <Plus size={16} />
          <span>Novo Aluno</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Pesquisar aluno..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <CircleUser size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">Nenhum aluno encontrado</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nome</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Turma</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Data de Nascimento</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((aluno) => (
                <tr key={aluno.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {aluno.nome_completo.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                      <span className="font-medium text-gray-800">{aluno.nome_completo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 hidden sm:table-cell">
                    {aluno.turmas
                      ? `${aluno.turmas.classes?.nome || ''} - ${aluno.turmas.nome}`
                      : <span className="text-gray-300 italic">Sem turma</span>}
                  </td>
                  <td className="px-6 py-4 text-gray-500 hidden md:table-cell">
                    {aluno.data_nascimento
                      ? new Date(aluno.data_nascimento).toLocaleDateString('pt-AO')
                      : <span className="text-gray-300 italic">—</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end space-x-1">
                      <button onClick={() => openEdit(aluno)} className="p-1.5 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                        <Pencil size={14} className="text-gray-500" />
                      </button>
                      <button onClick={() => handleDelete(aluno.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer">
                        <Trash2 size={14} className="text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <Modal title={editing ? 'Editar Aluno' : 'Novo Aluno'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSave} className="space-y-4">
            {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">{error}</div>}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome Completo *</label>
              <input
                type="text" required value={form.nome_completo}
                onChange={(e) => setForm({ ...form, nome_completo: e.target.value })}
                placeholder="Nome completo do aluno"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Data de Nascimento</label>
              <input
                type="date" value={form.data_nascimento}
                onChange={(e) => setForm({ ...form, data_nascimento: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Turma</label>
              <select
                value={form.turma_id}
                onChange={(e) => setForm({ ...form, turma_id: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white">
                <option value="">Sem turma atribuída</option>
                {turmas.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.classes?.nome} - {t.nome} ({t.cursos?.nome})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex space-x-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition cursor-pointer">
                Cancelar
              </button>
              <button type="submit" disabled={saving}
                className="flex-1 bg-gray-900 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-gray-700 transition cursor-pointer disabled:opacity-50">
                {saving ? 'A guardar...' : 'Guardar'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default Alunos;
