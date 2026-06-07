import React from 'react';
import graduacao from '../assets/graduacao.png';
import { twMerge as cn } from 'tailwind-merge';

function Login() {
  return (
    <div
      className={cn(
        'flex w-screen',
        'h-screen',
        'justify-center',
        'items-center',
      )}>
      <div
        className={cn(
          'max-w-md',
          'space-y-4',
          'rounded-xl',
          'bg-[#ffffff]',
          'p-8',
          'w-110',
          'shadow-2xl',
        )}>
        <div className={cn('flex', 'items-center', 'justify-center')}>
          <img
            src={graduacao}
            alt='Logo_do_sistema'
            className='w-20 h-20'
          />
        </div>
        <h1 className={cn('text-center', 'text-3xl', 'font-bold')}>
          Sistema Acadêmico
        </h1>
        <p className={cn('text-center', 'text-gray-500')}>
          Gestão Pedagógica Completa
        </p>
        <div className=' space-y-6'>
          <div className='space-y-3'>
            <div className='text-sm'>
              <label htmlFor='email'>Email do usuário</label>
            </div>
            <div>
              <input
                type='text'
                placeholder='usuario@gmail.com'
                className={cn(
                  'w-full',
                  'bg-gray-300',
                  'focus: outline-gray-500',
                  'pl-4',
                  'pb-2',
                  'pt-2',
                  'rounded-md',
                )}
                required
              />
            </div>
          </div>

          <div className='space-y-3'>
            <div className={cn('text-sm', 'flex justify-between', 'w-94')}>
              <label htmlFor='email'>Senha</label>
              <a
                href='#'
                className={cn('font-semibold', 'text-blue-600')}>
                Esqueceu?
              </a>
            </div>
            <div>
              <input
                type='password'
                placeholder='*******'
                className={cn(
                  'w-full',
                  'bg-gray-300',
                  'focus: outline-gray-500',
                  'pl-4',
                  'pt-2',
                  'pb-2',
                  'rounded-md',
                )}
                required
              />
            </div>
          </div>

          <div className=''>
            <div>
              <button
                type='button'
                className={cn(
                  'w-full',
                  'pl-4',
                  'p-3',
                  'rounded-md',
                  'cursor-pointer',
                  'bg-[#030213]',
                  'text-white',
                  'font-bold',
                )}
                required
              >
                Entrar no Sistema
              </button>
            </div>
          </div>

          <p className='text-center text-md text-gray-500'>
            Acesso restrito a funcionários autorizados
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
