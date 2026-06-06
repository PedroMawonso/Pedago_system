import React from 'react';
import logo from '../assets/graduacao.png';
import { twMerge as cn } from 'tailwind-merge';

function Sidebar() {
  return (
    <div>
      <div
        
      >
        <img
          src={logo}
          alt='Logo_graduacao'
          className='w-15 h-15'
        />
      </div>
    </div>
  );
}

export default Sidebar;
