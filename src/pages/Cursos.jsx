import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Pencil, Trash2, BookOpen, X } from 'lucide-react';
import { twMerge as cn } from 'tailwind-merge';

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 dark:border-slate-800/80 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-800/60">
          <h2 className="text-lg font-bold text-gray-800 dark:text-slate-100">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer text-gray-500 dark:text-slate-400">
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function Cursos() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nome: '', descricao: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchCursos = async () => {
    setLoading(true);
    const { data } = await supabase.from('cursos').select('*').order('nome');
    setCursos(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchCursos(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ nome: '', descricao: '' });
    setError(null);
    setShowModal(true);
  };

  const openEdit = (curso) => {
    setEditing(curso);
    setForm({ nome: curso.nome, descricao: curso.descricao || '' });
    setError(null);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    if (editing) {
      const { error } = await supabase.from('cursos').update(form).eq('id', editing.id);
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.from('cursos').insert(form);
      if (error) setError(error.message);
    }
    setSaving(false);
    if (!error) {
      setShowModal(false);
      fetchCursos();
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem a certeza que quer eliminar este curso?')) return;
    await supabase.from('cursos').delete().eq('id', id);
    fetchCursos();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Cursos</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Gerir os cursos disponíveis na instituição</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 px-4 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer">
          <Plus size={16} />
          <span>Novo Curso</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-gray-200 dark:border-slate-800 border-t-slate-900 dark:border-t-slate-400 rounded-full animate-spin" />
        </div>
      ) : cursos.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-16 text-center shadow-sm">
          <BookOpen size={40} className="mx-auto text-gray-300 dark:text-slate-600 mb-3" />
          <p className="text-gray-500 dark:text-slate-400 font-medium">Nenhum curso cadastrado</p>
          <p className="text-gray-400 dark:text-slate-500 text-sm mt-1">Clique em "Novo Curso" para começar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {cursos.map((curso) => (
            <div key={curso.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800/80 p-5 shadow-sm hover:shadow-md transition">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 bg-orange-50 dark:bg-orange-950/20 rounded-xl">
                  <BookOpen size={20} className="text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => openEdit(curso)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer text-gray-500 dark:text-slate-400">
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(curso.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer text-red-500 dark:text-red-400">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-slate-100">{curso.nome}</h3>
              {curso.descricao && (
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 line-clamp-2">{curso.descricao}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title={editing ? 'Editar Curso' : 'Novo Curso'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSave} className="space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg border border-red-100 dark:border-red-900/50">{error}</div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Nome do Curso *</label>
              <input
                type="text"
                required
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Ex: Informática"
                className="w-full border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 bg-white dark:bg-slate-950 text-gray-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Descrição</label>
              <textarea
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                placeholder="Breve descrição do curso..."
                rows={3}
                className="w-full border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 bg-white dark:bg-slate-950 text-gray-800 dark:text-slate-200 resize-none"
              />
            </div>
            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-slate-300 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition cursor-pointer">
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer disabled:opacity-50">
                {saving ? 'A guardar...' : 'Guardar'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default Cursos;
