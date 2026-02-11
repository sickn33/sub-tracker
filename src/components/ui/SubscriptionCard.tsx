import React from 'react';
import { Display, Body, Mono } from './Typography';

interface SubscriptionProps {
  id: string; // Added ID for deletion
  name: string;
  price: number;
  currency: string;
  cycle: 'monthly' | 'yearly';
  nextPayment: string;
  category: string;
  onDelete?: (id: string) => void;
}

export const SubscriptionCard: React.FC<SubscriptionProps> = ({
  id,
  name,
  price,
  currency,
  cycle,
  nextPayment,
  category,
  onDelete
}) => {
  return (
    <div className="group relative border-b border-structural p-4 md:px-6 hover:bg-concrete/50 transition-colors duration-200">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left: Identity */}
        <div className="flex items-start md:items-center gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 border border-structural bg-paper flex items-center justify-center text-xl font-display font-bold text-ink group-hover:bg-signal group-hover:text-white transition-colors duration-300">
            {name.charAt(0)}
          </div>
          <div>
            <Display as="h3" variant="medium" className="text-xl md:text-2xl">{name}</Display>
            <div className="flex items-center gap-2 mt-1">
               <Mono variant="label" className="inline-block">{category}</Mono>
               {onDelete && (
                  <button 
                    onClick={() => onDelete(id)}
                    className="md:hidden text-xs font-mono text-red-500 hover:underline uppercase"
                  >
                    [DELETE]
                  </button>
               )}
            </div>
          </div>
        </div>

        {/* Right: Technical Data */}
        <div className="flex items-end md:items-center justify-between md:justify-end gap-2 md:gap-12 min-w-[300px]">
           <div className="text-right">
              <Body variant="caption" className="block mb-1">Next Billing</Body>
              <Mono variant="code" className="bg-transparent text-ink/70">{nextPayment}</Mono>
           </div>
           
           <div className="text-right min-w-[100px] flex flex-col items-end">
              <div className="flex items-baseline justify-end gap-1">
                <span className="font-mono text-sm text-ink/50">{currency}</span>
                <Display as="span" variant="large" className="text-3xl tracking-tighter tabular-nums">
                  {price.toFixed(2)}
                </Display>
              </div>
              <div className="flex items-center gap-3">
                 <Body variant="caption" className="text-right text-signal">/{cycle}</Body>
                 {onDelete && (
                    <button 
                      onClick={() => onDelete(id)}
                      className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity text-xs font-mono text-red-500 hover:text-red-600 uppercase"
                      title="Remove Entry"
                    >
                      [DELETE]
                    </button>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
