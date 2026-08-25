import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import {
  Users, BookOpen, UsersRound, Library, TrendingUp, Award,
  Building2, GraduationCap, ScrollText, Activity, ArrowUpRight
} from 'lucide-react';
import { twMerge as cn } from 'tailwind-merge';
import { useNavigate } from 'react-router-dom';

const cardThemes = {
  indigo: {
    bg: 'bg-indigo-50 dark:bg-indigo-950/20',
    icon: 'text-indigo-600 dark:text-indigo-400',
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    icon: 'text-blue-600 dark:text-blue-400',
  },
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/20',
    icon: 'text-emerald-600 dark:text-emerald-400',
  },
  violet: {
    bg: 'bg-violet-50 dark:bg-violet-950/20',
    icon: 'text-violet-600 dark:text-violet-400',
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-950/20',
    icon: 'text-orange-600 dark:text-orange-400',
  },
};

function StatCard({ icon: Icon, label, value, theme = 'indigo', onClick }) {
  const t = cardThemes[theme] || cardThemes.indigo;
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-800/80 flex items-center space-x-4 transition duration-200',
        onClick && 'cursor-pointer hover:shadow-md hover:border-gray-200 dark:hover:border-slate-700/80'
      )}
    >
      <div className={cn('p-2.5 rounded-xl shrink-0', t.bg)}>
        <Icon size={20} className={t.icon} />
      </div>
      <div className="flex-grow min-w-0">
        <p className="text-xs font-medium text-gray-400 dark:text-slate-500 truncate">{label}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-slate-100 mt-0.5 truncate">{value ?? '—'}</p>
      </div>
      {onClick && <ArrowUpRight size={16} className="text-gray-300 dark:text-slate-600 shrink-0" />}
    </div>
  );
}

// ── Dashboard do Admin Global ──────────────────────────────
function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    escolas: null, utilizadores: null, alunos: null, logsRecentes: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [escolas, utilizadores, alunos, logs] = await Promise.all([
        supabase.from('escolas').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('alunos').select('*', { count: 'exact', head: true }),
        supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(5),
      ]);
      setStats({
        escolas: escolas.count,
        utilizadores: utilizadores.count,
        alunos: alunos.count,
        logsRecentes: logs.data || [],
      });
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Painel de Administração</h1>
        <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">Visão geral da plataforma Pedago System</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={Building2} label="Escolas Ativas" value={stats.escolas}
          theme="indigo" onClick={() => navigate('/escolas')}
        />
        <StatCard
          icon={Users} label="Utilizadores" value={stats.utilizadores}
          theme="blue" onClick={() => navigate('/professores')}
        />
        <StatCard
          icon={GraduationCap} label="Alunos na Plataforma" value={stats.alunos}
          theme="emerald"
        />
      </div>

      {/* Logs recentes */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-800/80">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Activity size={18} className="text-gray-400 dark:text-slate-500" />
            <h2 className="font-semibold text-gray-700 dark:text-slate-200">Atividade Recente</h2>
          </div>
          <button
            onClick={() => navigate('/logs')}
            className="text-sm text-gray-500 hover:text-gray-800 dark:text-slate-400 dark:hover:text-slate-200 transition cursor-pointer flex items-center gap-1"
          >
            Ver tudo <ArrowUpRight size={14} />
          </button>
        </div>
        {stats.logsRecentes.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-slate-500 text-center py-6">
            Nenhuma atividade registada. As ações realizadas na plataforma aparecerão aqui.
          </p>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-slate-800">
            {stats.logsRecentes.map((log) => (
              <div key={log.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-slate-200">{log.description}</p>
                  <p className="text-xs text-gray-400 dark:text-slate-500">{log.user_email}</p>
                </div>
                <span className="text-xs text-gray-400 dark:text-slate-500 whitespace-nowrap">
                  {new Date(log.created_at).toLocaleString('pt-PT')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Boas-vindas */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-800/80">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp size={18} className="text-gray-400 dark:text-slate-500" />
          <h2 className="font-semibold text-gray-700 dark:text-slate-200">Bem-vindo ao Pedago System</h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
          Está no painel de administração global. Utilize o menu lateral para gerir escolas, 
          utilizadores, visualizar relatórios e configurar as definições da plataforma.
        </p>
      </div>
    </div>
  );
}

// ── Dashboard Escolar (para outros cargos) ─────────────────
function EscolarDashboard() {
  const [stats, setStats] = useState({ alunos: null, professores: null, turmas: null, cursos: null });

  useEffect(() => {
    const fetchStats = async () => {
      const [alunos, professores, turmas, cursos] = await Promise.all([
        supabase.from('alunos').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'professor'),
        supabase.from('turmas').select('id', { count: 'exact', head: true }),
        supabase.from('cursos').select('id', { count: 'exact', head: true }),
      ]);
      setStats({
        alunos: alunos.count,
        professores: professores.count,
        turmas: turmas.count,
        cursos: cursos.count,
      });
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Dashboard</h1>
        <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">Visão geral do sistema académico</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total de Alunos" value={stats.alunos} theme="blue" />
        <StatCard icon={Award} label="Professores" value={stats.professores} theme="violet" />
        <StatCard icon={UsersRound} label="Turmas Activas" value={stats.turmas} theme="emerald" />
        <StatCard icon={BookOpen} label="Cursos" value={stats.cursos} theme="orange" />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-800/80">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp size={18} className="text-gray-400 dark:text-slate-500" />
          <h2 className="font-semibold text-gray-700 dark:text-slate-200">Bem-vindo ao Pedago System</h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
          Sistema de Gestão Pedagógica desenvolvido para facilitar o registo e acompanhamento académico.
          Use o menu lateral para navegar entre os módulos disponíveis para o seu perfil.
        </p>
      </div>
    </div>
  );
}

// ── Componente Principal ───────────────────────────────────
function Dashboard() {
  const { profile } = useAuth();

  if (profile?.role === 'admin') {
    return <AdminDashboard />;
  }

  return <EscolarDashboard />;
}

export default Dashboard;
