import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Settings, Save, RefreshCw, CheckCircle2 } from 'lucide-react';

const configLabels = {
  ano_letivo_padrao: 'Ano Letivo Padrão',
  permite_novos_registos: 'Permitir Novos Registos de Escolas',
  nome_sistema: 'Nome do Sistema',
  contacto_suporte: 'Email de Suporte',
};

const configTypes = {
  permite_novos_registos: 'boolean',
};

function Configuracoes() {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editValues, setEditValues] = useState({});

  const fetchConfigs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('configuracoes_sistema')
      .select('*')
      .order('chave');

    if (error) {
      console.error('Erro ao buscar configurações:', error);
    } else {
      setConfigs(data || []);
      const values = {};
      (data || []).forEach(c => { values[c.chave] = c.valor; });
      setEditValues(values);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleChange = (chave, valor) => {
    setEditValues(prev => ({ ...prev, [chave]: valor }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    const updates = configs.map(c => 
      supabase
        .from('configuracoes_sistema')
        .update({ valor: editValues[c.chave], updated_at: new Date().toISOString() })
        .eq('chave', c.chave)
    );

    const results = await Promise.all(updates);
    const hasError = results.some(r => r.error);

    if (hasError) {
      console.error('Erro ao guardar configurações.');
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
            <Settings className="text-gray-700 dark:text-slate-400" size={24} />
            Definições Globais
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Configurações gerais da plataforma Pedago System</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-gray-200 dark:border-slate-800 border-t-gray-900 dark:border-t-slate-400 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100 dark:divide-slate-800">
            {configs.map((config) => (
              <div key={config.chave} className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-5 gap-3">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">
                    {configLabels[config.chave] || config.chave}
                  </p>
                  {config.descricao && (
                    <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{config.descricao}</p>
                  )}
                </div>
                <div className="w-full sm:w-72">
                  {configTypes[config.chave] === 'boolean' ? (
                    <button
                      onClick={() => handleChange(config.chave, editValues[config.chave] === 'true' ? 'false' : 'true')}
                      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors cursor-pointer ${
                        editValues[config.chave] === 'true' ? 'bg-emerald-500 dark:bg-emerald-600' : 'bg-gray-300 dark:bg-slate-700'
                      }`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                        editValues[config.chave] === 'true' ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  ) : (
                    <input
                      type="text"
                      value={editValues[config.chave] || ''}
                      onChange={(e) => handleChange(config.chave, e.target.value)}
                      className="w-full border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 bg-white dark:bg-slate-950 text-gray-800 dark:text-slate-200"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/20">
            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400 font-medium animate-fade-in">
                <CheckCircle2 size={16} />
                Guardado com sucesso!
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center space-x-2 bg-gray-900 dark:bg-slate-100 text-white dark:text-slate-900 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-700 dark:hover:bg-slate-200 transition cursor-pointer disabled:opacity-50"
            >
              {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
              <span>{saving ? 'A guardar...' : 'Guardar Alterações'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Configuracoes;
