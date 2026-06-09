import React from 'react';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import { twMerge as cn } from 'tailwind-merge';
import logo from '../assets/graduacao.png';

function Header({ onMenuClick }) {
  return (
    <div className='fixed'>
      <header
        className={cn(
          'flex',
          'justify-between',
          'w-screen',
          'p-2',
          'bg-white',
          'lg:p-3',
          'lg:pr-10',
        )}>
        <button
          className={cn('block', 'ml-4', 'lg:hidden', 'cursor-pointer')}
          onClick={onMenuClick}>
          <Menu />
        </button>
        <div
          className={cn(
            'pt-2',
            'flex',
            'items-center',
            'space-x-5',
            'lg:pt-8',
            'lg:pl-10',
          )}>
          <img
            src={logo}
            alt='Logo_graduacao'
            className={cn('w-8', 'h-8', 'lg:w-12', 'lg:h-12')}
          />

          <div>
            <h1 className={cn('text-sm', 'font-semibold', 'lg:text-lg')}>
              Sistema Acadêmico
            </h1>
            <p className={cn('text-sm', 'text-gray-500')}>Gestão Pedagógica</p>
          </div>
        </div>
        <div
          className={cn(
            'bg-gray-300',
            'w-10',
            'h-10',
            'rounded-full',
            'md:w-12',
            'md:h-12',
            'lg:w-15',
            'lg:h-15',
          )}></div>
      </header>
    </div>
  );
}

export default Header;
