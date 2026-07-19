import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Pencil, Trash2, BookOpen, X } from 'lucide-react';
import { twMerge as cn } from 'tailwind-merge';

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cursos</h1>
          <p className="text-sm text-gray-500 mt-1">Gerir os cursos disponíveis na instituição</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-700 transition cursor-pointer">
          <Plus size={16} />
          <span>Novo Curso</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
        </div>
      ) : cursos.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <BookOpen size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">Nenhum curso cadastrado</p>
          <p className="text-gray-400 text-sm mt-1">Clique em "Novo Curso" para começar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {cursos.map((curso) => (
            <div key={curso.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 bg-orange-50 rounded-xl">
                  <BookOpen size={20} className="text-orange-500" />
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => openEdit(curso)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                    <Pencil size={14} className="text-gray-500" />
                  </button>
                  <button
                    onClick={() => handleDelete(curso.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer">
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-gray-800">{curso.nome}</h3>
              {curso.descricao && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{curso.descricao}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title={editing ? 'Editar Curso' : 'Novo Curso'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSave} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">{error}</div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome do Curso *</label>
              <input
                type="text"
                required
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Ex: Informática"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Descrição</label>
              <textarea
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                placeholder="Breve descrição do curso..."
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
              />
            </div>
            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition cursor-pointer">
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
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

export default Cursos;
