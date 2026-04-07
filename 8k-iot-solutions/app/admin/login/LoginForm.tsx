'use client';

import React, { useState, useTransition } from 'react';
import { handleLoginAction, handleVerifyOTPAction } from './actions';
import Loader from '@/components/Loader';
import { useRouter } from 'next/navigation';

interface LoginFormProps {
  error?: string;
  step?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ error: initialError, step: initialStep }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(initialError);
  const [step, setStep] = useState(initialStep);

  const isStepOTP = step === 'otp';

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    startTransition(async () => {
      if (isStepOTP) {
        const code = formData.get('code') as string;
        const result = await handleVerifyOTPAction(code);
        if (result?.type === 'error') {
          if (result.message === 'invalid_code') {
            setError('invalid_code');
          } else {
            setError(result.message);
          }
        }
      } else {
        const password = formData.get('password') as string;
        const result = await handleLoginAction(password);
        
        if (result.type === 'otp_required') {
          setStep('otp');
          setError(undefined);
          router.push('/admin/login?step=otp');
        } else if (result.type === 'invalid_password') {
          setError('invalid');
        } else if ('message' in result) {
          setError(result.message);
        }
      }
    });
  }

  return (
    <>
      {isPending && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-sm transition-all duration-300">
          <Loader />
        </div>
      )}

      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-zinc-200">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-zinc-900 font-poppins">
            {isStepOTP ? 'Security Code' : 'Admin Login'}
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-600 px-4">
            {isStepOTP 
              ? 'We sent a 6-digit verification code to your email.' 
              : 'Sign in to manage projects'
            }
          </p>
        </div>
        
        {error && (
          <div className={`p-3 rounded-md text-sm text-center border ${
            error === 'invalid' || error === 'invalid_code' 
              ? 'bg-red-50 text-red-600 border-red-200' 
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
            {error === 'invalid' && 'Invalid password.'}
            {error === 'invalid_code' && 'Invalid or expired code. Please try again.'}
            {error !== 'invalid' && error !== 'invalid_code' && decodeURIComponent(error)}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {isStepOTP ? (
              <div key="otp-step">
                <label htmlFor="code" className="sr-only">Verification Code</label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  required
                  autoFocus
                  maxLength={6}
                  disabled={isPending}
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-zinc-300 placeholder-zinc-500 text-zinc-900 focus:outline-none focus:ring-zinc-900 focus:border-zinc-900 sm:text-lg text-center tracking-[10px] font-bold disabled:bg-zinc-50 disabled:text-zinc-400"
                  placeholder="000000"
                />
              </div>
            ) : (
              <div key="password-step">
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoFocus
                  disabled={isPending}
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-zinc-300 placeholder-zinc-500 text-zinc-900 focus:outline-none focus:ring-zinc-900 focus:border-zinc-900 sm:text-sm disabled:bg-zinc-50 disabled:text-zinc-400"
                  placeholder="Password"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-3">
            <button
              type="submit"
              disabled={isPending}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 transition-colors shadow-sm disabled:bg-zinc-400 disabled:cursor-not-allowed"
            >
              {isStepOTP ? 'Verify & Sign In' : 'Continue'}
            </button>
            
            {isStepOTP && (
              <button 
                type="button"
                onClick={() => {
                   setStep(undefined);
                   setError(undefined);
                   router.push('/admin/login');
                }}
                disabled={isPending}
                className="text-center text-sm text-zinc-500 hover:text-zinc-800 transition-colors disabled:opacity-50"
              >
                Back to Login
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default LoginForm;
