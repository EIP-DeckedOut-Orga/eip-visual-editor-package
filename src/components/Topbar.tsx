/**
 * Topbar Component
 *
 * Provides controls for element creation, undo/redo, and editor actions.
 */

import React from "react";
import { Separator } from "@/ui/separator";
import { TooltipButton } from "@/ui/general/TooltipButton";
import { Undo, Redo, Trash2, Download, Upload, Copy, Clipboard, CopyPlus, Image, X } from "lucide-react";
import { EditorAPI, TopbarConfig } from "../types";
import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import CustomActionRenderer from "./CustomActionRenderer";

export interface TopbarProps {
  /** Editor API for performing actions */
  api: EditorAPI;

  /** Canvas size for positioning new elements */
  canvasSize: { width: number; height: number };

  /** Can undo */
  canUndo: boolean;

  /** Can redo */
  canRedo: boolean;

  /** Undo callback */
  onUndo: () => void;

  /** Redo callback */
  onRedo: () => void;

  /** Export callback */
  onExport?: () => void;

  /** Import callback */
  onImport?: () => void;

  /** Set canvas size callback */
  setCanvasSize: (width: number, height: number) => void;

  /** Background color */
  backgroundColor?: string;

  /** Set background color callback */
  setBackgroundColor?: (color: string) => void;

  /** Background image filename */
  backgroundImage?: string;

  /** Set background image callback */
  setBackgroundImage?: (image: string) => void;

  /** Available images from context (for image picker) */
  imageUrls?: Map<string, string>;

  /** Clipboard ref for copy/paste operations */
  clipboardRef?: React.MutableRefObject<any>;

  /** Enable snap guides */
  enableSnapGuides?: boolean;

  /** Callback when snap guides toggle changes */
  onSnapGuidesChange?: (enabled: boolean) => void;

  /** Configuration for topbar visibility and custom actions */
  config?: TopbarConfig;

  /** Optional custom style */
  style?: React.CSSProperties;

  /** Optional className */
  className?: string;
}

/**
 * Topbar component with element creation and editor controls
 */
