import React, { useRef, useState, useEffect } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { formatDate, parseDate, isValidDate } from '../../utils/date';

interface DatePickerProps {
  id: string;
  value: string; // DD/MM/YYYY or empty
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({ id, value, onChange, placeholder = "DD/MM/YYYY", className }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setInputValue(newVal);
    onChange(newVal);
    
    // Sync native picker if valid
    if (isValidDate(newVal) && fileInputRef.current) {
        fileInputRef.current.value = parseDate(newVal);
    }
  };

  const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
        const formatted = formatDate(e.target.value);
        setInputValue(formatted);
        onChange(formatted);
    }
  };

  const triggerNativePicker = () => {
    if (fileInputRef.current) {
        try {
            if ('showPicker' in HTMLInputElement.prototype) {
                fileInputRef.current.showPicker();
            } else {
                fileInputRef.current.focus();
                // fileInputRef.current.click(); // click() on hidden input doesn't always work for date buffers
            }
        } catch (err) {
            console.error("Picker error", err);
        }
    }
  };

  return (
    <div className={`relative flex items-center ${className}`}>
        <input 
            type="text"
            id={id}
            value={inputValue}
            onChange={handleTextChange}
            placeholder={placeholder}
            className="w-full bg-concrete border-b border-structural p-3 font-mono text-sm focus:outline-none focus:border-signal uppercase"
        />
        <button 
            type="button"
            onClick={triggerNativePicker}
            className="absolute right-3 text-ink/40 hover:text-signal transition-colors p-1"
            title="Open Calendar"
        >
            <CalendarIcon size={18} />
        </button>
        {/* Hidden Native Picker */}
        <input 
            type="date" 
            ref={fileInputRef}
            onChange={handleNativeChange}
            className="absolute bottom-0 left-0 w-0 h-0 opacity-0 pointer-events-none"
            tabIndex={-1}
        />
    </div>
  );
};
