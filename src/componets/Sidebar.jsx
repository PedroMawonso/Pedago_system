import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/graduacao.png';
import { twMerge as cn } from 'tailwind-merge';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import {
  LayoutDashboard,
  Users,
  CircleUser,
  BookOpen,
  UsersRound,
  Library,
  ClipboardList,
  UserX,
  FileText,
  Settings,
  LogOut,
  X,
  Building2
} from 'lucide-react';

const allNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard', roles: ['admin', 'secretaria', 'direcao', 'pedagogia', 'professor'] },
  { icon: Building2, label: 'Escolas', to: '/escolas', roles: ['admin'] },
  { icon: Users, label: 'Utilizadores', to: '/professores', roles: ['admin', 'direcao', 'pedagogia'] },
  { icon: CircleUser, label: 'Alunos', to: '/alunos', roles: ['secretaria'] },
  { icon: BookOpen, label: 'Cursos', to: '/cursos', roles: ['direcao'] },
  { icon: UsersRound, label: 'Turmas', to: '/turmas', roles: ['secretaria', 'pedagogia', 'professor'] },
  { icon: Library, label: 'Disciplinas', to: '/disciplinas', roles: ['secretaria'] },
  { icon: ClipboardList, label: 'Notas', to: '/notas', roles: ['professor'] },
  { icon: UserX, label: 'Faltas', to: '/faltas', roles: ['professor'] },
  { icon: FileText, label: 'Relatórios', to: '/relatorios', roles: ['admin', 'secretaria', 'direcao'] },
];

function Sidebar({ visible, onClose }) {
  const navigate = useNavigate();
  const { profile } = useAuth();
  
  const userRole = profile?.role || '';
  
  // Filtrar itens pelo role
  const navItems = allNavItems.filter(item => item.roles.includes(userRole));

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <>
      {/* Overlay para mobile */}
      {visible && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onClose}
        />
      )}
      <div
        className={cn(
          'bg-white',
          'flex',
          'fixed',
          'top-0',
          'left-0',
          'h-full',
          'z-30',
          'overflow-y-auto',
          'transition-transform',
          'duration-300',
          'shadow-xl',
          'lg:translate-x-0',
          visible ? 'translate-x-0' : '-translate-x-full',
        )}>
        <aside className={cn('w-68', 'h-screen', 'lg:w-72', 'flex', 'flex-col')}>
          {/* Logo */}
          <div className={cn('pt-8', 'pl-6', 'pr-4', 'flex', 'items-center', 'justify-between', 'lg:pl-8')}>
            <div className="flex items-center space-x-3">
              <img src={logo} alt="Logo" className={cn('w-9', 'h-9', 'lg:w-11', 'lg:h-11')} />
              <div>
                <h1 className={cn('text-sm', 'font-bold', 'lg:text-base')}>Sistema Acadêmico</h1>
                <p className={cn('text-xs', 'text-gray-500')}>Gestão Pedagógica</p>
              </div>
            </div>
            <button onClick={onClose} className="block lg:hidden text-gray-400 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 mt-8 px-4 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map(({ icon: Icon, label, to }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
                        isActive
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                      )
                    }>
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center space-x-3">
                          <Icon
                            size={18}
                            className={cn(isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600')}
                          />
                          <span>{label}</span>
                        </div>
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <footer className="border-t border-gray-100 p-4 space-y-1">
            <NavLink
              to="/configuracoes"
              className={({ isActive }) =>
                cn(
                  'flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                )
              }>
              <Settings size={18} className="text-gray-400" />
              <span>Configurações</span>
            </NavLink>

            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200 cursor-pointer">
              <LogOut size={18} />
              <span>Sair do Sistema</span>
            </button>
          </footer>
        </aside>
      </div>
    </>
  );
}

export default Sidebar;
