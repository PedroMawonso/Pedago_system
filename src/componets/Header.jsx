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
  admin: 'bg-purple-100 text-purple-700',
  secretaria: 'bg-blue-100 text-blue-700',
  direcao: 'bg-green-100 text-green-700',
  pedagogia: 'bg-orange-100 text-orange-700',
  professor: 'bg-gray-100 text-gray-700',
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
        'bg-white/80 backdrop-blur-md',
        'border-b border-gray-100',
        'px-4 py-3 lg:px-8',
      )}>
        <button
          className="block lg:hidden p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer transition"
          onClick={onMenuClick}>
          <Menu size={20} className="text-gray-600" />
        </button>

        <div className="hidden lg:block">
          <p className="text-sm text-gray-500">Bem-vindo de volta,</p>
          <p className="text-base font-semibold text-gray-800">
            {profile?.nome || profile?.email || 'Carregando...'}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-full hover:bg-gray-100 transition relative cursor-pointer">
            <Bell size={18} className="text-gray-500" />
          </button>

          <div className="flex items-center space-x-2">
            {profile?.role && (
              <span className={cn(
                'hidden sm:block text-xs font-medium px-2.5 py-1 rounded-full',
                roleColors[profile.role] || 'bg-gray-100 text-gray-700',
              )}>
                {roleLabels[profile.role] || profile.role}
              </span>
            )}
            <div className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold">
              {initials}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;
