import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import graduacao from '../assets/graduacao.png';
import { twMerge as cn } from 'tailwind-merge';
import { supabase } from '../lib/supabase';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
    }
    setLoading(false);
  };

  return (
    <div
      className={cn(
        'flex',
        'w-screen',
        'h-screen',
        'justify-center',
        'items-center',
        'bg-gray-50',
        'dark:bg-slate-950',
        'transition-colors',
      )}>
      <form
        onSubmit={handleLogin}
        className={cn(
          /* Mobile first */
          'rounded-xl',
          'w-80',
          'p-5',
          'bg-white',
          'shadow-2xl',
          'space-y-2',
          /* Dark mode */
          'dark:bg-slate-900',
          'dark:shadow-slate-900/50',
          /* Desktop */
          'lg:max-w-md',
          'lg:space-y-4',
          'lg:p-8',
          'lg:w-110',
        )}>
        <div className={cn('flex', 'items-center', 'justify-center')}>
          <img
            src={graduacao}
            alt='Logo_do_sistema'
            className={cn(
              /* Mobile first */
              'w-12',
              'h-12',
              /* Desktop */
              'lg:w-20',
              'lg:h-20',
            )}
          />
        </div>
        <h1
          className={cn(
            /* Mobile first */
            'text-center',
            'text-lg',
            'font-bold',
            'text-gray-900',
            'dark:text-slate-100',
            /* Desktop */
            'lg:text-3xl',
          )}>
          Sistema Acadêmico
        </h1>
        <p
          className={cn(
            /* Mobile first */
            'text-center',
            'text-[12px]',
            'text-gray-500',
            'dark:text-slate-400',
            /* Desktop */
            'lg:text-sm',
          )}>
          Gestão Pedagógica Completa
        </p>

        {errorMsg && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-2 rounded relative text-xs lg:text-sm text-center">
            {errorMsg}
          </div>
        )}

        <div className=' space-y-4 lg:space-y-6'>
          <div className='space-y-2 lg:space-y-3'>
            <div className='text-[12px] lg:text-sm text-gray-700 dark:text-slate-300'>
              <label htmlFor='email'>Email do usuário</label>
            </div>
            <div>
              <input
                id='email'
                type='email'
                placeholder='usuario@gmail.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(
                  /* Mobile first */
                  'w-full',
                  'pl-4',
                  'pb-2',
                  'pt-2',
                  'bg-gray-100',
                  'focus:outline-gray-500',
                  'rounded-md',
                  'text-[12px]',
                  'text-gray-900',
                  'placeholder-gray-400',
                  /* Dark mode */
                  'dark:bg-slate-800',
                  'dark:text-slate-200',
                  'dark:placeholder-slate-500',
                  'dark:focus:outline-slate-500',
                  /* Desktop */
                  'lg:pl-5',
                  'lg:pb-3',
                  'lg:pt-3',
                  'lg:text-sm',
                )}
                required
              />
            </div>
          </div>

          <div className='space-y-2 lg:space-y-3'>
            <div
              className={cn(
                'text-[12px]',
                'flex justify-between',
                'w-full',
                'text-gray-700',
                'dark:text-slate-300',
                'lg:text-sm',
              )}>
              <label htmlFor='password'>Senha</label>
              <a
                href='#'
                className={cn(
                  'text-blue-600',
                  'dark:text-blue-400',
                  'text-[11px]',
                  'lg:text-sm',
                  'lg:font-bold',
                )}>
                Esqueceu?
              </a>
            </div>
            <div>
              <input
                id='password'
                type='password'
                placeholder='*******'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={cn(
                  /* Mobile first */
                  'w-full',
                  'pl-4',
                  'pb-2',
                  'pt-2',
                  'bg-gray-100',
                  'focus:outline-gray-500',
                  'rounded-md',
                  'text-[12px]',
                  'text-gray-900',
                  'placeholder-gray-400',
                  /* Dark mode */
                  'dark:bg-slate-800',
                  'dark:text-slate-200',
                  'dark:placeholder-slate-500',
                  'dark:focus:outline-slate-500',
                  /* Desktop */
                  'lg:pl-5',
                  'lg:pb-3',
                  'lg:pt-3',
                  'lg:text-sm',
                )}
                required
              />
            </div>
          </div>

          <div className='mt-5'>
            <div>
              <button
                type='submit'
                disabled={loading}
                className={cn(
                  /* Mobile first */
                  'w-full',
                  'rounded-md',
                  'cursor-pointer',
                  'bg-gray-900',
                  'text-white',
                  'font-bold',
                  'text-[12px]',
                  'p-2',
                  'hover:bg-gray-700',
                  /* Dark mode */
                  'dark:bg-slate-100',
                  'dark:text-slate-900',
                  'dark:hover:bg-slate-200',
                  /* Desktop */
                  'lg:p-3',
                  'lg:text-sm',
                  'transition-colors',
                  loading && 'opacity-50 cursor-not-allowed'
                )}>
                {loading ? 'Entrando...' : 'Entrar no Sistema'}
              </button>
            </div>
          </div>

          <div className="mt-8 text-center space-y-4">
            <p className="text-sm text-gray-500 dark:text-slate-400">
              Professor novo?{' '}
              <Link to="/signup" className="text-gray-900 dark:text-slate-100 font-bold hover:underline">
                Usar código de convite
              </Link>
            </p>
          </div>

          <p
            className={cn(
              'text-center',
              'text-[11px]',
              'text-gray-500',
              'dark:text-slate-400',
              'lg:text-md',
            )}>
            Acesso restrito a funcionários autorizados
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
