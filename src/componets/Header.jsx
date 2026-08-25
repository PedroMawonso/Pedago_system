import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { twMerge as cn } from 'tailwind-merge';
import { useAuth } from '../lib/AuthContext';

const roleLabels = {
  admin: 'Administrador Global',
  secretaria: 'Secretaria',
  direcao: 'Direção',
  pedagogia: 'Pedagogia',
  professor: 'Professor',
};

const roleColors = {
  admin: 'bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400 border border-purple-100 dark:border-purple-900/50',
  secretaria: 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50',
  direcao: 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 border border-green-100 dark:border-green-900/50',
  pedagogia: 'bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400 border border-orange-100 dark:border-orange-900/50',
  professor: 'bg-slate-50 text-slate-700 dark:bg-slate-800/40 dark:text-slate-400 border border-slate-100 dark:border-slate-800',
};

function Header({ onMenuClick }) {
  const { profile } = useAuth();

  const initials = profile?.nome
    ? profile.nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : profile?.email?.[0]?.toUpperCase() ?? '?';

  return (
    <div className="fixed top-0 left-0 right-0 z-10 lg:left-72">
      <header className={cn(
        'flex items-center justify-between',
        'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md',
        'border-b border-gray-100 dark:border-slate-900',
        'px-4 py-3 lg:px-8',
        'transition-colors duration-300'
      )}>
        <button
          className="block lg:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-900 cursor-pointer transition text-gray-600 dark:text-slate-400"
          onClick={onMenuClick}>
          <Menu size={20} />
        </button>

        <div className="hidden lg:block">
          <p className="text-xs text-gray-400 dark:text-slate-500">Bem-vindo de volta,</p>
          <p className="text-sm font-semibold text-gray-800 dark:text-slate-100 mt-0.5">
            {profile?.nome || profile?.email || 'Carregando...'}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-900 transition relative cursor-pointer text-gray-500 dark:text-slate-400">
            <Bell size={18} />
          </button>

          <div className="flex items-center space-x-2.5">
            {profile?.role && (
              <span className={cn(
                'hidden sm:block text-xs font-semibold px-2.5 py-1 rounded-full',
                roleColors[profile.role] || 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
              )}>
                {roleLabels[profile.role] || profile.role}
              </span>
            )}
            <div className="w-9 h-9 rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 flex items-center justify-center text-sm font-bold shadow-sm">
              {initials}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;
