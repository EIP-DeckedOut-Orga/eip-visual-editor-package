import React from "react";
import { Label } from "@/ui/label";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  className?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * SectionHeader - Consistent section title with optional action button
 * Used for organizing form sections
 */
export function SectionHeader({
  title,
  className,
  action,
  children,
}: SectionHeaderProps) {
  if (action || children) {
    return (
      <div className={cn("flex items-center justify-between", className)}>
        <Label className="text-sm font-medium">{title}</Label>
        {action || children}
      </div>
    );
  }

  return <Label className={cn("text-sm font-medium", className)}>{title}</Label>;
}
