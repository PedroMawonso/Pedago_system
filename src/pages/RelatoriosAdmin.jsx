import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { BarChart3, Building2, Users, GraduationCap, TrendingUp, Activity } from 'lucide-react';

function RelatoriosAdmin() {
  const [stats, setStats] = useState({
    totalEscolas: 0,
    totalUtilizadores: 0,
    totalAlunos: 0,
    escolasDetalhes: [],
    utilizadoresPorRole: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);

    const [
      { count: totalEscolas },
      { count: totalUtilizadores },
      { count: totalAlunos },
      { data: escolasData },
      { data: profilesData },
    ] = await Promise.all([
      supabase.from('escolas').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('alunos').select('*', { count: 'exact', head: true }),
      supabase.from('escolas').select('id, nome'),
      supabase.from('profiles').select('role'),
    ]);

    // Contar alunos por escola
    const escolasDetalhes = [];
    if (escolasData) {
      for (const escola of escolasData) {
        const { count } = await supabase
          .from('alunos')
          .select('*', { count: 'exact', head: true })
          .eq('escola_id', escola.id);
        escolasDetalhes.push({ nome: escola.nome, alunos: count || 0 });
      }
      escolasDetalhes.sort((a, b) => b.alunos - a.alunos);
    }

    // Contar utilizadores por role
    const roleCounts = {};
    (profilesData || []).forEach(p => {
      roleCounts[p.role] = (roleCounts[p.role] || 0) + 1;
    });
    const utilizadoresPorRole = Object.entries(roleCounts)
      .map(([role, count]) => ({ role, count }))
      .sort((a, b) => b.count - a.count);

    setStats({
      totalEscolas: totalEscolas || 0,
      totalUtilizadores: totalUtilizadores || 0,
      totalAlunos: totalAlunos || 0,
      escolasDetalhes,
      utilizadoresPorRole,
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const roleLabels = {
    admin: 'Administrador',
    professor: 'Professor',
    secretaria: 'Secretaria',
    direcao: 'Direção',
    pedagogia: 'Pedagogia',
  };

  const roleColors = {
    admin: 'bg-purple-500 dark:bg-purple-600',
    professor: 'bg-slate-500 dark:bg-slate-600',
    secretaria: 'bg-blue-500 dark:bg-blue-600',
    direcao: 'bg-emerald-500 dark:bg-emerald-600',
    pedagogia: 'bg-orange-500 dark:bg-orange-600',
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-4 border-gray-200 dark:border-slate-800 border-t-gray-900 dark:border-t-slate-400 rounded-full animate-spin" />
      </div>
    );
  }

  const maxAlunos = Math.max(1, ...stats.escolasDetalhes.map(e => e.alunos));
  const maxRole = Math.max(1, ...stats.utilizadoresPorRole.map(u => u.count));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
          <BarChart3 className="text-gray-700 dark:text-slate-400" size={24} />
          Relatórios da Plataforma
        </h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Estatísticas e crescimento global do Pedago System</p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/20 rounded-xl">
              <Building2 size={20} className="text-indigo-500 dark:text-indigo-400" />
            </div>
            <TrendingUp size={16} className="text-emerald-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-slate-100">{stats.totalEscolas}</p>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Escolas Ativas</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/20 rounded-xl">
              <Users size={20} className="text-blue-500 dark:text-blue-400" />
            </div>
            <Activity size={16} className="text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-slate-100">{stats.totalUtilizadores}</p>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Utilizadores Registados</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl">
              <GraduationCap size={20} className="text-emerald-500 dark:text-emerald-400" />
            </div>
            <TrendingUp size={16} className="text-emerald-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-slate-100">{stats.totalAlunos}</p>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Alunos Matriculados</p>
        </div>
      </div>

      {/* Gráfico: Alunos por Escola */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 dark:text-slate-200 mb-4">Alunos por Escola</h2>
        {stats.escolasDetalhes.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">Nenhuma escola registada ainda.</p>
        ) : (
          <div className="space-y-3">
            {stats.escolasDetalhes.map((escola, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700 dark:text-slate-300 w-40 truncate">{escola.nome}</span>
                <div className="flex-1 bg-gray-100 dark:bg-slate-800 rounded-full h-6 overflow-hidden">
                  <div
                    className="bg-indigo-500 dark:bg-indigo-600 h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                    style={{ width: `${Math.max(8, (escola.alunos / maxAlunos) * 100)}%` }}
                  >
                    <span className="text-xs font-bold text-white">{escola.alunos}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gráfico: Utilizadores por Cargo */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 dark:text-slate-200 mb-4">Utilizadores por Cargo</h2>
        {stats.utilizadoresPorRole.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">Nenhum utilizador registado ainda.</p>
        ) : (
          <div className="space-y-3">
            {stats.utilizadoresPorRole.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700 dark:text-slate-300 w-32 truncate">
                  {roleLabels[item.role] || item.role}
                </span>
                <div className="flex-1 bg-gray-100 dark:bg-slate-800 rounded-full h-6 overflow-hidden">
                  <div
                    className={`${roleColors[item.role] || 'bg-slate-500'} h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500`}
                    style={{ width: `${Math.max(8, (item.count / maxRole) * 100)}%` }}
                  >
                    <span className="text-xs font-bold text-white">{item.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RelatoriosAdmin;
