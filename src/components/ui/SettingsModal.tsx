
import { X, Download, Upload, Save, AlertCircle, Check } from 'lucide-react';
import { Mono, Display, Body } from './Typography';
import { type Currency } from '../../hooks/useSettings';

interface SettingsModalProps {
  onClose: () => void;
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  backupConnected: boolean;
  onConnectBackup: () => void;
  lastBackupTime: Date | null;
  backupError: string | null;
  onExport: () => void;
  onImport: (file: File) => void;
}

const CURRENCIES: Currency[] = ['€', '$', '£', '¥', 'CHF'];

export const SettingsModal = ({
  onClose,
  currency,
  onCurrencyChange,
  backupConnected,
  onConnectBackup,
  lastBackupTime,
  backupError,
  onExport,
  onImport
}: SettingsModalProps) => {

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/20 backdrop-blur-sm">
      <div className="bg-paper border border-ink w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-structural bg-concrete/10">
          <Display variant="large">System Settings</Display>
          <button onClick={onClose} className="text-ink/60 hover:text-ink transition-colors" title="Close Settings">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-8">
            
            {/* Section: Appearance */}
            <section>
                <Mono variant="label" className="mb-4 text-ink/40 block">Localization</Mono>
                <div className="flex items-center justify-between">
                    <Body variant="lead">Display Currency</Body>
                    <div className="flex border border-ink">
                        {CURRENCIES.map(c => (
                            <button
                                key={c}
                                onClick={() => onCurrencyChange(c)}
                                className={`w-10 h-10 flex items-center justify-center font-mono transition-colors ${
                                    currency === c 
                                    ? 'bg-ink text-paper' 
                                    : 'bg-paper text-ink hover:bg-concrete'
                                }`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <hr className="border-structural" />

            {/* Section: Data Management */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <Mono variant="label" className="text-ink/40">Data Persistence</Mono>
                    {backupConnected && (
                        <div className="flex items-center gap-2 text-signal text-xs font-mono">
                            <div className="w-2 h-2 bg-signal animate-pulse rounded-full" />
                            AUTO-SYNC ACTIVE
                        </div>
                    )}
                </div>

                {/* Auto-Backup Card */}
                <div className={`border ${backupConnected ? 'border-signal bg-signal/5' : 'border-structural bg-concrete/10'} p-4 mb-4 transition-all`}>
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <div className="font-bold flex items-center gap-2">
                                <Save size={16} />
                                Automatic Backup
                            </div>
                            <div className="text-sm text-ink/60 mt-1 max-w-xs">
                                {backupConnected 
                                    ? `Syncing changes to local file.` 
                                    : "Connect a local JSON file to enable auto-saving on every change."
                                }
                            </div>
                        </div>
                        <button
                            onClick={onConnectBackup}
                            disabled={backupConnected}
                            className={`px-3 py-1 text-xs font-mono border ${
                                backupConnected 
                                ? 'border-signal text-signal opacity-50 cursor-default' 
                                : 'border-ink text-ink hover:bg-ink hover:text-paper'
                            }`}
                        >
                            {backupConnected ? 'CONNECTED' : 'CONNECT FILE'}
                        </button>
                    </div>
                    
                    {lastBackupTime && (
                        <div className="mt-2 text-xs font-mono text-ink/40 flex items-center gap-1">
                            <Check size={12} />
                            Last saved: {lastBackupTime.toLocaleTimeString()}
                        </div>
                    )}
                    
                    {backupError && (
                        <div className="mt-2 text-xs font-mono text-red-500 flex items-center gap-1">
                            <AlertCircle size={12} />
                            {backupError}
                        </div>
                    )}
                </div>

                {/* Manual Actions */}
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={onExport}
                        className="flex items-center justify-center gap-2 p-3 border border-structural hover:border-ink hover:bg-concrete/20 transition-all"
                    >
                        <Download size={16} />
                        <span className="text-sm font-mono">Export JSON</span>
                    </button>
                    
                    <label className="flex items-center justify-center gap-2 p-3 border border-structural hover:border-ink hover:bg-concrete/20 transition-all cursor-pointer">
                        <Upload size={16} />
                        <span className="text-sm font-mono">Import JSON</span>
                        <input 
                            type="file" 
                            accept=".json" 
                            onChange={handleFileChange} 
                            className="hidden" 
                        />
                    </label>
                </div>
            </section>
        </div>

      </div>
    </div>
  );
};
