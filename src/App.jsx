import React from 'react';
import Login from './pages/Login';
import Sidebar from './componets/Sidebar';
import Header from './componets/Header';
import { twMerge as cn } from 'tailwind-merge';

function App() {
  return (
    <div
      className={cn(
        'bg-gradient-to-r',
        'from-blue-50',
        'to-bg-purple-200',
        'w-screen',
        'h-screen',
      )}>
{/*       <Header></Header> */}
      <Sidebar></Sidebar>
   {/*    <Login></Login> */}
    </div>
  );
}

export default App;
