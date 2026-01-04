import React from 'react';

export const GridContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    /* This creates the master 1px border grid and restricts the app width */
    <div className="min-h-screen bg-background grid-bg selection:bg-white selection:text-black">
      <div className="max-w-7xl mx-auto border-x border-border min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
};