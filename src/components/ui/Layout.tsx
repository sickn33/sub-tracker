import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-paper text-ink p-2 md:p-6 font-body selection:bg-signal selection:text-white">
      {/* Outer Frame */}
      <div className="border border-structural min-h-[calc(100vh-3rem)] relative bg-paper shadow-sm overflow-hidden">
        
        {/* Decorative Grid Lines */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
           {/* Vertical Line - Left Sidebar Area */}
           <div className="absolute left-[25%] top-0 bottom-0 w-px bg-structural/40 hidden lg:block"></div>
           {/* Horizontal Line - Header Split */}
           <div className="absolute top-24 md:top-32 left-0 right-0 h-px bg-structural/40"></div>
        </div>

        {/* Content Container */}
        <main className="relative z-10 h-full">
          {children}
        </main>
      </div>
    </div>
  );
};
