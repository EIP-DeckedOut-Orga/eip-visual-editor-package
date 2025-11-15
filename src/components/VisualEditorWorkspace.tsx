/**
 * Visual Editor Workspace
 *
 * Integrated workspace that combines Toolbar, Canvas (VisualEditor), and Inspector.
 * This component creates a complete editor experience by coordinating all three parts.
 */

import React, { useCallback, useImperativeHandle } from "react";
import { Topbar } from "./Topbar";
import { Inspector } from "./Inspector";
import { LayersPanel } from "./LayersPanel";
import { Canvas } from "./Canvas";
import { useEditorState } from "../core/useEditorState";
import { useElementRegistry } from "../core/ElementRegistry";
import { defaultElements } from "../elements";
import { exportToJSON, importFromJSON } from "../utils/editorUtils";
import type { EditorMode, CanvasExport, EditorAPI, EditorElement } from "../types";
import { Toolbar } from "./Toolbar";

export interface VisualEditorWorkspaceProps {
  /** Editor mode configuration */
  mode?: EditorMode;

  /** Initial canvas data */
  initialData?: CanvasExport;

  /** Canvas width (overrides mode default) */
  width?: number;

  /** Canvas height (overrides mode default) */
  height?: number;

  /** Whether the editor is in readonly mode */
  readonly?: boolean;

  /** Callback when data changes */
  onChange?: (data: CanvasExport) => void;

  /** Custom element renderers (extends mode elements) */
  customElements?: any[];

  /** Whether to show the toolbar */
  showToolbar?: boolean;

  /** Whether to show the topbar (canvas size, undo, redo, delete, import, export) */
  showTopbar?: boolean;

  /** Whether to show the inspector panel */
  showInspector?: boolean;

  /** Whether to show the layers panel */
  showLayers?: boolean;

  /** Whether to show the asset picker (if defined in mode) */
  showAssetPicker?: boolean;

  /** Whether to show the canvas */
  showCanvas?: boolean;

  /** Whether to enable snap guides */
  enableSnapGuides?: boolean;

  /** Whether to enable pan and zoom controls */
  enablePanZoom?: boolean;

  /** Optional background image URL - replaces solid background color when provided */
  backgroundImageUrl?: string;

  /** Whether to hide all elements on the canvas */
  hideElements?: boolean;

  /** Custom CSS class */
  className?: string;

  /** Ref to access the editor API */
  apiRef?: React.Ref<EditorAPI>;
}

/**
 * Complete visual editor workspace with toolbar, canvas, and inspector
 */
