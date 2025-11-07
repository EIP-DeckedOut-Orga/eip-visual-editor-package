/**
 * Toolbar Component
 *
 * Provides controls for element creation, undo/redo, and editor actions.
 */

import React from "react";
import { Separator } from "@/ui/separator";
import { TooltipButton } from "@/ui/general/TooltipButton";
import { Plus } from "lucide-react";
import { EditorAPI, ElementRenderer, ToolbarConfig } from "../types";
import { createElement } from "../utils/editorUtils";
import { useEditorState } from "../core/useEditorState";
import CustomActionRenderer from "./CustomActionRenderer";

export interface ToolbarProps {
  /** Editor API for performing actions */
  api: EditorAPI;

  /** Available element renderers to create */
  elementRenderers: ElementRenderer[];

  /** Canvas size for positioning new elements */
  canvasSize: { width: number; height: number };

  /** Configuration for toolbar visibility and custom tools */
  config?: ToolbarConfig;

  /** Optional custom style */
  style?: React.CSSProperties;

  /** Optional className */
  className?: string;
}

/**
 * Toolbar component with element creation and editor controls
 */
export const Toolbar: React.FC<ToolbarProps> = ({
  api,
  elementRenderers,
  canvasSize,
  config,
  style,
  className,
}) => {
  const selectedElement = api.getSelectedElement();

  // Default config values
  const {
    showElementTools = true,
    hiddenElementTypes = [],
    toolsStart = [],
    toolsEnd = [],
    toolsStartClassName = "",
    toolsEndClassName = "",
    customTools = [], // Backwards compatibility - defaults to end
  } = config || {};

  // Combine toolsEnd with customTools for backwards compatibility
  const endTools = [...toolsEnd, ...customTools];

  // Filter element renderers based on configuration
  const visibleRenderers = showElementTools
    ? elementRenderers.filter((renderer) => !hiddenElementTypes.includes(renderer.type))
    : [];

  // Create a new element of the given type
  const handleCreateElement = (renderer: ElementRenderer) => {
    const newElement = createElement(renderer.type, renderer.defaultProps, {
      position: { x: canvasSize.width / 2, y: canvasSize.height / 2 }, // Center of canvas
      size: {
        width: renderer.defaultSize?.width || 100,
        height: renderer.defaultSize?.height || 100,
      },
      zIndex: api.getAllElements().length, // Top of stack
    });

    api.addElement(newElement);
    api.selectElement(newElement.id);
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
      className={`flex flex-col justify-start items-center bg-popover gap-2 p-2 ${className}`}
      style={style}
    >
      {/* Custom Tools - Start (before element creation tools) */}
      {toolsStart.length > 0 && (
        <>
          <div className={`flex flex-col gap-1 ${toolsStartClassName}`}>
            {toolsStart.map((tool) => (
              <CustomActionRenderer key={tool.id} action={tool} api={api} layout="vertical" />
            ))}
          </div>
          {/* Separator after start tools if there are more sections */}
          {(visibleRenderers.length > 0 || endTools.length > 0) && (
            <Separator orientation="horizontal" />
          )}
        </>
      )}

      {/* Element Creation Buttons */}
      {visibleRenderers.length > 0 && (
        <>
          <div className="flex flex-col gap-1">
            {visibleRenderers.map((renderer) => (
              <TooltipButton
                key={renderer.type}
                variant="outline"
                size="sm"
                onClick={() => handleCreateElement(renderer)}
                className="icon-button"
                tooltip={`Add ${renderer.displayName}`}
                tooltipDelay={500}
                tooltipSide="right"
              >
                {renderer.icon || <Plus className="h-4 w-4" />}
              </TooltipButton>
            ))}
          </div>
          {/* Separator after element tools if there are end tools */}
          {endTools.length > 0 && (
            <Separator orientation="horizontal" />
          )}
        </>
      )}

      {/* Custom Tools - End (after element creation tools) */}
      {endTools.length > 0 && (
        <div className={`flex flex-col gap-1 ${toolsEndClassName}`}>
          {endTools.map((tool) => (
            <CustomActionRenderer key={tool.id} action={tool} api={api} layout="vertical" />
          ))}
        </div>
      )}
    </div>
  );
};

export default Toolbar;
