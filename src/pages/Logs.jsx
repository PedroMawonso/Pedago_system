import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ScrollText, Search, Clock, RefreshCw } from 'lucide-react';

function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar logs:', error);
    } else {
      setLogs(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchLogs();
    setRefreshing(false);
  };

  const filteredLogs = logs.filter(log =>
    log.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
            <ScrollText className="text-gray-700 dark:text-slate-400" size={24} />
            Auditoria & Logs do Sistema
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Registo de atividades de segurança e gestão da plataforma</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center space-x-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-slate-300 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition cursor-pointer disabled:opacity-50"
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          <span>{refreshing ? 'A atualizar...' : 'Atualizar'}</span>
        </button>
      </div>

      <div className="flex items-center bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl px-4 py-2.5 shadow-sm max-w-md">
        <Search size={18} className="text-gray-400 dark:text-slate-500 mr-2" />
        <input
          type="text"
          placeholder="Pesquisar por utilizador, ação ou descrição..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-sm bg-transparent focus:outline-none text-gray-700 dark:text-slate-200"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-gray-200 dark:border-slate-800 border-t-gray-900 dark:border-t-slate-400 rounded-full animate-spin" />
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-16 text-center shadow-sm">
          <ScrollText size={40} className="mx-auto text-gray-300 dark:text-slate-600 mb-3" />
          <p className="text-gray-500 dark:text-slate-400 font-medium">Nenhum registo de auditoria encontrado</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-800/40 border-b border-gray-100 dark:border-slate-800 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Data & Hora</th>
                  <th className="px-6 py-4">Utilizador</th>
                  <th className="px-6 py-4">Ação</th>
                  <th className="px-6 py-4">Descrição</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-sm text-gray-700 dark:text-slate-300">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Clock size={14} />
                      {new Date(log.created_at).toLocaleString('pt-PT')}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-slate-100">{log.user_email || 'Sistema'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${
                        log.action.includes('CREATE') || log.action.includes('ADD') ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50' :
                        log.action.includes('DELETE') || log.action.includes('REMOVE') ? 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 border border-red-100 dark:border-red-900/50' :
                        'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">{log.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Logs;
