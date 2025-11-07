import * as React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/ui/tooltip";

interface TooltipWrapperProps {
  tooltip: string;
  shortcut?: string;
  tooltipSide?: "top" | "right" | "bottom" | "left";
  tooltipAlign?: "start" | "center" | "end";
  tooltipDelay?: number;
  children: React.ReactNode;
  triggerClassName?: string;
  asChild?: boolean;
}

const TooltipWrapper: React.FC<TooltipWrapperProps> = ({
  tooltip,
  shortcut,
  tooltipSide = "top",
  tooltipAlign = "center",
  tooltipDelay = 700,
  children,
  triggerClassName = "flex-1",
  asChild = true,
}) => {
  return (
    <TooltipProvider delayDuration={tooltipDelay}>
      <Tooltip>
        <TooltipTrigger className={triggerClassName} asChild={asChild}>
          {children}
        </TooltipTrigger>
        <TooltipContent side={tooltipSide} align={tooltipAlign}>
          <div className="flex items-center gap-2">
            <span>{tooltip}</span>
            {shortcut && (
              <kbd className="inline-flex items-center px-1.5 py-0.5 text-xs font-mono bg-muted text-gray rounded border">
                {shortcut}
              </kbd>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

TooltipWrapper.displayName = "TooltipWrapper";

export { TooltipWrapper, type TooltipWrapperProps };
