import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Pencil, Trash2, UsersRound, X } from 'lucide-react';

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

const currentYear = new Date().getFullYear();

function Turmas() {
  const [turmas, setTurmas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nome: '', curso_id: '', classe_id: '', ano_letivo: currentYear });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    const [{ data: turmasData }, { data: cursosData }, { data: classesData }] = await Promise.all([
      supabase.from('turmas').select('*, cursos(nome), classes(nome)').order('nome'),
      supabase.from('cursos').select('id, nome').order('nome'),
      supabase.from('classes').select('id, nome').order('nome'),
    ]);
    setTurmas(turmasData || []);
    setCursos(cursosData || []);
    setClasses(classesData || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ nome: '', curso_id: '', classe_id: '', ano_letivo: currentYear });
    setError(null);
    setShowModal(true);
  };

  const openEdit = (t) => {
    setEditing(t);
    setForm({ nome: t.nome, curso_id: t.curso_id, classe_id: t.classe_id, ano_letivo: t.ano_letivo });
    setError(null);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    if (editing) {
      const { error } = await supabase.from('turmas').update(form).eq('id', editing.id);
      if (error) { setError(error.message); setSaving(false); return; }
    } else {
      const { error } = await supabase.from('turmas').insert(form);
      if (error) { setError(error.message); setSaving(false); return; }
    }
    setSaving(false);
    setShowModal(false);
    fetchAll();
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem a certeza que quer eliminar esta turma?')) return;
    await supabase.from('turmas').delete().eq('id', id);
    fetchAll();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Turmas</h1>
          <p className="text-sm text-gray-500 mt-1">Organizar as turmas por classe e curso</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-700 transition cursor-pointer">
          <Plus size={16} /><span>Nova Turma</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
        </div>
      ) : turmas.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <UsersRound size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">Nenhuma turma criada</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {turmas.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 bg-emerald-50 rounded-xl">
                  <UsersRound size={20} className="text-emerald-500" />
                </div>
                <div className="flex space-x-1">
                  <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                    <Pencil size={14} className="text-gray-500" />
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer">
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-gray-800">{t.nome}</h3>
              <p className="text-sm text-gray-500 mt-1">{t.classes?.nome} • {t.cursos?.nome}</p>
              <span className="inline-block mt-2 text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                Ano Letivo {t.ano_letivo}
              </span>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title={editing ? 'Editar Turma' : 'Nova Turma'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSave} className="space-y-4">
            {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">{error}</div>}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome da Turma *</label>
              <input type="text" required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Ex: Turma A"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Classe *</label>
              <select required value={form.classe_id} onChange={(e) => setForm({ ...form, classe_id: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white">
                <option value="">Selecionar classe</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Curso *</label>
              <select required value={form.curso_id} onChange={(e) => setForm({ ...form, curso_id: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white">
                <option value="">Selecionar curso</option>
                {cursos.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Ano Letivo *</label>
              <input type="number" required value={form.ano_letivo} onChange={(e) => setForm({ ...form, ano_letivo: parseInt(e.target.value) })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
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

export default Turmas;
