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
