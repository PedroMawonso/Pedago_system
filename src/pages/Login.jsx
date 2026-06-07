import React from 'react';
import graduacao from '../assets/graduacao.png';
import { twMerge as cn } from 'tailwind-merge';

function Login() {
  return (
    <div
      className={cn(
        'flex',
        'w-screen',
        'h-screen',
        'justify-center',
        'items-center',
      )}>
      <div
        className={cn(
          /* Mobile first */
          'rounded-xl',
          'w-80',
          'p-5  ',
          'bg-[#ffffff]',
          'shadow-2xl',
          'space-y-2',
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
            /* Desktop */
            'lg:text-sm',
          )}>
          Gestão Pedagógica Completa
        </p>
        <div className=' space-y-4 lg:space-y-6'>
          <div className='space-y-2 lg:space-y-3'>
            <div className='text-[12px] lg:text-sm'>
              <label htmlFor='email'>Email do usuário</label>
            </div>
            <div>
              <input
                type='text'
                placeholder='usuario@gmail.com'
                className={cn(
                  /* Mobile first */
                  'w-full',
                  'pl-4',
                  'pb-2',
                  'pt-2',
                  'bg-gray-300',
                  'focus: outline-gray-500',
                  'rounded-md',
                  'text-[12px]',
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
                'w-70',
                'lg:text-sm',
                'lg:w-94',
              )}>
              <label htmlFor='email'>Senha</label>
              <a
                href='#'
                className={cn(
                  'text-blue-600',
                  'text-[11px]',
                  'lg:text-sm',
                  'lg:font-bold',
                )}>
                Esqueceu?
              </a>
            </div>
            <div>
              <input
                type='password'
                placeholder='*******'
                className={cn(
                  /* Mobile first */
                  'w-full',
                  'pl-4',
                  'pb-2',
                  'pt-2',
                  'bg-gray-300',
                  'focus: outline-gray-500',
                  'rounded-md',
                  'text-[12px]',
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
                type='button'
                className={cn(
                  /* Mobile first */
                  'w-full',
                  'rounded-md',
                  'cursor-pointer',
                  'bg-[#030213]',
                  'text-white',
                  'font-bold',
                  'text-[12px]',
                  'p-2',
                  /* Desktop */
                  'lg:pl-4',
                  'lg:p-3',
                  'lg:text-sm',
                )}
                required>
                Entrar no Sistema
              </button>
            </div>
          </div>

          <p
            className={cn(
              'text-center',
              'text-[11px]',
              'text-gray-500',
              'lg:text-md',
            )}>
            Acesso restrito a funcionários autorizados
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
