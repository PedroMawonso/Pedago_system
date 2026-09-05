import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/graduacao.png';
import { twMerge as cn } from 'tailwind-merge';
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
  Building2,
  ScrollText,
  Moon,
  Sun,
} from 'lucide-react';

const allNavItems = [
  // Rotas comuns (com visualizações específicas por cargo)
  { icon: LayoutDashboard, label: 'Dashboard',      to: '/dashboard',   roles: ['admin', 'secretaria', 'direcao', 'pedagogia', 'professor'] },
  
  // Rotas exclusivas do Admin Global
  { icon: Building2,      label: 'Escolas',         to: '/escolas',     roles: ['admin'] },
  { icon: Users,          label: 'Utilizadores',    to: '/professores', roles: ['admin'] },
  { icon: ScrollText,     label: 'Auditoria',       to: '/logs',        roles: ['admin'] },
  { icon: FileText,       label: 'Relatórios',      to: '/relatorios',  roles: ['admin'] },
  
  // Rotas escolares (outras roles)
  { icon: Users,          label: 'Funcionários',    to: '/professores', roles: ['direcao', 'pedagogia'] },
  { icon: CircleUser,     label: 'Alunos',          to: '/alunos',      roles: ['secretaria', 'pedagogia'] },
  { icon: BookOpen,       label: 'Cursos',          to: '/cursos',      roles: ['direcao', 'pedagogia'] },
  { icon: UsersRound,     label: 'Turmas',          to: '/turmas',      roles: ['secretaria', 'pedagogia', 'professor'] },
  { icon: Library,        label: 'Disciplinas',     to: '/disciplinas', roles: ['secretaria', 'pedagogia'] },
  { icon: ClipboardList,  label: 'Notas',           to: '/notas',       roles: ['professor', 'pedagogia'] },
  { icon: UserX,          label: 'Faltas',          to: '/faltas',      roles: ['professor', 'pedagogia'] },
  
  // Relatórios escolares
  { icon: FileText,       label: 'Relatórios',      to: '/relatorios',  roles: ['secretaria', 'direcao'] },
];

function Sidebar({ visible, onClose }) {
  const { profile, handleLogout } = useAuth();
  
  const userRole = profile?.role || '';
  
  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('pedago-dark-mode') === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('pedago-dark-mode', darkMode);
  }, [darkMode]);
  
  // Filtrar itens pelo role
  const navItems = userRole
    ? allNavItems.filter(item => item.roles.includes(userRole))
    : [];

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
          'bg-white dark:bg-slate-950',
          'fixed top-0 left-0 h-full z-30',
          'overflow-y-auto',
          'transition-transform duration-300',
          'shadow-xl lg:shadow-none',
          'border-r border-gray-100 dark:border-slate-900',
          'lg:translate-x-0',
          visible ? 'translate-x-0' : '-translate-x-full',
        )}>
        <aside className="w-68 h-screen lg:w-72 flex flex-col justify-between">
          <div>
            {/* Logo */}
            <div className="pt-6 pb-2 pl-6 pr-4 flex items-center justify-between lg:pl-8">
              <div className="flex items-center space-x-3">
                <img src={logo} alt="Logo" className="w-9 h-9 lg:w-10 lg:h-10" />
                <div>
                  <h1 className="text-sm font-bold lg:text-base text-gray-900 dark:text-slate-100">Pedago System</h1>
                  <p className="text-xs text-gray-400 dark:text-slate-500">Gestão Pedagógica</p>
                </div>
              </div>
              <button onClick={onClose} className="block lg:hidden text-gray-400 hover:text-gray-700 dark:hover:text-slate-300 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            {/* Separador */}
            <div className="mx-5 my-3 border-t border-gray-100 dark:border-slate-900" />

            {/* Nav */}
            <nav className="px-4">
              {/* Etiqueta de secção */}
              <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-300 dark:text-slate-600">
                {userRole === 'admin' ? 'Plataforma' : 'Menu Principal'}
              </p>

              {/* Skeleton enquanto o profile ainda não carregou */}
              {!userRole ? (
                <ul className="space-y-1">
                  {[...Array(5)].map((_, i) => (
                    <li key={i} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg">
                      <div className="w-4.5 h-4.5 bg-gray-200 dark:bg-slate-800 rounded animate-pulse" />
                      <div className="h-3.5 bg-gray-200 dark:bg-slate-800 rounded animate-pulse" style={{ width: `${60 + i * 10}px` }} />
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-0.5">
                  {navItems.map(({ icon: Icon, label, to }) => (
                    <li key={to + label}>
                      <NavLink
                        to={to}
                        onClick={onClose}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group',
                            isActive
                              ? 'bg-slate-900 text-white dark:bg-slate-900 dark:text-indigo-400 dark:border-l-2 dark:border-indigo-500 dark:rounded-r-lg dark:rounded-l-none'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-900/60 dark:hover:text-slate-100',
                          )
                        }>
                        {({ isActive }) => (
                          <>
                            <Icon
                              size={18}
                              className={cn(isActive ? 'text-white dark:text-indigo-400' : 'text-gray-400 group-hover:text-gray-600 dark:text-slate-500 dark:group-hover:text-slate-300')}
                            />
                            <span>{label}</span>
                          </>
                        )}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </nav>
          </div>

          {/* Rodapé e Configurações */}
          <div className="px-4 pb-6">
            {/* Separador */}
            <div className="mx-1 mb-3 border-t border-gray-100 dark:border-slate-900" />

            <div className="space-y-0.5">
              {/* Toggle dark mode */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-900/60 dark:hover:text-slate-100 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-gray-400 dark:text-slate-500" />}
                  <span>{darkMode ? 'Modo Claro' : 'Modo Escuro'}</span>
                </div>
                <div className={cn(
                  'relative w-9 h-5 rounded-full transition-colors duration-200',
                  darkMode ? 'bg-indigo-600' : 'bg-gray-300'
                )}>
                  <div className={cn(
                    'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200',
                    darkMode ? 'translate-x-4' : 'translate-x-0.5'
                  )} />
                </div>
              </button>

              {/* Configurações */}
              <NavLink
                to="/configuracoes"
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-slate-900 dark:text-indigo-400 dark:border-l-2 dark:border-indigo-500 dark:rounded-r-lg dark:rounded-l-none'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-900/60 dark:hover:text-slate-100',
                  )
                }>
                {({ isActive }) => (
                  <>
                    <Settings size={18} className={cn(isActive ? 'text-white dark:text-indigo-400' : 'text-gray-400 dark:text-slate-500')} />
                    <span>Configurações</span>
                  </>
                )}
              </NavLink>

              {/* Sair */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200 cursor-pointer">
                <LogOut size={18} className="text-red-400" />
                <span>Sair do Sistema</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

export default Sidebar;
