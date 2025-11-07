import * as React from "react";
import { TabsTrigger } from "@/ui/tabs";
import { TooltipWrapper } from "@/ui/general/TooltipWrapper";
import { cn } from "@/lib/utils";

interface TooltipTabsTriggerProps extends React.ComponentPropsWithoutRef<typeof TabsTrigger> {
  tooltip: string;
  shortcut?: string;
  tooltipSide?: "top" | "right" | "bottom" | "left";
  tooltipAlign?: "start" | "center" | "end";
  tooltipDelay?: number;
  selected?: boolean;
  children: React.ReactNode;
}

const TooltipTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsTrigger>,
  TooltipTabsTriggerProps & { testid: string }
>(
  (
    {
      tooltip,
      shortcut,
      tooltipSide = "bottom",
      tooltipAlign = "center",
      tooltipDelay = 700,
      className,
      children,
      testid,
      selected,
      ...props
    },
    ref
  ) => {
    return (
      <TooltipWrapper
        tooltip={tooltip}
        shortcut={shortcut}
        tooltipSide={tooltipSide}
        tooltipAlign={tooltipAlign}
        tooltipDelay={tooltipDelay}
        triggerClassName=""
      >
        <TabsTrigger
          ref={ref}
          className={cn(
            "flex flex-1 w-full justify-center items-center bg-card data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
            className
          )}
          data-testid={testid}
          {...props}
          // Force background and text color based on selected prop, NOT GOOD BUT NECESSARY
          // DIDN'T FIND A BETTER WAY TO OVERRIDE TABS TRIGGER STYLES WITH TAILWIND
          style={{
            backgroundColor: selected ? "hsl(var(--primary))" : "hsl(var(--card))",
            color: selected ? "hsl(var(--primary-foreground))" : "inherit",
          }}
        >
          {children}
        </TabsTrigger>
      </TooltipWrapper>
    );
  }
);

TooltipTabsTrigger.displayName = "TooltipTabsTrigger";

export { TooltipTabsTrigger, type TooltipTabsTriggerProps };