export const VisualEditorWorkspace: React.FC<VisualEditorWorkspaceProps> = ({
  mode,
  initialData,
  width,
  height,
  readonly = false,
  onChange,
  customElements = [],
  showTopbar = true,
  showToolbar = true,
  showInspector = true,
  showLayers = true,
  showAssetPicker = true,
  showCanvas = true,
  enableSnapGuides = true,
  enablePanZoom = true,
  backgroundImageUrl,
  hideElements = false,
  className = "",
  apiRef,
}) => {
  // Memoize element list to prevent re-registration
  const elementList = React.useMemo(() => {
    return [...defaultElements, ...(mode?.registeredElements || []), ...customElements];
  }, [mode, customElements]);

  // Initialize element registry
  const registry = useElementRegistry(elementList);

  // Initialize editor state
  const { state, api, undo, redo, canUndo, canRedo, setCanvasSize } = useEditorState(mode || null);

  // Clipboard ref for copy/paste operations
  const clipboardRef = React.useRef<EditorElement | null>(null);

  // Snap guides state (controlled internally)
  const [snapGuidesEnabled, setSnapGuidesEnabled] = React.useState(enableSnapGuides);

  // Background color state (controlled locally, initialized from mode)
  const [backgroundColor, setBackgroundColor] = React.useState(
    mode?.backgroundColor || "#1a1a1a"
  );

  // Background image state (controlled locally, initialized from mode)
  const [backgroundImage, setBackgroundImage] = React.useState<string>(
    mode?.backgroundImage || ""
  );

  // Sync external enableSnapGuides prop changes
  React.useEffect(() => {
    setSnapGuidesEnabled(enableSnapGuides);
  }, [enableSnapGuides]);

  // Sync mode backgroundColor changes
  React.useEffect(() => {
    if (mode?.backgroundColor) {
      setBackgroundColor(mode.backgroundColor);
    }
  }, [mode?.backgroundColor]);

  // Sync mode backgroundImage changes (including empty string to clear)
  React.useEffect(() => {
    setBackgroundImage(mode?.backgroundImage || "");
  }, [mode?.backgroundImage]);

  // Sync canvas size with editor state (editor state is the source of truth)
  const canvasSize = state.canvasSize;

  // Expose API via ref
  useImperativeHandle(apiRef, () => api, [api]);

  // Load initial data
  React.useEffect(() => {
    if (initialData && initialData.elements && initialData.elements.length > 0) {
      // Use loadElements to avoid recording history
      api.loadElements(initialData.elements);
      if (initialData.width && initialData.height) {
        setCanvasSize(initialData.width, initialData.height);
      }
    }
  }, []); // Only run once on mount

  // Get available element renderers for toolbar
  const availableRenderers = Array.from(registry.getAll().values());

  // Get current selection and renderer for inspector
  const selectedElement = state.selectedElementId
    ? state.elements.find((el) => el.id === state.selectedElementId) || null
    : null;

  const selectedRenderer = selectedElement ? registry.get(selectedElement.type) || null : null;

  // Handle export
  const handleExport = useCallback(() => {
    const data: CanvasExport = {
      width: canvasSize.width,
      height: canvasSize.height,
      elements: state.elements,
      metadata: {
        version: "1.0",
        mode: mode?.name || "default",
        created: new Date().toISOString(),
      },
    };

    const json = exportToJSON(data);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `canvas-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [state.elements, canvasSize, mode]);

  // Handle import
  const handleImport = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const imported = importFromJSON(text);

        if (imported) {
          // Clear current elements
          state.elements.forEach((el) => api.removeElement(el.id));

          // Load imported elements
          imported.elements.forEach((el) => api.addElement(el));

          // Update canvas size
          if (imported.width && imported.height) {
            setCanvasSize(imported.width, imported.height);
          }
        }
      } catch (error) {
        console.error("Failed to import:", error);
        alert(`Failed to import: ${(error as Error).message}`);
      }
    };
    input.click();
  }, [state.elements, api]);

  // Notify parent of changes (use ref to prevent infinite loops)
  const onChangeRef = React.useRef(onChange);
  React.useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  React.useEffect(() => {
    if (onChangeRef.current) {
      onChangeRef.current({
        width: canvasSize.width,
        height: canvasSize.height,
        elements: state.elements,
        metadata: {
          backgroundColor: backgroundColor,
          backgroundImage: backgroundImage,
        },
      });
    }
  }, [state.elements, canvasSize, backgroundColor, backgroundImage]);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (readonly) return;

      // Undo: Ctrl+Z
      if (e.ctrlKey && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) undo();
      }
      // Redo: Ctrl+Y or Ctrl+Shift+Z
      else if ((e.ctrlKey && e.key === "y") || (e.ctrlKey && e.shiftKey && e.key === "Z")) {
        e.preventDefault();
        if (canRedo) redo();
      }
      // Delete: Delete
      else if (e.key === "Delete" && selectedElement) {
        e.preventDefault();
        api.removeElement(selectedElement.id);
      }
      // Deselect: Escape
      else if (e.key === "Escape") {
        e.preventDefault();
        api.selectElement(null);
      }
      // Copy: Ctrl+C
      else if (e.ctrlKey && e.key === "c" && selectedElement) {
        e.preventDefault();
        const copied = api.copyElement();
        if (copied) {
          // Store in a temporary clipboard (we'll use a ref for this)
          clipboardRef.current = copied;
        }
      }
      // Paste: Ctrl+V
      else if (e.ctrlKey && e.key === "v" && clipboardRef.current) {
        e.preventDefault();
        api.pasteElement(clipboardRef.current);
      }
      // Duplicate: Ctrl+D
      else if (e.ctrlKey && e.key === "d" && selectedElement) {
        e.preventDefault();
        api.duplicateElement();
      }

      // Move selected element with arrow keys only when no input/textarea/select
      // or contentEditable element is focused. Prevent interfering with text editing.
      const isInputFocused = () => {
        const active = document.activeElement as HTMLElement | null;
        if (!active) return false;
        // If body is focused, nothing else is focused
        if (active === document.body) return false;
        // Content editable elements
        if (active.isContentEditable) return true;
        const tag = active.tagName?.toLowerCase();
        if (tag === "input" || tag === "textarea" || tag === "select") return true;
        const role = active.getAttribute ? active.getAttribute("role") : null;
        if (role === "textbox") return true;
        return false;
      };

      if (selectedElement && !isInputFocused()) {
        if (e.key === "ArrowUp") {
          e.preventDefault();
          api.moveElement(selectedElement.id, 0, -1);
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          api.moveElement(selectedElement.id, 0, 1);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          api.moveElement(selectedElement.id, -1, 0);
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          api.moveElement(selectedElement.id, 1, 0);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canUndo, canRedo, undo, redo, selectedElement, api, readonly]);

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Topbar */}
      {showTopbar && (
        <Topbar
          api={api}
          canvasSize={canvasSize}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={undo}
          onRedo={redo}
          onExport={handleExport}
          onImport={handleImport}
          setCanvasSize={setCanvasSize}
          backgroundColor={backgroundColor}
          setBackgroundColor={setBackgroundColor}
          backgroundImage={backgroundImage}
          setBackgroundImage={setBackgroundImage}
          imageUrls={mode?.context?.imageUrls}
          clipboardRef={clipboardRef}
          enableSnapGuides={snapGuidesEnabled}
          onSnapGuidesChange={setSnapGuidesEnabled}
          config={mode?.topbarConfig}
        />
      )}

      {/* Main content: Canvas + Layers + Inspector + Asset Picker */}
      <div className="flex w-full h-full overflow-hidden">
        {/* Toolbar */}
        {showToolbar && (
          <Toolbar
            api={api}
            elementRenderers={availableRenderers}
            canvasSize={canvasSize}
            config={mode?.toolbarConfig}
          />
        )}

        {/* Canvas */}
        {showCanvas && (
          <Canvas
            canvasSize={canvasSize}
            elements={state.elements}
            selectedElementId={state.selectedElementId}
            registry={registry}
            mode={mode ? { ...mode, backgroundColor } : undefined}
            readonly={readonly}
            enableSnapGuides={snapGuidesEnabled}
            enablePanZoom={enablePanZoom}
            backgroundImageUrl={
              backgroundImage && mode?.context?.imageUrls
                ? mode.context.imageUrls.get(backgroundImage)
                : backgroundImageUrl
            }
            hideElements={hideElements}
            onSelectElement={(id) => api.selectElement(id)}
            onTransformElement={(id, updates) => api.updateElement(id, updates)}
          />
        )}

        {/* Layers Panel */}
        {showLayers && (
          <LayersPanel
            elements={state.elements}
            selectedElementId={state.selectedElementId}
            api={api}
            elementRenderers={registry.getMap()}
            className="w-64"
          />
        )}

        {/* Inspector Panel (with asset picker at bottom if position === 'bottom') */}
        {showInspector && (
          <div className="w-80 h-full border-l bg-background flex flex-col">
            {/* Inspector Panel */}
            <div className="flex-1 min-h-0 overflow-auto">
              <Inspector
                selectedElement={selectedElement}
                elementRenderer={selectedRenderer}
                api={api}
                mode={mode}
                canvasSize={canvasSize}
                setCanvasSize={setCanvasSize}
              />
            </div>

            {/* Asset Picker at Bottom (default position) */}
            {showAssetPicker &&
              mode?.assetPickerComponent &&
              (!mode.assetPickerPosition || mode.assetPickerPosition === "bottom") &&
              React.createElement(mode.assetPickerComponent, {
                ...mode.assetPickerProps,
                api,
                className: mode.assetPickerHeight || "h-[40%]",
              })}
          </div>
        )}

        {/* Asset Picker as Separate Panel (position === 'right') */}
        {showAssetPicker &&
          mode?.assetPickerComponent &&
          mode.assetPickerPosition === "right" &&
          React.createElement(mode.assetPickerComponent, {
            ...mode.assetPickerProps,
            api,
            className: `border-l ${mode.assetPickerHeight || "w-80"}`,
          })}
      </div>
    </div>
  );
};

export default VisualEditorWorkspace;
