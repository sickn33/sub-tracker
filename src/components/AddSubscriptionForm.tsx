import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import type { Subscription, BillingFrequency } from '../types/subscription';

interface AddSubscriptionFormProps {
  onAdd: (sub: Omit<Subscription, 'id'>) => void;
  onClose: () => void;
}

export const AddSubscriptionForm = ({ onAdd, onClose }: AddSubscriptionFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    frequency: 'monthly' as BillingFrequency,
    category: 'Entertainment',
    nextRenewal: new Date().toISOString().split('T')[0],
    expirationDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    onAdd({
      name: formData.name,
      price: parseFloat(formData.price),
      frequency: formData.frequency,
      category: formData.category,
      nextRenewal: formData.nextRenewal,
      expirationDate: formData.expirationDate || undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="glass-card w-full max-w-md p-8 shadow-2xl relative animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          title="Close form"
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X size={24} />
        </button>

        <h3 className="text-2xl font-bold mb-6">Add Subscription</h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Name</label>
            <input 
              required
              type="text" 
              placeholder="e.g. Netflix, ChatGPT"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Price (€)</label>
              <input 
                required
                type="number" 
                step="0.01"
                placeholder="0.00"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="frequency" className="text-sm font-medium text-slate-300">Frequency</label>
              <select 
                id="frequency"
                title="Billing Frequency"
                className="w-full bg-[#1e293b] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
                value={formData.frequency}
                onChange={e => setFormData({ ...formData, frequency: e.target.value as BillingFrequency })}
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium text-slate-300">Category</label>
            <select 
              id="category"
              title="Subscription Category"
              className="w-full bg-[#1e293b] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
            >
              <option>Entertainment</option>
              <option>AI & Tools</option>
              <option>Streaming</option>
              <option>Food & Drink</option>
              <option>Work</option>
              <option>Health</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="renewalDate" className="text-sm font-medium text-slate-300">Next Renewal</label>
              <input 
                id="renewalDate"
                title="Next Renewal Date"
                type="date" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all [color-scheme:dark]"
                value={formData.nextRenewal}
                onChange={e => setFormData({ ...formData, nextRenewal: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="expirationDate" className="text-sm font-medium text-slate-300">Expires (Optional)</label>
              <input 
                id="expirationDate"
                title="Expiration Date"
                type="date" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all [color-scheme:dark]"
                value={formData.expirationDate}
                onChange={e => setFormData({ ...formData, expirationDate: e.target.value })}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Save size={20} />
            Save Subscription
          </button>
        </form>
      </div>
    </div>
  );
};
