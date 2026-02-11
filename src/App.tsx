import { useState } from 'react'
import { AppShell } from './components/AppShell'
import { Dashboard } from './components/Dashboard'
import { AddSubscriptionForm } from './components/AddSubscriptionForm'
import { storage } from './types/storage'
import type { Subscription } from './types/subscription'
import './index.css'

function App() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => storage.loadSubscriptions())
  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleAddSub = (newSub: Omit<Subscription, 'id'>) => {
    const subWithId: Subscription = {
      ...newSub,
      id: crypto.randomUUID()
    }
    const updated = [...subscriptions, subWithId]
    setSubscriptions(updated)
    storage.saveSubscriptions(updated)
  }

  return (
    <AppShell>
      <Dashboard 
        subscriptions={subscriptions} 
        onAddNew={() => setIsFormOpen(true)}
      />
      {isFormOpen && (
        <AddSubscriptionForm 
          onAdd={handleAddSub} 
          onClose={() => setIsFormOpen(false)} 
        />
      )}
    </AppShell>
  )
}

export default App
