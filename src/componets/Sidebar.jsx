import React from 'react';
import logo from '../assets/graduacao.png';
import { twMerge as cn } from 'tailwind-merge';

function Sidebar() {
  return (
    <div>
      <aside>
        <div className={cn('p-5', 'flex', 'items-center', 'space-x-5')}>
          <img
            src={logo}
            alt='Logo_graduacao'
            className={cn('w-15', 'h-15')}
          />
          <div className={cn('text-center')}>
            <h1 className={cn('text-lg', 'font-semibold')}>
              Sistema Acadêmico
            </h1>
            <p className={cn('text-sm', 'text-gray-500')}>Gestão Pedagógica</p>
          </div>
        </div>

        <nav>
          <ul>
            <li>
              <a href='#'>Dashbord</a>
            </li>
            <li>
              <a href='#'>D</a>
              <li>
                <a href='#'>Dashbord</a>
              </li>
              <li>
                <a href='#'>Dashbord</a>
              </li>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  );
}

export default Sidebar;
