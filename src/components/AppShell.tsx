import React, { type ElementType } from 'react';
import { LayoutDashboard, PlusCircle, Settings, LogOut, type LucideIcon } from 'lucide-react';
import { cn } from '../utils/cn';

export const SidebarItem = ({ icon: Icon, label, active, onClick }: { 
  icon: LucideIcon | ElementType, 
  label: string, 
  active?: boolean,
  onClick?: () => void 
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-all duration-200 cursor-pointer",
      active 
        ? "bg-white/20 text-white shadow-lg shadow-black/20" 
        : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
    )}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-[#0F172A] text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 p-6 flex flex-col gap-8 glass-card rounded-none border-y-0 border-l-0">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <LayoutDashboard size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">SubTracker</h1>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
          <SidebarItem icon={PlusCircle} label="Subscriptions" />
          <SidebarItem icon={Settings} label="Settings" />
        </nav>

        <div className="pt-6 border-t border-white/10">
          <SidebarItem icon={LogOut} label="Log Out" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 relative">
        {/* Background glow effects */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[100px] pointer-events-none rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[100px] pointer-events-none rounded-full" />
        
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
