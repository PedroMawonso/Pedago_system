import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Users, BookOpen, UsersRound, Library, TrendingUp, Award } from 'lucide-react';
import { twMerge as cn } from 'tailwind-merge';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4">
      <div className={cn('p-3 rounded-xl', color)}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value ?? '—'}</p>
      </div>
    </div>
  );
}

function Dashboard() {
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
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Visão geral do sistema académico</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total de Alunos" value={stats.alunos} color="bg-blue-500" />
        <StatCard icon={Award} label="Professores" value={stats.professores} color="bg-violet-500" />
        <StatCard icon={UsersRound} label="Turmas Activas" value={stats.turmas} color="bg-emerald-500" />
        <StatCard icon={BookOpen} label="Cursos" value={stats.cursos} color="bg-orange-500" />
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp size={18} className="text-gray-400" />
          <h2 className="font-semibold text-gray-700">Bem-vindo ao Pedago System</h2>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed">
          Sistema de Gestão Pedagógica desenvolvido para facilitar o registo e acompanhamento académico.
          Use o menu lateral para navegar entre os módulos disponíveis para o seu perfil.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
