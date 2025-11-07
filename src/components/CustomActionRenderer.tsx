import React from "react";
import { Label } from "@/ui/label";
import { Input } from "@/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { Switch } from "@/ui/switch";
import { Separator } from "@/ui/separator";
import { TooltipButton } from "@/ui/general/TooltipButton";
import { Plus } from "lucide-react";
import { CustomEditorAction, EditorAPI } from "../types";

export interface CustomActionRendererProps {
  action: CustomEditorAction;
  api: EditorAPI;
  /** Layout orientation - 'horizontal' for topbar, 'vertical' for toolbar */
  layout?: "horizontal" | "vertical";
}

/**
 * Helper component to render different types of custom actions
 * Supports both horizontal (topbar) and vertical (toolbar) layouts
 */
const CustomActionRenderer: React.FC<CustomActionRendererProps> = ({
  action,
  api,
  layout = "horizontal",
}) => {
  // Helper to check if an action should be disabled
  const isDisabled = (disabled: boolean | ((api: EditorAPI) => boolean) | undefined): boolean => {
    if (typeof disabled === "function") {
      return disabled(api);
    }
    return disabled || false;
  };

  const isVertical = layout === "vertical";

  switch (action.type) {
    case "button":
      return (
        <TooltipButton
          key={action.id}
          variant={isVertical ? "outline" : "ghost"}
          size={isVertical ? "sm" : "icon"}
          onClick={() => action.onClick(api)}
          disabled={isDisabled(action.disabled)}
          className={isVertical ? "icon-button" : "h-8 w-8"}
          tooltip={action.label}
          shortcut={action.shortcut}
          tooltipDelay={500}
          tooltipSide={isVertical ? "right" : undefined}
        >
          {action.icon || <Plus className="h-4 w-4" />}
        </TooltipButton>
      );

    case "dropdown":
      return (
        <div
          key={action.id}
          className={isVertical ? "flex flex-col gap-1 px-1" : "flex items-center gap-2"}
        >
          {isVertical ? (
            <Label className="text-xs">{action.label}</Label>
          ) : (
            action.icon && <span className="text-muted-foreground">{action.icon}</span>
          )}
          <Select
            value={action.value}
            onValueChange={(value) => action.onChange(value, api)}
            disabled={isDisabled(action.disabled)}
          >
            <SelectTrigger className={isVertical ? "h-8 w-full" : "h-8 w-auto min-w-[120px]"}>
              <SelectValue placeholder={action.placeholder || action.label} />
            </SelectTrigger>
            <SelectContent>
              {action.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    {option.icon && <span>{option.icon}</span>}
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );

    case "input":
      return (
        <div
          key={action.id}
          className={isVertical ? "flex flex-col gap-1 px-1" : "flex items-center gap-2"}
        >
          <Label className="text-xs whitespace-nowrap">{action.label}{isVertical ? "" : ":"}</Label>
          <Input
            type={action.inputType || "text"}
            value={action.value}
            onChange={(e) => action.onChange(e.target.value, api)}
            placeholder={action.placeholder}
            disabled={isDisabled(action.disabled)}
            className={isVertical ? "h-8 w-full" : "h-8 w-32"}
            min={action.min}
            max={action.max}
            step={action.step}
          />
        </div>
      );

    case "color":
      return (
        <div
          key={action.id}
          className={isVertical ? "flex flex-col gap-1 px-1" : "flex items-center gap-2"}
        >
          <Label className="text-xs whitespace-nowrap">{action.label}{isVertical ? "" : ":"}</Label>
          <Input
            type="color"
            value={action.value}
            onChange={(e) => action.onChange(e.target.value, api)}
            disabled={isDisabled(action.disabled)}
            className={isVertical ? "h-8 w-full p-1 cursor-pointer" : "h-8 w-16 p-1 cursor-pointer"}
          />
        </div>
      );

    case "toggle":
      return (
        <div
          key={action.id}
          className={isVertical ? "flex items-center justify-between gap-2 px-1" : "flex items-center gap-2"}
        >
          {action.icon && <span className="text-muted-foreground">{action.icon}</span>}
          <Label className="text-xs whitespace-nowrap">{action.label}</Label>
          <Switch
            checked={action.value}
            onCheckedChange={(checked) => action.onChange(checked, api)}
            disabled={isDisabled(action.disabled)}
          />
        </div>
      );

    case "separator":
      return (
        <Separator
          key={action.id}
          orientation={isVertical ? "horizontal" : "vertical"}
          className={isVertical ? undefined : "h-6"}
        />
      );

    default:
      return null;
  }
};

export default CustomActionRenderer;
