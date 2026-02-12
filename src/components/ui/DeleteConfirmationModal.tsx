import React from 'react';
import { Display, Body, Mono } from './Typography';
import { X, AlertTriangle } from 'lucide-react';
import type { Subscription } from '../../types/subscription';

interface DeleteConfirmationModalProps {
  subscription: Subscription;
  onConfirm: () => void;
  onClose: () => void;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ subscription, onConfirm, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/20 backdrop-blur-sm">
      <div className="bg-paper border-2 border-orange-500 w-full max-w-md shadow-2xl relative">
        {/* Header Bar */}
        <div className="bg-orange-500 text-paper p-4 flex justify-between items-center">
            <Mono variant="label" className="border-paper/40 text-paper flex items-center gap-2">
              <AlertTriangle size={16} />
              System Alert
            </Mono>
            <button onClick={onClose} className="hover:text-ink transition-colors" title="Close Modal">
                <X size={20} />
            </button>
        </div>

        {/* Content */}
        <div className="p-8">
            <Display as="h2" variant="medium" className="mb-4 text-orange-600">
              Confirm Deletion
            </Display>
            
            <Body variant="lead" className="mb-6">
              Are you sure you want to remove <span className="font-bold">{subscription.name}</span> from the tracking system?
            </Body>

            <Body variant="small" className="text-ink/60 mb-8">
              This action cannot be undone. The subscription data will be permanently erased from local storage.
            </Body>

            <div className="flex justify-end gap-4">
                <button 
                    onClick={onClose}
                    className="px-6 py-3 font-mono text-sm border border-structural hover:bg-concrete transition-colors"
                >
                    CANCEL
                </button>
                <button 
                    onClick={onConfirm}
                    className="px-6 py-3 bg-red-600 text-white font-mono text-sm hover:bg-red-700 transition-colors flex items-center gap-2 shadow-lg"
                >
                    CONFIRM DELETE
                </button>
            </div>
        </div>
        
        {/* Decor */}
        <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r border-b border-orange-500"></div>
        <div className="absolute -top-2 -left-2 w-4 h-4 border-l border-t border-orange-500"></div>
      </div>
    </div>
  );
};
