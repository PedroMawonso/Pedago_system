import React from 'react';
import logo from '../assets/graduacao.png';
import { twMerge as cn } from 'tailwind-merge';
import {
  LayoutDashboard,
  ChevronRight,
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
  SidebarOpen,
} from 'lucide-react';

const styleMenu = cn(
  'text-gray-700',
  'cursor-default',
  'text-sm',
  'lg:text-[16px]',
);

function Sidebar({ visible }) {
  return (
    <div
      className={cn(
        'bg-white',
        'flex',
        'fixed',
        'overflow-y-auto',
        'transition-transform',
        'duration-300',
        'lg:translate-x-0',
        visible ? 'translate-x-0' : '-translate-x-full',
      )}>
      <aside
        className={cn(
          'w-64',
          'h-screen',
          'lg:w-68',
          'lg:space-y-10',
          'lg:overflow-hidden',
        )}>
        <div
          className={cn('space-y-20', 'mt-25', 'lg:mt-35', '2xl:space-y-40')}>
          <nav className={cn('max-h-64', 'overflow-y-auto')}>
            <ul className={cn('ml-4', 'space-y-0', 'w-54', 'lg:ml-9')}>
              <li
                className={cn(
                  'flex',
                  'space-x-13',
                  'hover:bg-gray-200 rounded-md p-2 pt-3 pb-3',
                  'duration-500',
                  'hover:duration-500',
                )}>
                <div
                  className={cn(
                    'flex',
                    'space-x-4',
                    'lg:space-x-4',
                    'lg:w-50',
                  )}>
                  <div className="text-gray-400">
                    <LayoutDashboard></LayoutDashboard>
                  </div>
                  <a
                    href="#"
                    className={styleMenu}>
                    Dashboard
                  </a>
                </div>

                <div>
                  <ChevronRight></ChevronRight>
                </div>
              </li>

              <li
                className={cn(
                  'flex',
                  'space-x-10',
                  'hover:bg-gray-200 rounded-md p-2 pt-3 pb-3',
                  'duration-500',
                  'hover:duration-500',
                )}>
                <div className={cn('flex', 'space-x-4', 'w-50')}>
                  <div className="text-gray-500">
                    <Users></Users>
                  </div>
                  <a
                    href="#"
                    className={styleMenu}>
                    Professores
                  </a>
                </div>

                <div>
                  <ChevronRight></ChevronRight>
                </div>
              </li>

              <li
                className={cn(
                  'flex',
                  'space-x-10',
                  'hover:bg-gray-200 rounded-md p-2 pt-3 pb-3',
                  'duration-500',
                  'hover:duration-500',
                )}>
                <div className={cn('flex', 'space-x-4', 'w-50')}>
                  <div className="text-gray-500">
                    <CircleUser></CircleUser>
                  </div>
                  <a
                    href="#"
                    className={styleMenu}>
                    Alunos
                  </a>
                </div>

                <div>
                  <ChevronRight></ChevronRight>
                </div>
              </li>

              <li
                className={cn(
                  'flex',
                  'space-x-10',
                  'hover:bg-gray-200 rounded-md p-2 pt-3 pb-3',
                  'duration-500',
                  'hover:duration-500',
                )}>
                <div className={cn('flex', 'space-x-4', 'w-50')}>
                  <div className="text-gray-500">
                    <BookOpen></BookOpen>
                  </div>
                  <a
                    href="#"
                    className={styleMenu}>
                    Cursos
                  </a>
                </div>

                <div>
                  <ChevronRight></ChevronRight>
                </div>
              </li>

              <li
                className={cn(
                  'flex',
                  'space-x-10',
                  'hover:bg-gray-200 rounded-md p-2 pt-3 pb-3',
                  'duration-500',
                  'hover:duration-500',
                )}>
                <div className={cn('flex', 'space-x-4', 'w-50')}>
                  <div className="text-gray-500">
                    <UsersRound></UsersRound>
                  </div>
                  <a
                    href="#"
                    className={styleMenu}>
                    Turmas
                  </a>
                </div>

                <div>
                  <ChevronRight></ChevronRight>
                </div>
              </li>

              <li
                className={cn(
                  'flex',
                  'space-x-10',
                  'hover:bg-gray-200 rounded-md p-2 pt-3 pb-3',
                  'duration-500',
                  'hover:duration-500',
                )}>
                <div className={cn('flex', 'space-x-4', 'w-50')}>
                  <div className="text-gray-500">
                    <Library></Library>
                  </div>
                  <a
                    href="#"
                    className={styleMenu}>
                    Disciplinas
                  </a>
                </div>

                <div>
                  <ChevronRight></ChevronRight>
                </div>
              </li>

              <li
                className={cn(
                  'flex',
                  'space-x-10',
                  'hover:bg-gray-200 rounded-md p-2 pt-3 pb-3',
                  'duration-500',
                  'hover:duration-500',
                )}>
                <div className={cn('flex', 'space-x-4', 'w-50')}>
                  <div className="text-gray-500">
                    <ClipboardList></ClipboardList>
                  </div>
                  <a
                    href="#"
                    className={styleMenu}>
                    Notas
                  </a>
                </div>

                <div>
                  <ChevronRight></ChevronRight>
                </div>
              </li>

              <li
                className={cn(
                  'flex',
                  'space-x-10',
                  'hover:bg-gray-200 rounded-md p-2 pt-3 pb-3',
                  'duration-500',
                  'hover:duration-500',
                )}>
                <div className={cn('flex', 'space-x-4', 'w-50')}>
                  <div className="text-gray-500">
                    <UserX></UserX>
                  </div>
                  <a
                    href="#"
                    className={styleMenu}>
                    Faltas
                  </a>
                </div>

                <div>
                  <ChevronRight></ChevronRight>
                </div>
              </li>

              <li
                className={cn(
                  'flex',
                  'space-x-10',
                  'hover:bg-gray-200 rounded-md p-2 pt-3 pb-3',
                  'duration-500',
                  'hover:duration-500',
                )}>
                <div className={cn('flex', 'space-x-4', 'w-50')}>
                  <div className="text-gray-500">
                    <FileText></FileText>
                  </div>
                  <a
                    href="#"
                    className={styleMenu}>
                    Relatórios
                  </a>
                </div>

                <div>
                  <ChevronRight></ChevronRight>
                </div>
              </li>
            </ul>
          </nav>

          <footer
            className={cn(
              'border-t',
              'border-gray-300',
              'pt-5',
              'pb-5',
              'text-center',
            )}>
            <nav>
              <ul className={cn('ml-4', 'lg:ml-10', 'space-y-2', 'w-52')}>
                <li
                  className={cn(
                    'flex',
                    'space-x-6',
                    'p-2',
                    'pt-3',
                    'pb-3',
                    'rounded-md',
                    'hover:bg-gray-200',
                    'duration-500',
                    'hover:duration-500',
                  )}>
                  <div className="flex space-x-4 w-50">
                    <div className="text-gray-500">
                      <Settings></Settings>
                    </div>
                    <a
                      href="#"
                      className={styleMenu}>
                      Configurações
                    </a>
                  </div>
                  <div>
                    <ChevronRight></ChevronRight>
                  </div>
                </li>

                <li
                  className={cn(
                    'p-2',
                    'pt-3',
                    'pb-2',
                    'text-red-600',
                    'rounded-md',
                    'hover:bg-red-200',
                    'duration-500',
                    'hover:duration-500',
                  )}>
                  <div className="flex space-x-3 w-50">
                    <div>
                      <LogOut></LogOut>
                    </div>

                    <a
                      href="#"
                      className="cursor-default">
                      Sair
                    </a>
                  </div>
                </li>
              </ul>
            </nav>
          </footer>
        </div>
      </aside>
    </div>
  );
}

export default Sidebar;