export const Topbar: React.FC<TopbarProps> = ({
  api,
  canvasSize,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onExport,
  onImport,
  setCanvasSize,
  backgroundColor,
  setBackgroundColor,
  backgroundImage,
  setBackgroundImage,
  imageUrls,
  clipboardRef,
  enableSnapGuides = true,
  onSnapGuidesChange,
  config,
  style,
  className,
}) => {
  const selectedElement = api.getSelectedElement();

  // Default config values
  const {
    showUndo = true,
    showRedo = true,
    showDelete = true,
    showCopy = true,
    showPaste = true,
    showDuplicate = true,
    showExport = true,
    showImport = true,
    showCanvasSize = true,
    showSnapGuides = true,
    actionsStart = [],
    actionsEnd = [],
    actionsStartClassName = "",
    actionsEndClassName = "",
    customActions = [], // Backwards compatibility - defaults to end
  } = config || {};

  // Default snap guides toggle action (added to end actions if showSnapGuides is true and callback exists)
  const defaultSnapGuidesAction =
    showSnapGuides && onSnapGuidesChange
      ? [
          {
            type: "toggle" as const,
            id: "snap-guides-toggle",
            label: "Snap Guides",
            value: enableSnapGuides,
            onChange: (value: boolean) => {
              onSnapGuidesChange(value);
            },
          },
        ]
      : [];

  // Combine actionsEnd with default snap guides and customActions for backwards compatibility
  const endActions = [...actionsEnd, ...defaultSnapGuidesAction, ...customActions];

  // Delete selected element
  const handleDelete = () => {
    if (selectedElement) {
      api.removeElement(selectedElement.id);
    }
  };

  // Copy selected element
  const handleCopy = () => {
    const copied = api.copyElement();
    if (copied && clipboardRef) {
      clipboardRef.current = copied;
    }
  };

  // Paste from clipboard
  const handlePaste = () => {
    if (clipboardRef?.current) {
      api.pasteElement(clipboardRef.current);
    }
  };

  // Duplicate selected element
  const handleDuplicate = () => {
    api.duplicateElement();
  };

  // Helper to check if an action should be disabled
  const isDisabled = (disabled: boolean | ((api: EditorAPI) => boolean) | undefined): boolean => {
    if (typeof disabled === "function") {
      return disabled(api);
    }
    return disabled || false;
  };

  return (
    <div
      className={`flex h-12 items-center px-3 py-1 bg-popover border-b gap-2 ${className}`}
      style={style}
    >
      {/* Left side: Canvas size and background color controls */}
      {showCanvasSize && (
        <div className="flex items-center gap-2">
          <span className="text-sm">Canvas:</span>
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground whitespace-nowrap">W:</span>
            <Input
              placeholder="Width"
              className="h-8 w-20"
              type="number"
              step={1}
              value={canvasSize.width}
              onChange={(e) =>
                setCanvasSize(Number(Number(e.target.value).toFixed(0)), canvasSize.height)
              }
            />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground whitespace-nowrap">H:</span>
            <Input
              placeholder="Height"
              className="h-8 w-20"
              type="number"
              step={1}
              value={canvasSize.height}
              onChange={(e) =>
                setCanvasSize(canvasSize.width, Number(Number(e.target.value).toFixed(0)))
              }
            />
          </div>
          {setBackgroundColor && backgroundColor && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground whitespace-nowrap">BG:</span>
              <Input
                placeholder="#000000"
                className="h-8 w-24"
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
              />
            </div>
          )}
          {setBackgroundImage && imageUrls && imageUrls.size > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground whitespace-nowrap">Texture:</span>
              {backgroundImage ? (
                <div className="flex items-center gap-1">
                  <Select value={backgroundImage} onValueChange={setBackgroundImage}>
                    <SelectTrigger className="h-8 w-32">
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from(imageUrls.keys()).map((imageName) => (
                        <SelectItem key={imageName} value={imageName}>
                          {imageName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setBackgroundImage("")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <Select value="" onValueChange={setBackgroundImage}>
                  <SelectTrigger className="h-8 w-32">
                    <SelectValue placeholder="None">
                      <div className="flex items-center gap-2">
                        <Image className="h-3 w-3" />
                        <span>None</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from(imageUrls.keys()).map((imageName) => (
                      <SelectItem key={imageName} value={imageName}>
                        {imageName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}
        </div>
      )}

      {/* Right side: Action buttons */}
      <div className="flex w-full gap-2">
        {/* Custom Actions - Start (before default controls) */}
        {actionsStart.length > 0 && (
          <>
            <div className={`flex items-center gap-1 ${actionsStartClassName}`}>
              {actionsStart.map((action) => (
                <CustomActionRenderer
                  key={action.id}
                  action={action}
                  api={api}
                  layout="horizontal"
                />
              ))}
            </div>
            {/* Separator after start actions if there are more sections */}
            {(showUndo ||
              showRedo ||
              showDelete ||
              (showExport && onExport) ||
              (showImport && onImport) ||
              endActions.length > 0) && <Separator orientation="vertical" className="h-6" />}
          </>
        )}

        {/* History Controls */}
        {(showUndo || showRedo) && (
          <>
            <div className="flex items-center gap-1">
              {showUndo && (
                <TooltipButton
                  variant="ghost"
                  size="icon"
                  onClick={onUndo}
                  disabled={!canUndo}
                  className="h-8 w-8"
                  tooltip="Undo"
                  shortcut="Ctrl+Z"
                  tooltipDelay={500}
                >
                  <Undo className="h-4 w-4" />
                </TooltipButton>
              )}

              {showRedo && (
                <TooltipButton
                  variant="ghost"
                  size="icon"
                  onClick={onRedo}
                  disabled={!canRedo}
                  className="h-8 w-8"
                  tooltip="Redo"
                  shortcut="Ctrl+Y"
                  tooltipDelay={500}
                >
                  <Redo className="h-4 w-4" />
                </TooltipButton>
              )}
            </div>
            {/* Separator after history if there are more sections */}
            {(showCopy ||
              showPaste ||
              showDuplicate ||
              showDelete ||
              (showExport && onExport) ||
              (showImport && onImport) ||
              endActions.length > 0) && <Separator orientation="vertical" className="h-6" />}
          </>
        )}

        {/* Element Actions */}
        {(showCopy || showPaste || showDuplicate || showDelete) && (
          <>
            <div className="flex items-center gap-1">
              {showCopy && (
                <TooltipButton
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
                  disabled={!selectedElement}
                  className="h-8 w-8"
                  tooltip="Copy"
                  shortcut="Ctrl+C"
                  tooltipDelay={500}
                >
                  <Copy className="h-4 w-4" />
                </TooltipButton>
              )}

              {showPaste && (
                <TooltipButton
                  variant="ghost"
                  size="icon"
                  onClick={handlePaste}
                  disabled={!clipboardRef?.current}
                  className="h-8 w-8"
                  tooltip="Paste"
                  shortcut="Ctrl+V"
                  tooltipDelay={500}
                >
                  <Clipboard className="h-4 w-4" />
                </TooltipButton>
              )}

              {showDuplicate && (
                <TooltipButton
                  variant="ghost"
                  size="icon"
                  onClick={handleDuplicate}
                  disabled={!selectedElement}
                  className="h-8 w-8"
                  tooltip="Duplicate"
                  shortcut="Ctrl+D"
                  tooltipDelay={500}
                >
                  <CopyPlus className="h-4 w-4" />
                </TooltipButton>
              )}

              {showDelete && (
                <TooltipButton
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                  disabled={!selectedElement}
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  tooltip="Delete Selected"
                  shortcut="Delete"
                  tooltipDelay={500}
                >
                  <Trash2 className="h-4 w-4" />
                </TooltipButton>
              )}
            </div>
            {/* Separator after element actions if there are more sections */}
            {((showExport && onExport) || (showImport && onImport) || endActions.length > 0) && (
              <Separator orientation="vertical" className="h-6" />
            )}
          </>
        )}

        {/* Import/Export */}
        {((showExport && onExport) || (showImport && onImport)) && (
          <>
            <div className="flex items-center gap-1">
              {showExport && onExport && (
                <TooltipButton
                  variant="ghost"
                  size="icon"
                  onClick={onExport}
                  className="h-8 w-8"
                  tooltip="Export to JSON"
                  tooltipDelay={500}
                >
                  <Download className="h-4 w-4" />
                </TooltipButton>
              )}

              {showImport && onImport && (
                <TooltipButton
                  variant="ghost"
                  size="icon"
                  onClick={onImport}
                  className="h-8 w-8"
                  tooltip="Import from JSON"
                  tooltipDelay={500}
                >
                  <Upload className="h-4 w-4" />
                </TooltipButton>
              )}
            </div>
            {/* Separator after import/export if there are end actions */}
            {endActions.length > 0 && <Separator orientation="vertical" className="h-6" />}
          </>
        )}

        {/* Custom Actions - End (after default controls) */}
        {endActions.length > 0 && (
          <div className={`flex items-center gap-1 ${actionsEndClassName}`}>
            {endActions.map((action) => (
              <CustomActionRenderer key={action.id} action={action} api={api} layout="horizontal" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Topbar;
