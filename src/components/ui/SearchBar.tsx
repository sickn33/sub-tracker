
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="relative group w-full md:w-auto">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-ink/40 group-focus-within:text-ink transition-colors" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-10 pr-3 py-2 bg-paper border border-structural text-ink placeholder-ink/40 focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink transition-all font-mono text-sm"
        placeholder="Filter subscriptions..."
        aria-label="Filter subscriptions"
      />
    </div>
  );
};
