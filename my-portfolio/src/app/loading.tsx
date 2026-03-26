export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        {/* Simple elegant pulse */}
        <div className="w-12 h-12 border-4 border-muted-foreground/20 border-t-foreground rounded-full animate-spin"></div>
        <p className="text-sm font-poppins text-muted-foreground uppercase tracking-[0.2em] animate-pulse">
          Loading
        </p>
      </div>
    </div>
  );
}
