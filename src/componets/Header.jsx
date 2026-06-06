import React from 'react';
import { Menu } from 'lucide-react';
import { twMerge as cn } from 'tailwind-merge';

function Header() {
  return (
    <div>
      <header
        className={cn(
          'flex',
          'justify-between',
          'p-8',
          'border-4',
          'bg-white',
          'md:ml-90',
          'w-screen',
        )}>
        <button className={cn('block', 'md:hidden', 'cursor-pointer')}>
          <Menu />
        </button>

        <h1 className={cn('font-extrabold', 'text-xl')}>Dashboard</h1>

        <div></div>
      </header>
    </div>
  );
}

export default Header;
