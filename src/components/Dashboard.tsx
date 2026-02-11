import type { Subscription } from '../types/subscription';
import { calculateMonthlyTotal } from '../types/subscription';
import { CreditCard, TrendingUp, Calendar, Hash } from 'lucide-react';
import { cn } from './AppShell';

const StatCard = ({ label, value, icon: Icon, color }: {
  label: string,
  value: string,
  icon: any,
  color: string
}) => (
  <div className="glass-card p-6 flex items-center gap-4 hover:scale-[1.02] transition-transform duration-200">
    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shadow-lg", color)}>
      <Icon size={24} className="text-white" />
    </div>
    <div>
      <p className="text-slate-400 text-sm font-medium">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

interface DashboardProps {
  subscriptions: Subscription[];
  onAddNew: () => void;
}

export const Dashboard = ({ subscriptions, onAddNew }: DashboardProps) => {
  const monthlyTotal = calculateMonthlyTotal(subscriptions);
  const yearlyTotal = monthlyTotal * 12;

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
        <p className="text-slate-400 mt-1">Track and manage your active subscriptions.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Monthly Spend" 
          value={`€${monthlyTotal.toFixed(2)}`} 
          icon={TrendingUp} 
          color="bg-emerald-500 shadow-emerald-500/20"
        />
        <StatCard 
          label="Yearly Spend" 
          value={`€${yearlyTotal.toFixed(2)}`} 
          icon={CreditCard} 
          color="bg-blue-500 shadow-blue-500/20"
        />
        <StatCard 
          label="Active Subs" 
          value={subscriptions.length.toString()} 
          icon={Hash} 
          color="bg-purple-500 shadow-purple-500/20"
        />
        <StatCard 
          label="Next Renewal" 
          value="Mar 24" 
          icon={Calendar} 
          color="bg-amber-500 shadow-amber-500/20"
        />
      </div>

      {/* Subscription List Section */}
      <section className="mt-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Your Subscriptions</h3>
          <button 
            onClick={onAddNew}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer"
          >
            Add New
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptions.length === 0 ? (
            <div className="col-span-full py-12 text-center glass-card border-dashed">
              <p className="text-slate-400">No subscriptions yet. Click "Add New" to get started.</p>
            </div>
          ) : (
            subscriptions.map(sub => (
              <div key={sub.id} className="glass-card p-6 flex flex-col gap-4 border-l-4 border-l-blue-500 hover:translate-x-1 transition-transform">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-lg">{sub.name}</h4>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-slate-800 text-slate-300">
                      {sub.category}
                    </span>
                  </div>
                  <p className="font-bold text-xl text-blue-400">€{sub.price}</p>
                </div>
                
                <div className="flex items-center justify-between text-sm text-slate-400 mt-2">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>Next: {sub.nextRenewal}</span>
                  </div>
                  <span className="capitalize">{sub.frequency}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};
