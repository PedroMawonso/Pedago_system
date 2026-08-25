import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/AuthContext';

/* Layout */
import AppLayout from './componets/AppLayout';

/* Pages */
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Professores from './pages/Professores';
import Alunos from './pages/Alunos';
import Notas from './pages/Notas';
import Cursos from './pages/Cursos';
import Turmas from './pages/Turmas';
import Disciplinas from './pages/Disciplinas';
import Escolas from './pages/Escolas';
import Logs from './pages/Logs';
import Configuracoes from './pages/Configuracoes';
import RelatoriosAdmin from './pages/RelatoriosAdmin';

function AppRoutes() {
  const { session, loading, profile } = useAuth();

  if (loading) {
    return (
      <div className='flex items-center justify-center w-screen h-screen bg-gray-50'>
        <div className='w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin' />
      </div>
    );
  }

  const isAdmin = profile?.role === 'admin';

  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route
          path='/'
          element={
            !session ? (
              <Login />
            ) : (
              <Navigate
                to='/dashboard'
                replace
              />
            )
          }
        />
        <Route
          path='/signup'
          element={
            !session ? (
              <Signup />
            ) : (
              <Navigate
                to='/dashboard'
                replace
              />
            )
          }
        />

        {/* Rotas protegidas com layout */}
        <Route
          element={
            session ? (
              <AppLayout />
            ) : (
              <Navigate
                to='/'
                replace
              />
            )
          }>
          <Route
            path='/dashboard'
            element={<Dashboard />}
          />
          <Route
            path='/professores'
            element={<Professores />}
          />
          <Route
            path='/alunos'
            element={<Alunos />}
          />
          <Route
            path='/notas'
            element={<Notas />}
          />
          <Route
            path='/cursos'
            element={<Cursos />}
          />
          <Route
            path='/turmas'
            element={<Turmas />}
          />
          <Route
            path='/disciplinas'
            element={<Disciplinas />}
          />

          {/* Rotas exclusivas de admin */}
          <Route
            path='/escolas'
            element={
              isAdmin ? (
                <Escolas />
              ) : (
                <Navigate
                  to='/dashboard'
                  replace
                />
              )
            }
          />
          <Route
            path='/logs'
            element={
              isAdmin ? (
                <Logs />
              ) : (
                <Navigate
                  to='/dashboard'
                  replace
                />
              )
            }
          />
          <Route
            path='/configuracoes'
            element={
              isAdmin ? (
                <Configuracoes />
              ) : (
                <Navigate
                  to='/dashboard'
                  replace
                />
              )
            }
          />
          <Route
            path='/relatorios'
            element={
              isAdmin ? (
                <RelatoriosAdmin />
              ) : (
                <Navigate
                  to='/dashboard'
                  replace
                />
              )
            }
          />
        </Route>

        <Route
          path='*'
          element={
            <Navigate
              to='/'
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
