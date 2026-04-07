import { redirect } from 'next/navigation';
import { login, verifyOTP } from '@/lib/auth';

export const metadata = {
  title: "Admin Login",
};

export default async function AdminLoginPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ error?: string; step?: string }> 
}) {
  const { error, step } = await searchParams;

  async function handleLogin(formData: FormData) {
    'use server';
    const password = formData.get('password') as string;
    let destination = '';
    
    try {
      const result = await login(password);
      
      if (result.type === 'otp_required') {
        destination = '/admin/login?step=otp';
      } else if (result.type === 'invalid_password') {
        destination = '/admin/login?error=invalid';
      }
    } catch (err: any) {
      if (err.message === 'NEXT_REDIRECT') throw err;
      destination = `/admin/login?error=${encodeURIComponent(err.message)}`;
    }

    if (destination) {
      redirect(destination);
    }
  }

  async function handleVerifyOTP(formData: FormData) {
    'use server';
    const code = formData.get('code') as string;
    let destination = '';
    
    try {
      const isAuthorized = await verifyOTP(code);
      if (isAuthorized) {
        destination = '/admin';
      } else {
        destination = '/admin/login?step=otp&error=invalid_code';
      }
    } catch (err: any) {
      if (err.message === 'NEXT_REDIRECT') throw err;
      destination = `/admin/login?step=otp&error=${encodeURIComponent(err.message)}`;
    }

    if (destination) {
      redirect(destination);
    }
  }

  const isStepOTP = step === 'otp';

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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

        <form className="mt-8 space-y-6" action={isStepOTP ? handleVerifyOTP : handleLogin}>
          <div className="rounded-md shadow-sm space-y-4">
            {isStepOTP ? (
              <div>
                <label htmlFor="code" className="sr-only">Verification Code</label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  required
                  autoFocus
                  maxLength={6}
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-zinc-300 placeholder-zinc-500 text-zinc-900 focus:outline-none focus:ring-zinc-900 focus:border-zinc-900 sm:text-lg text-center tracking-[10px] font-bold"
                  placeholder="000000"
                />
              </div>
            ) : (
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoFocus
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-zinc-300 placeholder-zinc-500 text-zinc-900 focus:outline-none focus:ring-zinc-900 focus:border-zinc-900 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-3">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 transition-colors shadow-sm"
            >
              {isStepOTP ? 'Verify & Sign In' : 'Continue'}
            </button>
            
            {isStepOTP && (
              <a 
                href="/admin/login" 
                className="text-center text-sm text-zinc-500 hover:text-zinc-800 transition-colors"
              >
                Back to Login
              </a>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
