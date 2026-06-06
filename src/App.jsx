import React from 'react';
import Login from './componets/Login';
import Sidebar from './componets/Sidebar';
import { twMerge as cn } from 'tailwind-merge';

function App() {
  return (
    <div
      className={cn(
        'bg-linear-to-r',
        'from',
        'bg-blue-50',
        'to',
        'bg-indigo-100',
        'to',
        'bg-purple-20',
        'w-screen',
        'h-screen',
      )}
    >
     {/*  <Login></Login> */}
      <Sidebar></Sidebar> 
    </div>
  );
}

export default App;
