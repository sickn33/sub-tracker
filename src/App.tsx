import { useState, useEffect } from 'react';
import { Layout } from './components/ui/Layout';
import { Display, Body, Mono } from './components/ui/Typography';
import { SubscriptionCard } from './components/ui/SubscriptionCard';
import { AddSubscriptionModal } from './components/ui/AddSubscriptionModal';
import { Plus } from 'lucide-react';
import { storage } from './types/storage';
import { calculateMonthlyTotal, type Subscription } from './types/subscription';
import './index.css';

function App() {
  // Initialize state lazily from storage to avoid useEffect sync issues
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => storage.loadSubscriptions());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);

  // Save to storage whenever subscriptions change
  useEffect(() => {
    storage.saveSubscriptions(subscriptions);
  }, [subscriptions]);

  const handleAddSubscription = (newSub: Omit<Subscription, 'id'>) => {
    if (editingSubscription) {
      setSubscriptions(prev => prev.map(sub => 
        sub.id === editingSubscription.id 
          ? { ...newSub, id: editingSubscription.id }
          : sub
      ));
      setEditingSubscription(null);
    } else {
      const subWithId: Subscription = {
        ...newSub,
        id: crypto.randomUUID()
      };
      setSubscriptions(prev => [...prev, subWithId]);
    }
    setIsModalOpen(false);
  };

  const handleEditSubscription = (sub: Subscription) => {
    setEditingSubscription(sub);
    setIsModalOpen(true);
  };

  const handleDeleteSubscription = (id: string) => {
    setSubscriptions(prev => prev.filter(sub => sub.id !== id));
  };

  const totalMonthly = calculateMonthlyTotal(subscriptions);

  return (
    <Layout>
      <div className="h-full flex flex-col">
        {/* Header Section */}
        <header className="px-4 py-8 md:px-8 border-b border-structural flex flex-col md:flex-row md:items-end justify-between gap-6 bg-paper relative z-20">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <Mono variant="label" className="border-signal text-signal bg-signal/5">System Active</Mono>
               <Mono variant="code" className="text-xs text-ink/40">V 1.1.0</Mono>
            </div>
            <Display variant="giant">SUBS_TRACKER</Display>
            <Body variant="lead" className="mt-4 max-w-xl">
              Centralized recurring expense monitoring system.
            </Body>
          </div>
          
          <div className="flex flex-col items-end gap-4">
            <div className="bg-ink text-paper p-6 min-w-[240px] border-l-4 border-signal">
                <Body variant="caption" className="text-structural mb-2">Total Monthly Commit</Body>
                <div className="flex items-baseline gap-2">
                <span className="text-structural font-mono text-lg">€</span>
                <Mono variant="code" className="text-4xl bg-transparent text-paper font-bold tracking-tighter">
                    {totalMonthly.toFixed(2)}
                </Mono>
                </div>
            </div>
            
            <button 
                onClick={() => setIsModalOpen(true)}
                className="group flex items-center gap-2 px-6 py-3 bg-paper border border-ink text-ink hover:bg-ink hover:text-paper transition-all uppercase font-mono text-sm tracking-wide"
            >
                <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                Input Data
            </button>
          </div>
        </header>

        {/* List Section */}
        <div className="flex-1 overflow-auto">
          {subscriptions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-ink/40">
                <Mono variant="code" className="mb-2">NO DATA FOUND</Mono>
                <Body variant="small">Initialize system by adding a subscription logic.</Body>
            </div>
          ) : (
            subscriptions.map((sub) => (
                <SubscriptionCard 
                    key={sub.id} 
                    id={sub.id}
                    name={sub.name}
                    price={sub.price}
                    currency="EUR" // Assuming EUR for simplicity based on existing types
                    cycle={sub.frequency === 'yearly' ? 'yearly' : 'monthly'}
                    nextPayment={sub.nextRenewal}
                    category={sub.category}
                    expirationDate={sub.expirationDate}
                    onDelete={handleDeleteSubscription}
                    onEdit={handleEditSubscription}
                />
            ))
          )}
          
          {/* Footer Line */}
          {subscriptions.length > 0 && (
             <div className="p-8 text-center border-b border-structural opacity-50">
                <Mono variant="code">--- END OF RECORD ---</Mono>
             </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <AddSubscriptionModal 
            onAdd={handleAddSubscription} 
            onClose={() => {
              setIsModalOpen(false);
              setEditingSubscription(null);
            }}
            initialData={editingSubscription}
        />
      )}
    </Layout>
  );
}

export default App;
