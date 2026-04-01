import Loader from '@/components/Loader';

export default function LoadingRoot() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans flex flex-col items-center justify-center p-4">
      <div className="relative">
        {/* Subtle background grid for blueprint feel */}
        <div 
          className="absolute inset--20 z-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            width: '600px',
            height: '600px',
            transform: 'translate(-50%, -50%)',
            left: '50%',
            top: '50%',
          }}
        />
        
        <div className="relative z-10 flex flex-col items-center">
          <Loader />
        </div>
      </div>
    </div>
  );
}
