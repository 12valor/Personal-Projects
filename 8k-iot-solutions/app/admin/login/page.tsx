import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata = {
  title: "Admin Login",
};

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  async function handleLogin(formData: FormData) {
    'use server';
    const password = formData.get('password') as string;
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin';
    
    if (password === adminPassword) {
      // Set an auth cookie
      const cookieStore = await cookies();
      cookieStore.set('admin_auth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });
      redirect('/admin');
    } else {
      redirect('/admin/login?error=invalid');
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-zinc-200">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-zinc-900 font-poppins">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-600">
            Sign in to manage projects
          </p>
        </div>
        
        {error === 'invalid' && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center border border-red-200">
            Invalid password.
          </div>
        )}

        <form className="mt-8 space-y-6" action={handleLogin}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-zinc-300 placeholder-zinc-500 text-zinc-900 focus:outline-none focus:ring-zinc-900 focus:border-zinc-900 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 transition-colors"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
