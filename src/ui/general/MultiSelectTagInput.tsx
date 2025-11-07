import React from "react";
import { Label } from "@/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultiSelectTagInputProps {
  label: string;
  placeholder?: string;
  selectedItems: string[];
  availableItems: string[];
  onAdd: (item: string) => void;
  onRemove: (item: string) => void;
  emptyText?: string;
  className?: string;
  disabled?: boolean;
}

export function MultiSelectTagInput({
  label,
  placeholder = "+ Add",
  selectedItems,
  availableItems,
  onAdd,
  onRemove,
  emptyText = "No items added",
  className,
  disabled = false,
}: MultiSelectTagInputProps) {
  const filteredAvailable = availableItems.filter((item) => !selectedItems.includes(item));

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        {filteredAvailable.length > 0 && !disabled && (
          <Select value="" onValueChange={onAdd}>
            <SelectTrigger className="w-24 h-7 text-xs">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {filteredAvailable.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      <div className="flex flex-wrap gap-2 min-h-[32px] p-2 border rounded-md bg-background">
        {selectedItems.length > 0 ? (
          selectedItems.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded"
            >
              {item}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => onRemove(item)}
                  className="hover:text-destructive transition-colors"
                  aria-label={`Remove ${item}`}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </span>
          ))
        ) : (
          <span className="text-xs text-muted-foreground">{emptyText}</span>
        )}
      </div>
    </div>
  );
}
