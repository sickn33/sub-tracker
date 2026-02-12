import { useState } from 'react';
import { Layout } from './components/ui/Layout';
import { Display, Body, Mono } from './components/ui/Typography';
import { DraggableSubscriptionCard } from './components/ui/DraggableSubscriptionCard';
import { AddSubscriptionModal } from './components/ui/AddSubscriptionModal';
import { DeleteConfirmationModal } from './components/ui/DeleteConfirmationModal';
import { Plus } from 'lucide-react';
import { Reorder } from 'framer-motion';
import { useSubscriptions } from './hooks/useSubscriptions';
import type { Subscription } from './types/subscription';
import './index.css';

function App() {
  const { 
    subscriptions, 
    setSubscriptions, 
    addSubscription, 
    updateSubscription, 
    removeSubscription, 
    totalMonthly 
  } = useSubscriptions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [deletingSubscription, setDeletingSubscription] = useState<Subscription | null>(null);

  const handleAddSubscription = (newSub: Omit<Subscription, 'id'>) => {
    if (editingSubscription) {
      updateSubscription(editingSubscription.id, newSub);
      setEditingSubscription(null);
    } else {
      addSubscription(newSub);
    }
    setIsModalOpen(false);
  };

  const handleEditSubscription = (sub: Subscription) => {
    setEditingSubscription(sub);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    const sub = subscriptions.find(s => s.id === id);
    if (sub) {
      setDeletingSubscription(sub);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingSubscription) {
      removeSubscription(deletingSubscription.id);
      setDeletingSubscription(null);
    }
  };

  return (
    <Layout>
      <div className="h-full flex flex-col">
        {/* Header Section */}
        <header className="px-4 py-8 md:px-8 border-b border-structural flex flex-col md:flex-row md:items-end justify-between gap-6 bg-paper relative z-20">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <Mono variant="label" className="border-signal text-signal bg-signal/5">System Active</Mono>
               <Mono variant="code" className="text-xs text-ink/40">V 1.2.0</Mono>
            </div>
            <Display variant="giant">SUB_TRACKER</Display>
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
            <Reorder.Group axis="y" values={subscriptions} onReorder={setSubscriptions} className="flex flex-col">
                {subscriptions.map((sub) => (
                    <DraggableSubscriptionCard 
                        key={sub.id} 
                        sub={sub}
                        onDelete={handleDeleteClick}
                        onEdit={handleEditSubscription}
                    />
                ))}
            </Reorder.Group>
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

      {deletingSubscription && (
        <DeleteConfirmationModal
          subscription={deletingSubscription}
          onConfirm={handleConfirmDelete}
          onClose={() => setDeletingSubscription(null)}
        />
      )}
    </Layout>
  );
}

export default App;
