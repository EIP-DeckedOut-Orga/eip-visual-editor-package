/**
 * Visual Editor - Main Editor Component
 *
 * The core editor component that integrates all functionality:
 * - Canvas rendering with Konva
 * - Element management
 * - Selection and transformation
 * - Mode switching
 */

import React, { useEffect, useCallback, useRef } from "react";
import { Stage, Layer } from "react-konva";
import { VisualEditorProps, EditorElement, EditorMode } from "../types";
import { useEditorState } from "./useEditorState";
import { ElementRegistry, useElementRegistry } from "./ElementRegistry";
import { defaultElements } from "../elements";

/**
 * Main Visual Editor Component
 */
export const VisualEditor: React.FC<VisualEditorProps> = ({
  mode,
  initialData,
  width: propWidth,
  height: propHeight,
  readonly = false,
  onChange,
  onSelectionChange,
  onExport,
  customElements = [],
  showToolbar = true,
  showInspector = true,
  className = "",
  style = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<any>(null);

  // Initialize editor state
  const {
    state,
    api,
    setCanvasSize,
    setMode: setEditorMode,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useEditorState(mode || null);

  // Initialize element registry
  const registry = useElementRegistry([
    ...defaultElements,
    ...(mode?.registeredElements || []),
    ...customElements,
  ]);

  // Determine canvas size
  const canvasWidth = propWidth || state.canvasSize.width || mode?.defaultCanvasSize.width || 800;
  const canvasHeight =
    propHeight || state.canvasSize.height || mode?.defaultCanvasSize.height || 600;

  // Update canvas size when props change
  useEffect(() => {
    if (propWidth && propHeight) {
      setCanvasSize(propWidth, propHeight);
    }
  }, [propWidth, propHeight, setCanvasSize]);

  // Load initial data
  useEffect(() => {
    if (initialData) {
      api.importJSON(initialData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  // Update mode when it changes
  useEffect(() => {
    if (mode) {
      setEditorMode(mode);
      // Register mode elements
      if (mode.registeredElements) {
        mode.registeredElements.forEach((el) => registry.register(el));
      }
      // Call mode activation hook
      if (mode.onModeActivate) {
        mode.onModeActivate(api);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // Notify parent of changes
  useEffect(() => {
    if (onChange) {
      const data = api.exportJSON();
      onChange(data);
    }
  }, [state.elements, onChange, api]);

  // Notify parent of selection changes
  useEffect(() => {
    if (onSelectionChange) {
      const selected = api.getSelectedElement();
      onSelectionChange(selected);
    }
  }, [state.selectedElementId, onSelectionChange, api]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo: Ctrl/Cmd + Z
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      // Redo: Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y
      if (
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "z") ||
        ((e.ctrlKey || e.metaKey) && e.key === "y")
      ) {
        e.preventDefault();
        redo();
      }
      // Delete: Delete or Backspace
      if ((e.key === "Delete" || e.key === "Backspace") && !readonly) {
        e.preventDefault();
        const selected = api.getSelectedElement();
        if (selected) {
          api.removeElement(selected.id);
        }
      }
      // Deselect: Escape
      if (e.key === "Escape") {
        e.preventDefault();
        api.selectElement(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, readonly, api]);

  // Render an element using its registered renderer
  const renderElement = useCallback(
    (element: EditorElement) => {
      const renderer = registry.get(element.type);
      if (!renderer) {
        console.warn(`No renderer found for element type: ${element.type}`);
        return null;
      }

      // Get the renderer component
      const RendererComponent = renderer.renderComponent;
      if (!RendererComponent) {
        console.warn(`No renderComponent found for element type: ${element.type}`);
        return null;
      }

      const isSelected = state.selectedElementId === element.id;

      return (
        <RendererComponent
          key={element.id}
          element={element}
          isSelected={isSelected}
          onSelect={() => !readonly && api.selectElement(element.id)}
          onTransform={(updates) => !readonly && api.updateElement(element.id, updates)}
        />
      );
    },
    [registry, state.selectedElementId, readonly, api]
  );

  // Handle click on canvas background (deselect)
  const handleStageClick = useCallback(
    (e: any) => {
      // Clicked on stage - deselect
      if (e.target === e.target.getStage()) {
        api.selectElement(null);
      }
    },
    [api]
  );

  // Sort elements by z-index for proper rendering order
  const sortedElements = [...state.elements].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div
      ref={containerRef}
      className={`visual-editor ${className}`}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor: mode?.backgroundColor || "#f0f0f0",
        ...style,
      }}
    >
      {/* Canvas */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "auto",
        }}
      >
        <Stage
          ref={stageRef}
          width={canvasWidth}
          height={canvasHeight}
          onClick={handleStageClick}
          onTap={handleStageClick}
          style={{
            backgroundColor: "#ffffff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Layer>{sortedElements.map(renderElement)}</Layer>
        </Stage>
      </div>
    </div>
  );
};
