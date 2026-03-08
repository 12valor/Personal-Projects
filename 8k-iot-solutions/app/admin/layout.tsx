export default function AdminLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans">
      <div className="h-[90px] md:h-[110px]" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {children}
      </main>
    </div>
  );
}
