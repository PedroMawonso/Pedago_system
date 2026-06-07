import React from 'react';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import { twMerge as cn } from 'tailwind-merge';

function Header() {
  const [sidebarOpen, setsidebarOpen] = useState(false);
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
          className={cn('block', 'lg:invisible', 'cursor-pointer')}
          onClick={() => {
            sidebarOpen(true);
          }}>
          <Menu />
        </button>
        <div className='bg-gray-300 w-15 h-15 rounded-full'></div>
      </header>
    </div>
  );
}

export default Header;
