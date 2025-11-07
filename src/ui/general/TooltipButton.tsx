import * as React from "react";
import { Button, ButtonProps } from "@/ui/button";
import { TooltipWrapper } from "@/ui/general/TooltipWrapper";

interface TooltipButtonProps extends ButtonProps {
  tooltip: string;
  shortcut?: string;
  tooltipSide?: "top" | "right" | "bottom" | "left";
  tooltipAlign?: "start" | "center" | "end";
  tooltipDelay?: number;
  children: React.ReactNode;
}

const TooltipButton = React.forwardRef<HTMLButtonElement, TooltipButtonProps>(
  (
    {
      tooltip,
      shortcut,
      tooltipSide = "top",
      tooltipAlign = "center",
      tooltipDelay = 700,
      children,
      className,
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
        asChild={true}
        triggerClassName=""
      >
        <Button ref={ref} className={className} {...props}>
          {children}
        </Button>
      </TooltipWrapper>
    );
  }
);

TooltipButton.displayName = "TooltipButton";

export { TooltipButton, type TooltipButtonProps };
