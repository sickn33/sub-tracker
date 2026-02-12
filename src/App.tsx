import { useState, useEffect } from 'react';
import { Layout } from './components/ui/Layout';
import { Display, Body, Mono } from './components/ui/Typography';
import { DraggableSubscriptionCard } from './components/ui/DraggableSubscriptionCard';
import { AddSubscriptionModal } from './components/ui/AddSubscriptionModal';
import { DeleteConfirmationModal } from './components/ui/DeleteConfirmationModal';
import { MetricsDashboard } from './components/ui/MetricsDashboard';
import { Reorder } from 'framer-motion';
import { useSubscriptions } from './hooks/useSubscriptions';
import type { Subscription } from './types/subscription';
import { downloadICS } from './utils/calendar';
import { checkUpcomingRenewals, requestNotificationPermission } from './utils/notifications';
import { Calendar, Plus, Settings } from 'lucide-react';
import { SearchBar } from './components/ui/SearchBar';
import { SettingsModal } from './components/ui/SettingsModal';
import { useSettings } from './hooks/useSettings';
import { useLocalBackup } from './hooks/useLocalBackup';
import './index.css';

function App() {
  const { settings, updateCurrency } = useSettings();
  const { 
    fileHandle, 
    lastSaved, 
    error: backupError, 
    connectBackupFile, 
    saveToBackup 
  } = useLocalBackup();
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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

  useEffect(() => {
    // Check for renewals on load
    if (subscriptions.length > 0) {
        checkUpcomingRenewals(subscriptions);
    }
  }, [subscriptions]);

  // Auto-save when subscriptions change
  useEffect(() => {
    if (fileHandle && subscriptions.length > 0) {
      saveToBackup(subscriptions);
    }
  }, [subscriptions, fileHandle, saveToBackup]);

  const handleInteraction = () => {
    // Request permission on user interaction
    requestNotificationPermission();
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(subscriptions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'sub-tracker-backup.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportJSON = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
            // Basic validation could go here
            setSubscriptions(json);
            setIsSettingsOpen(false);
        } else {
            alert('Invalid backup file format');
        }
      } catch (e) {
        console.error(e);
        alert('Failed to parse JSON');
      }
    };
    reader.readAsText(file);
  };

  const filteredSubscriptions = subscriptions.filter(sub => 
    sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="h-full flex flex-col" onClick={handleInteraction}>
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
          
          <div className="flex flex-col items-end gap-4 w-full md:w-auto">
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <SearchBar value={searchTerm} onChange={setSearchTerm} />
                
                <button 
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-3 bg-paper border border-ink text-ink hover:bg-ink hover:text-paper transition-all"
                  title="Open Settings"
                >
                  <Settings size={20} />
                </button>
            </div>

            <div className="bg-ink text-paper p-6 min-w-[240px] border-l-4 border-signal w-full md:w-auto">
                <Body variant="caption" className="text-structural mb-2">Total Monthly Commit</Body>
                <div className="flex items-baseline gap-2">
                <span className="text-structural font-mono text-lg">{settings.currency}</span>
                <Mono variant="code" className="text-4xl bg-transparent text-paper font-bold tracking-tighter">
                    {totalMonthly.toFixed(2)}
                </Mono>
                </div>
            </div>
            
            <div className="flex gap-3">
                <button 
                    onClick={() => downloadICS(subscriptions)}
                    title="Export to Calendar"
                    className="group flex items-center justify-center w-12 h-12 bg-paper border border-ink text-ink hover:bg-ink hover:text-paper transition-all"
                >
                    <Calendar size={20} />
                </button>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="group flex items-center gap-2 px-6 py-3 bg-paper border border-ink text-ink hover:bg-ink hover:text-paper transition-all uppercase font-mono text-sm tracking-wide"
                >
                    <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                    Input Data
                </button>
            </div>
          </div>
        </header>

        {/* Metrics Section */}
        {subscriptions.length > 0 && <MetricsDashboard subscriptions={subscriptions} currency={settings.currency} />}

        {/* List Section */}
        <div className="flex-1 overflow-auto">
          {filteredSubscriptions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-ink/40">
                <Mono variant="code" className="mb-2">NO DATA FOUND</Mono>
                <Body variant="small">Initialize system by adding a subscription logic.</Body>
            </div>
          ) : (
            <Reorder.Group axis="y" values={subscriptions} onReorder={setSubscriptions} className="flex flex-col">
                {filteredSubscriptions.map((sub) => (
                    <DraggableSubscriptionCard 
                        key={sub.id} 
                        sub={sub}
                        currency={settings.currency}
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
            currency={settings.currency}
        />
      )}

      {deletingSubscription && (
        <DeleteConfirmationModal
          subscription={deletingSubscription}
          onConfirm={handleConfirmDelete}
          onClose={() => setDeletingSubscription(null)}
        />
      )}
      {isSettingsOpen && (
        <SettingsModal 
            onClose={() => setIsSettingsOpen(false)}
            currency={settings.currency}
            onCurrencyChange={updateCurrency}
            backupConnected={!!fileHandle}
            onConnectBackup={connectBackupFile}
            lastBackupTime={lastSaved}
            backupError={backupError}
            onExport={handleExportJSON}
            onImport={handleImportJSON}
        />
      )}
    </Layout>
  );
}

export default App;
