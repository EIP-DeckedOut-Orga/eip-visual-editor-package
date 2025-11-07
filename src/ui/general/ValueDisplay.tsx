import React from "react";
import { Label } from "@/ui/label";
import { Button } from "@/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ValueDisplayProps {
  label: string;
  value?: string | null;
  emptyText?: string;
  onClear?: () => void;
  showClearButton?: boolean;
  className?: string;
  helpText?: string;
}

export function ValueDisplay({
  label,
  value,
  emptyText = "Not set",
  onClear,
  showClearButton = true,
  className,
  helpText,
}: ValueDisplayProps) {
  const hasValue = value !== undefined && value !== null && value !== "";
  const shouldShowClear = showClearButton && hasValue && onClear;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        {shouldShowClear && (
          <Button variant="ghost" size="sm" className="h-6 px-2" onClick={onClear}>
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>
      <div className="px-3 py-2 border rounded-md bg-muted/30 text-sm">
        {hasValue ? (
          <span className="text-foreground">{value}</span>
        ) : (
          <span className="text-muted-foreground italic">{emptyText}</span>
        )}
      </div>
      {helpText && <p className="text-xs text-muted-foreground">{helpText}</p>}
    </div>
  );
}
