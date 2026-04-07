import LoginForm from './LoginForm';

export const metadata = {
  title: "Admin Login",
};

export default async function AdminLoginPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ error?: string; step?: string }> 
}) {
  const { error, step } = await searchParams;

  return (
    <div className="h-screen overflow-hidden bg-zinc-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <LoginForm error={error} step={step} />
    </div>
  );
}
