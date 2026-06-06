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
} from 'lucide-react';

function Sidebar() {
  return (
    <div className={cn('flex')}>
      <aside className={cn('bg-white', 'w-85', 'h-screen', 'space-y-15')}>
        <div
          className={cn('pl-10', 'pt-8', 'flex', 'items-center', 'space-x-5')}>
          <img
            src={logo}
            alt='Logo_graduacao'
            className={cn('w-12', 'h-12')}
          />

          <div>
            <h1 className={cn('text-lg', 'font-semibold')}>
              Sistema Acadêmico
            </h1>
            <p className={cn('text-sm', 'text-gray-500')}>Gestão Pedagógica</p>
          </div>
        </div>

        <nav className={cn('')}>
          <ul className={cn('ml-9', 'space-y-2', 'w-70')}>
            <li
              className={cn(
                'flex',
                'space-x-10',
                'hover:bg-gray-200 rounded-md p-2 pt-3 pb-3',
                'duration-500',
                'hover:duration-500',
              )}>
              <div className={cn('flex', 'space-x-4', 'w-50')}>
                <div className='text-gray-400'>
                  <LayoutDashboard></LayoutDashboard>
                </div>
                <a
                  href='#'
                  className='text-gray-700 cursor-default'>
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
                <div className='text-gray-500'>
                  <Users></Users>
                </div>
                <a
                  href='#'
                  className='text-gray-700 cursor-default'>
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
                <div className='text-gray-500'>
                  <CircleUser></CircleUser>
                </div>
                <a
                  href='#'
                  className='text-gray-700 cursor-default'>
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
                <div className='text-gray-500'>
                  <BookOpen></BookOpen>
                </div>
                <a
                  href='#'
                  className='text-gray-700 cursor-default'>
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
                <div className='text-gray-500'>
                  <UsersRound></UsersRound>
                </div>
                <a
                  href='#'
                  className='text-gray-700 cursor-default'>
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
                <div className='text-gray-500'>
                  <Library></Library>
                </div>
                <a
                  href='#'
                  className='text-gray-700 cursor-default'>
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
                <div className='text-gray-500'>
                  <ClipboardList></ClipboardList>
                </div>
                <a
                  href='#'
                  className='text-gray-700 cursor-default'>
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
                <div className='text-gray-500'>
                  <UserX></UserX>
                </div>
                <a
                  href='#'
                  className='text-gray-700 cursor-default'>
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
                <div className='text-gray-500'>
                  <FileText></FileText>
                </div>
                <a
                  href='#'
                  className='text-gray-700 cursor-default'>
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
          className={cn('border-t', 'border-gray-300', 'pt-5', 'text-center')}>
          <nav>
            <ul className={cn('ml-10', 'space-y-2', 'w-69')}>
              <li
                className={cn(
                  'flex',
                  'space-x-10',
                  'p-2',
                  'pt-3',
                  'pb-3',
                  'rounded-md',
                  'hover:bg-gray-200',
                  'duration-500',
                  'hover:duration-500',
                )}>
                <div className='flex space-x-3 w-50'>
                  <div className='text-gray-500'>
                    <Settings></Settings>
                  </div>
                  <a
                    href='#'
                    className='text-gray-700 cursor-default'>
                    Configurações
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
                  'p-2',
                  'pt-3',
                  'pb-2',
                  'text-red-600',
                  'rounded-md',
                  'hover:bg-red-200',
                  'duration-500',
                  'hover:duration-500',
                )}>
                <div className='flex space-x-3 w-50'>
                  <div>
                    <LogOut></LogOut>
                  </div>

                  <a
                    href='#'
                    className='cursor-default'>
                    Sair
                  </a>
                </div>
              </li>
            </ul>
          </nav>
        </footer>
      </aside>
    </div>
  );
}

export default Sidebar;
