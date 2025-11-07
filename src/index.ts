/**
 * Visual Editor - Main Entry Point
 *
 * Exports all public APIs for the visual editor module.
 * This is the main entry point for consuming the editor.
 */

// Main component
export { VisualEditor } from "./core/VisualEditor";

// UI Components
export { Inspector, renderField } from "./components/Inspector";
export { LayersPanel } from "./components/LayersPanel";
export { VisualEditorWorkspace } from "./components/VisualEditorWorkspace";
export { AssetPicker } from "./components/AssetPicker";
export type { AssetPickerProps } from "./components/AssetPicker";

// Core hooks and utilities
export { useEditorState } from "./core/useEditorState";
export { ElementRegistry, useElementRegistry, globalElementRegistry } from "./core/ElementRegistry";

// Built-in elements
export { defaultElements, textElementRenderer, imageElementRenderer } from "./elements";
export { TextElementRenderer } from "./elements/TextElement";
export { ImageElementRenderer } from "./elements/ImageElement";

// Utility functions
export * from "./utils/editorUtils";

// Type definitions
export type {
  // Core types
  EditorElement,
  EditorAPI,
  EditorMode,
  EditorState,
  EditorAction,

  // Element types
  ElementRenderer,
  TextElementProps,
  ImageElementProps,

  // Inspector types
  InspectorFieldType,
  InspectorFieldSchema,
  CustomRendererProps,

  // Canvas types
  CanvasExport,

  // Component props
  VisualEditorProps,
} from "./types";

// Snapping utilities
export * from "./utils/snapping";
