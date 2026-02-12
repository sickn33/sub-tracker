import { useMemo } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
} from 'recharts';
import { type Subscription } from '../../types/subscription';
import { calculateCostPerMonth } from '../../utils/billing';
import { Mono } from './Typography';

interface MetricsDashboardProps {
  subscriptions: Subscription[];
  currency: string;
}

const COLORS = ['#222222', '#555555', '#888888', '#aaaaaa', '#cccccc', '#eeeeee'];

interface TooltipProps {
    active?: boolean;
    payload?: Array<{
        payload: {
            name: string;
            value: number;
        };
        value: number;
    }>;
    currency: string;
}

const CustomTooltip = ({ active, payload, currency }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-ink text-paper p-3 border border-structural shadow-xl">
        <Mono variant="code" className="text-xs mb-1 block opacity-70">
            {payload[0].payload.name}
        </Mono>
        <div className="flex items-baseline gap-1">
            <span className="font-mono text-xs">{currency}</span>
            <span className="font-mono text-lg font-bold">{payload[0].value.toFixed(2)}</span>
        </div>
      </div>
    );
  }
  return null;
};

export const MetricsDashboard = ({ subscriptions, currency }: MetricsDashboardProps) => {
  
  const categoryData = useMemo(() => {
    const categories: Record<string, number> = {};
    subscriptions.forEach(sub => {
      const cost = calculateCostPerMonth(sub.price, sub.frequency);
      const cat = (sub.category || 'UNCATEGORIZED').toUpperCase();
      categories[cat] = (categories[cat] || 0) + cost;
    });

    return Object.entries(categories)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [subscriptions]);

  const topExpensesData = useMemo(() => {
    return [...subscriptions]
      .sort((a, b) => {
         const costA = calculateCostPerMonth(a.price, a.frequency);
         const costB = calculateCostPerMonth(b.price, b.frequency);
         return costB - costA;
      })
      .slice(0, 5)
      .map(sub => ({
        name: sub.name,
        value: calculateCostPerMonth(sub.price, sub.frequency)
      }));
  }, [subscriptions]);

  if (subscriptions.length === 0) return null;

  return (
    <div className="px-4 md:px-8 py-6 border-b border-structural bg-concrete/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            
            {/* Category Breakdown */}
            <div className="h-64 flex flex-col">
                <Mono variant="label" className="mb-4 text-ink/60 block">Category Distribution</Mono>
                <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={2}
                                dataKey="value"
                                stroke="none"
                            >
                                {categoryData.map((_entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip currency={currency} />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                {/* Legend */}
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 justify-center">
                    {categoryData.slice(0, 4).map((entry, index) => (
                        <div key={entry.name} className="flex items-center gap-2">
                            <div 
                                className={`w-2 h-2 bg-[${COLORS[index % COLORS.length]}]`}
                                style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                            />
                            <Mono variant="code" className="text-[10px] text-ink/60">{entry.name}</Mono>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Expenses */}
            <div className="h-64 flex flex-col">
                 <Mono variant="label" className="mb-4 text-ink/60 block">Top Expenses (Monthly Impact)</Mono>
                 <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={topExpensesData}>
                            <XAxis 
                                dataKey="name" 
                                tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#888' }} 
                                axisLine={false}
                                tickLine={false}
                                interval={0}
                                tickFormatter={(val) => val.slice(0, 3)} // Truncate for style
                            />
                            <Tooltip content={<CustomTooltip currency={currency} />} cursor={{fill: 'transparent'}} />
                            <Bar dataKey="value" fill="#222">
                                {topExpensesData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={index === 0 ? '#000' : '#666'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                 </div>
            </div>

        </div>
    </div>
  );
};
