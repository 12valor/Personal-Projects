import React from 'react';

export const GridContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background relative flex flex-col selection:bg-ytRed selection:text-white">
      
      {/* 1. THE GRID LAYER (Background Only) */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none fixed h-full w-full"></div>

      {/* 2. THE CONTENT LAYER (100% Opacity / Vivid) */}
      <div className="relative z-10 max-w-7xl mx-auto border-x border-border min-h-screen flex flex-col bg-background/50 backdrop-blur-[2px]">
        {children}
      </div>
      
    </div>
  );
};