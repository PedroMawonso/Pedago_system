import React, { useState } from 'react';

/* Pages importation */
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Professores from './pages/Professores';
import Alunos from './pages/Alunos';
import Notas from './pages/Notas';
import Cursos from './pages/Cursos';

/* Import tailwind merge to format the classes */
import { twMerge as cn } from 'tailwind-merge';

/* Component Start */
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
       <Login></Login>
      {/*  <Dashboard></Dashboard> */}
     {/*  <Professores></Professores> */}
      {/* <Alunos></Alunos> */}
     {/*  <Notas></Notas> */}
      {/* <Cursos></Cursos> */}
    </div>
  );
}

export default App;
