import React, { useState } from 'react';
import { Display, Body, Mono } from './Typography';
import { X, Check } from 'lucide-react';
import type { Subscription, BillingFrequency } from '../../types/subscription';
import { formatDate, parseDate, isValidDate } from '../../utils/date';

interface AddSubscriptionModalProps {
  onAdd: (sub: Omit<Subscription, 'id'>) => void;
  onClose: () => void;
  initialData?: Subscription | null;
}

export const AddSubscriptionModal: React.FC<AddSubscriptionModalProps> = ({ onAdd, onClose, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    price: initialData?.price.toString() || '',
    frequency: (initialData?.frequency || 'monthly') as BillingFrequency,
    category: initialData?.category || 'Entertainment',
    nextRenewal: initialData ? formatDate(initialData.nextRenewal) : formatDate(new Date().toISOString().split('T')[0]),
    expirationDate: initialData?.expirationDate ? formatDate(initialData.expirationDate) : ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    // Validate dates if present
    if (!isValidDate(formData.nextRenewal)) {
      alert('Please enter a valid renewal date (DD/MM/YYYY)');
      return;
    }
    if (formData.expirationDate && !isValidDate(formData.expirationDate)) {
       alert('Please enter a valid expiration date (DD/MM/YYYY)');
       return;
    }

    onAdd({
      name: formData.name,
      price: parseFloat(formData.price),
      frequency: formData.frequency,
      category: formData.category,
      nextRenewal: parseDate(formData.nextRenewal),
      expirationDate: formData.expirationDate ? parseDate(formData.expirationDate) : undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/20 backdrop-blur-sm">
      <div className="bg-paper border-2 border-structural w-full max-w-lg shadow-2xl relative">
        {/* Header Bar */}
        <div className="bg-ink text-paper p-4 flex justify-between items-center">
            <Mono variant="label" className="border-paper/40 text-paper">System Input</Mono>
            <button onClick={onClose} className="hover:text-signal transition-colors" title="Close Modal">
                <X size={20} />
            </button>
        </div>


        {/* Form Content */}
        <div className="p-8">
            <Display as="h2" variant="medium" className="mb-6">
              {initialData ? 'Edit Subscription' : 'New Subscription Entry'}
            </Display>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="space-y-2">
                    <label htmlFor="sub-name" className="block">
                        <Body variant="caption" className="text-ink/60">Service Identity</Body>
                    </label>
                    <input 
                        id="sub-name"
                        className="w-full bg-concrete border-b border-structural p-3 font-display text-xl focus:outline-none focus:border-signal transition-colors placeholder:text-ink/20"
                        placeholder="NETFLIX"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value.toUpperCase()})}
                        autoFocus
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                         <label htmlFor="sub-price" className="block">
                             <Body variant="caption" className="text-ink/60">Cost Impact</Body>
                         </label>
                         <div className="relative">
                            <span className="absolute left-3 top-3 font-mono text-ink/40">€</span>
                            <input 
                                id="sub-price"
                                type="number"
                                step="0.01"
                                className="w-full bg-concrete border-b border-structural p-3 pl-8 font-mono text-lg focus:outline-none focus:border-signal transition-colors"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={e => setFormData({...formData, price: e.target.value})}
                            />
                         </div>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="sub-frequency" className="block">
                            <Body variant="caption" className="text-ink/60">Billing Cycle</Body>
                        </label>
                        <select 
                            id="sub-frequency"
                            title="Billing Cycle"
                            className="w-full bg-concrete border-b border-structural p-3 font-mono text-sm focus:outline-none focus:border-signal"
                            value={formData.frequency}
                            onChange={e => setFormData({...formData, frequency: e.target.value as BillingFrequency})}
                        >
                            <option value="monthly">MONTHLY</option>
                            <option value="yearly">YEARLY</option>
                            <option value="weekly">WEEKLY</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                     <label htmlFor="sub-renewal" className="block">
                        <Body variant="caption" className="text-ink/60">Initial Renewal</Body>
                     </label>
                     <input 
                        id="sub-renewal"
                        title="Initial Renewal Date"
                        type="text"
                        placeholder="DD/MM/YYYY"
                        className="w-full bg-concrete border-b border-structural p-3 font-mono text-sm focus:outline-none focus:border-signal uppercase"
                        value={formData.nextRenewal}
                        onChange={e => setFormData({...formData, nextRenewal: e.target.value})}
                     />
                </div>

                <div className="space-y-2">
                     <label htmlFor="sub-expires" className="block">
                        <Body variant="caption" className="text-ink/60">Expiration Date (Optional)</Body>
                     </label>
                     <input 
                        id="sub-expires"
                        title="Expiration Date"
                        type="text"
                        placeholder="DD/MM/YYYY"
                        className="w-full bg-concrete border-b border-structural p-3 font-mono text-sm focus:outline-none focus:border-signal uppercase"
                        value={formData.expirationDate}
                        onChange={e => setFormData({...formData, expirationDate: e.target.value})}
                     />
                </div>

                <div className="pt-4 flex justify-end gap-4">
                    <button 
                        type="button" 
                        onClick={onClose}
                        className="px-6 py-3 font-mono text-sm border border-structural hover:bg-concrete transition-colors"
                    >
                        CANCEL
                    </button>
                    <button 
                        type="submit"
                        className="px-6 py-3 bg-ink text-paper font-mono text-sm hover:bg-signal transition-colors flex items-center gap-2"
                    >
                        <Check size={16} />
                        {initialData ? 'UPDATE ENTRY' : 'CONFIRM ENTRY'}
                    </button>
                </div>
            </form>
        </div>
        
        {/* Decor */}
        <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r border-b border-structural"></div>
        <div className="absolute -top-2 -left-2 w-4 h-4 border-l border-t border-structural"></div>
      </div>
    </div>
  );
};
