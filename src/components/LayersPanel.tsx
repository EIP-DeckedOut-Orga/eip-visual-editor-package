/**
 * Layers Panel Component
 *
 * Displays all elements in the canvas with controls to show/hide, lock/unlock,
 * reorder, and delete elements.
 */

import React from "react";
import { Badge } from "@/ui/badge";
import { ScrollArea } from "@/ui/scroll-area";
import { TooltipButton } from "@/ui/general/TooltipButton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  ChevronDown,
  Type,
  Image as ImageIcon,
  Layers,
  ChevronUp,
  Filter,
} from "lucide-react";
import { EditorElement, EditorAPI, ElementRenderer } from "../types";
import { cn } from "@/lib/utils";

export interface LayersPanelProps {
  /** All elements in the canvas */
  elements: EditorElement[];

  /** Currently selected element ID */
  selectedElementId: string | null;

  /** Editor API for manipulating elements */
  api: EditorAPI;

  /** Element registry to get renderer info */
  elementRenderers: Map<string, ElementRenderer>;

  /** Optional custom style */
  style?: React.CSSProperties;

  /** Optional className */
  className?: string;
}

/**
 * Get icon for element type
 */
const getElementIcon = (type: string) => {
  switch (type) {
    case "text":
      return <Type className="h-4 w-4" />;
    case "image":
      return <ImageIcon className="h-4 w-4" />;
    default:
      return <Layers className="h-4 w-4" />;
  }
};

/**
 * Get display name for element
 */
const getElementDisplayName = (element: EditorElement, renderer?: ElementRenderer): string => {
  // Use custom display name if set
  if (element.displayName) return element.displayName;

  // Use renderer display name
  if (renderer?.displayName) return renderer.displayName;

  // For text elements, show preview of content
  if (element.type === "text" && element.props.content) {
    const preview = element.props.content.substring(0, 20);
    return `${preview}${element.props.content.length > 20 ? "..." : ""}`;
  }

  // Default: capitalize type
  return element.type.charAt(0).toUpperCase() + element.type.slice(1);
};

/**
 * Layers Panel component
 */
export const LayersPanel: React.FC<LayersPanelProps> = ({
  elements,
  selectedElementId,
  api,
  elementRenderers,
  style,
  className,
}) => {
  const [filter, setFilter] = React.useState<string>("all");

  // Get all available element types from the registry
  const availableTypes = Array.from(elementRenderers.keys());

  // Sort elements by z-index (descending - top to bottom)
  const sortedElements = [...elements].sort((a, b) => b.zIndex - a.zIndex);

  // Filter elements
  const filteredElements = sortedElements.filter((el) => {
    if (filter === "all") return true;
    return el.type === filter;
  });

  // Move element up in z-index (increase array index since z-index = array index)
  const handleMoveUp = (element: EditorElement, e: React.MouseEvent) => {
    e.stopPropagation();

    // Find element's current array position
    const currentIndex = elements.findIndex((el) => el.id === element.id);

    // Move up means higher z-index, which means higher array index
    if (currentIndex < elements.length - 1) {
      api.reorderElement(element.id, currentIndex + 1);
    }
  };

  // Move element down in z-index (decrease array index since z-index = array index)
  const handleMoveDown = (element: EditorElement, e: React.MouseEvent) => {
    e.stopPropagation();

    // Find element's current array position
    const currentIndex = elements.findIndex((el) => el.id === element.id);

    // Move down means lower z-index, which means lower array index
    if (currentIndex > 0) {
      api.reorderElement(element.id, currentIndex - 1);
    }
  };

  return (
    <div className={cn("flex flex-col bg-card border-l", className)} style={style}>
      {/* Header */}
      <div className="flex h-10 items-center justify-between px-3 py-2 border-b bg-popover">
        <h3 className="text-sm font-semibold">Layers</h3>
        <Badge variant="default" className="text-xs">
          {filteredElements.length}
        </Badge>
      </div>

      {/* Filter Dropdown */}
      <div className="flex gap-2 items-center p-3 border-b">
        <Filter className="icon" />
        <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
          <SelectTrigger id="layer-filter" className="h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                All Elements
              </div>
            </SelectItem>
            {availableTypes.map((type) => (
              <SelectItem key={type} value={type}>
                <div className="flex items-center gap-2">
                  {getElementIcon(type)}
                  {type.charAt(0).toUpperCase() + type.slice(1)} Only
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Layers List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredElements.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              {filter === "all" ? "No elements yet" : `No ${filter} elements`}
            </div>
          ) : (
            filteredElements.map((element) => {
              const renderer = elementRenderers.get(element.type);
              const isSelected = element.id === selectedElementId;
              const isVisible = element.visible !== false;
              const isLocked = element.locked === true;

              return (
                <div
                  key={element.id}
                  className={cn(
                    "group flex items-center gap-2 px-2 py-2 rounded cursor-pointer transition-all",
                    isSelected
                      ? "bg-primary/15 border border-primary/30 shadow-sm"
                      : "hover:bg-muted/70",
                    isLocked && "opacity-60",
                    !isVisible && "opacity-40"
                  )}
                  onClick={() => !isLocked && api.selectElement(element.id)}
                >
                  {/* Element Icon */}
                  <div className="text-muted-foreground">{getElementIcon(element.type)}</div>

                  {/* Element Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">
                      {getElementDisplayName(element, renderer)}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span>z:{element.zIndex}</span>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Z-index Controls */}
                    <div className="flex flex-col">
                      {element.zIndex < elements.length - 1 && (
                        <TooltipButton
                          variant="ghost"
                          size="icon"
                          className="h-3 w-6"
                          onClick={(e) => handleMoveUp(element, e)}
                          tooltip="Move Upward"
                          tooltipDelay={500}
                        >
                          <ChevronUp className="h-3 w-3" />
                        </TooltipButton>
                      )}
                      {element.zIndex > 0 && (
                        <TooltipButton
                          variant="ghost"
                          size="icon"
                          className="h-3 w-6"
                          onClick={(e) => handleMoveDown(element, e)}
                          tooltip="Move Downward"
                          tooltipDelay={500}
                        >
                          <ChevronDown className="h-3 w-3" />
                        </TooltipButton>
                      )}
                    </div>

                    {/* Visibility Toggle */}
                    <TooltipButton
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        api.updateElement(element.id, { visible: !isVisible });
                      }}
                      tooltip={isVisible ? "Hide" : "Show"}
                      tooltipDelay={500}
                    >
                      {isVisible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    </TooltipButton>

                    {/* Lock Toggle */}
                    <TooltipButton
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        api.updateElement(element.id, { locked: !isLocked });
                      }}
                      tooltip={isLocked ? "Unlock" : "Lock"}
                      tooltipDelay={500}
                    >
                      {isLocked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                    </TooltipButton>

                    {/* Delete */}
                    <TooltipButton
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        api.removeElement(element.id);
                      }}
                      tooltip="Delete"
                      tooltipDelay={500}
                    >
                      <Trash2 className="h-3 w-3" />
                    </TooltipButton>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

      {/* Footer Stats */}
      <div className="border-t p-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{elements.filter((e) => e.visible !== false).length} visible</span>
          <span>•</span>
          <span>{elements.filter((e) => e.locked === true).length} locked</span>
        </div>
      </div>
    </div>
  );
};

export default LayersPanel;
