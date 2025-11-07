import React from "react";
import { Label } from "@/ui/label";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  children: React.ReactNode;
}

/**
 * FormField - Wrapper for form inputs with consistent label styling
 * Reduces repetition of flex-col gap-2 + Label pattern
 */
export function FormField({
  label,
  htmlFor,
  required = false,
  className,
  labelClassName,
  children,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label
        htmlFor={htmlFor}
        className={cn("text-xs text-muted-foreground", labelClassName)}
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {children}
    </div>
  );
}
