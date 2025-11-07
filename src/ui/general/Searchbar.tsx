import React from 'react';
import { Input } from '@/ui/input';
import { SearchIcon, X } from 'lucide-react';
import { Button } from '@/ui/button';
import { cn } from '@/lib/utils';

interface SearchbarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  onClear?: () => void;
  showClearButton?: boolean;
}

export function Searchbar({
  value,
  onChange,
  placeholder = "Search...",
  className,
  disabled = false,
  onClear,
  showClearButton = true,
}: SearchbarProps) {
  const handleClear = () => {
    onChange('');
    onClear?.();
  };

  return (
    <div className={cn("relative flex items-center", className)}>
      <SearchIcon className="absolute left-3 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "pl-10",
          showClearButton && value && "pr-10"
        )}
      />
      {showClearButton && value && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-1 h-7 w-7 p-0 hover:bg-transparent"
          onClick={handleClear}
          disabled={disabled}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
