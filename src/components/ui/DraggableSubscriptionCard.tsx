import React from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { SubscriptionCard } from './SubscriptionCard';
import type { Subscription } from '../../types/subscription';

interface DraggableSubscriptionCardProps {
  sub: Subscription;
  onDelete: (id: string) => void;
  onEdit: (sub: Subscription) => void;
}

export const DraggableSubscriptionCard: React.FC<DraggableSubscriptionCardProps> = ({
  sub,
  onDelete,
  onEdit
}) => {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={sub}
      dragListener={false}
      dragControls={dragControls}
      className="bg-paper" // Ensure background is opaque for dragging
    >
      <SubscriptionCard 
        id={sub.id}
        name={sub.name}
        price={sub.price}
        currency="EUR" // Assuming EUR from App.tsx context
        cycle={sub.frequency === 'yearly' ? 'yearly' : 'monthly'}
        nextPayment={sub.nextRenewal || ''} // Handle optional logic here or in child
        category={sub.category}
        expirationDate={sub.expirationDate}
        onDelete={onDelete}
        onEdit={onEdit}
        dragHandleProps={{
             onPointerDown: (e) => dragControls.start(e) 
        }}
      />
    </Reorder.Item>
  );
};
