/**
 * Visual Editor - Core Type Definitions
 *
 * This file contains all the type definitions for the extensible visual editor.
 * The editor supports multiple modes (Card Editor, Playground, etc.) through
 * a flexible, schema-driven architecture.
 */

// ============================================================================
// Element Types
// ============================================================================

/**
 * Base interface for all visual elements in the editor.
 * @template TProps - Custom properties specific to the element type
 */
export interface EditorElement<TProps = any> {
  /** Unique identifier for the element */
  id: string;

  /** Type identifier (e.g., "text", "image", "pile", "card") */
  type: string;

  /** Position on the canvas */
  position: {
    x: number;
    y: number;
  };

  /** Size of the element */
  size: {
    width: number;
    height: number;
  };

  /** Rotation angle in degrees */
  rotation: number;

  /** Opacity (0-1, where 0 is transparent and 1 is opaque) */
  opacity: number;

  /** Layer order (higher = on top) */
  zIndex: number;

  /** Whether the element is visible */
  visible?: boolean;

  /** Whether the element is locked (cannot be selected/moved) */
  locked?: boolean;

  /** Display name for layers panel */
  displayName?: string;

  /** Element-specific properties */
  props: TProps;
}

/**
 * Common text element properties - matches CardChildText
 */
export interface TextElementProps {
  content: string;
  fontSize: number;
  fontFamily?: string;
  color: string;
  strokeColor?: string;
  strokeWidth?: number;
  align?: "left" | "center" | "right";
  verticalAlign?: "top" | "middle" | "bottom";
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  overline?: boolean;
  strikethrough?: boolean;
  wordWrap?: "break-word";
  textOverflow?: "clip" | "ellipsis" | "visible";
}

/**
 * Common image element properties
 */
export interface ImageElementProps {
  src: string;
  fit?: "contain" | "cover" | "fill";
}

// ============================================================================
// Element Renderer Interface
// ============================================================================

/**
 * Defines how an element type should be rendered and configured.
 * This is the core abstraction that makes the editor extensible.
 */
export interface ElementRenderer<TProps = any> {
  /** Unique type identifier */
  type: string;

  /** Display name for UI */
  displayName: string;

  /** Render function for the element (for non-Konva contexts) */
  render: (element: EditorElement<TProps>) => React.ReactNode;

  /** React component for Konva canvas rendering */
  renderComponent?: React.ComponentType<{
    element: EditorElement<TProps>;
    isSelected: boolean;
    onSelect: () => void;
    onTransform: (updates: Partial<EditorElement>) => void;
    allElements?: EditorElement[];
    canvasSize?: { width: number; height: number };
    onSnapGuides?: (guides: any) => void;
    onClearSnapGuides?: () => void;
    [key: string]: any; // Allow additional props
  }>;

  /** Default properties when creating a new element of this type */
  defaultProps: TProps;

  /** Default size for new elements */
  defaultSize?: {
    width: number;
    height: number;
  };

  /** Schema for the property inspector */
  inspectorSchema?: InspectorFieldSchema[];

  /** Optional icon for element type selector */
  icon?: React.ReactNode;
}

// ============================================================================
// Inspector Types
// ============================================================================

/**
 * Supported field types in the property inspector
 */
export type InspectorFieldType =
  | "string"
  | "number"
  | "color"
  | "select"
  | "boolean"
  | "slider"
  | "image"
  | "custom";

/**
 * Props passed to custom renderer components
 */
export interface CustomRendererProps {
  /** Current field value */
  value: any;

  /** Callback to update the value */
  onChange: (value: any) => void;

  /** Field schema */
  field: InspectorFieldSchema;

  /** All element props (for context) */
  elementProps: any;

  /** Editor mode (for accessing mode context) */
  mode?: EditorMode;
}

/**
 * Schema definition for a single inspector field
 */
export interface InspectorFieldSchema {
  /** Property name in element.props */
  name: string;

  /** Field type */
  type: InspectorFieldType;

  /** Display label */
  label: string;

  /** Optional description/help text */
  description?: string;

  /** For select fields - available options */
  options?: { value: any; label: string }[];

  /** For number/slider fields */
  min?: number;
  max?: number;
  step?: number;

  /** Default value */
  defaultValue?: any;

  /** For custom type - custom renderer component */
  customRenderer?: React.ComponentType<CustomRendererProps>;
}

// ============================================================================
// Editor API
// ============================================================================

/**
 * Core API for manipulating elements in the editor.
 * This API is exposed to modes and external code.
 */
export interface EditorAPI {
  /** Add a new element to the canvas */
  addElement: (element: EditorElement) => void;

  /** Update an existing element */
  updateElement: (id: string, updates: Partial<EditorElement>) => void;

  /** Remove an element from the canvas */
  removeElement: (id: string) => void;

  /** Select an element (or null to deselect) */
  selectElement: (id: string | null) => void;

  /** Get the currently selected element */
  getSelectedElement: () => EditorElement | null;

  /** Get all elements */
  getAllElements: () => EditorElement[];

  /** Move an element by delta */
  moveElement: (id: string, deltaX: number, deltaY: number) => void;

  /** Rotate an element */
  rotateElement: (id: string, angle: number) => void;

  /** Resize an element */
  resizeElement: (id: string, width: number, height: number) => void;

  /** Update element's z-index */
  updateZIndex: (id: string, zIndex: number) => void;

  /** Reorder an element to a new position in the array */
  reorderElement: (id: string, newIndex: number) => void;

  /** Export canvas to JSON */
  exportJSON: () => CanvasExport;

  /** Import canvas from JSON */
  importJSON: (data: CanvasExport) => void;

  /** Clear all elements */
  clear: () => void;

  /** Clear undo/redo history */
  clearHistory: () => void;

  /** Load elements without recording history (for initial load) */
  loadElements: (elements: EditorElement[]) => void;

  /** Copy an element to clipboard (returns element data) */
  copyElement: (id?: string | null) => EditorElement | null;

  /** Duplicate the selected element with an offset */
  duplicateElement: (id?: string | null, offset?: { x: number; y: number }) => void;

  /** Paste a copied element with an offset */
  pasteElement: (copiedElement: EditorElement, offset?: { x: number; y: number }) => void;
}

// ============================================================================
// Canvas Export/Import
// ============================================================================

/**
 * Format for exporting/importing canvas data
 */
export interface CanvasExport {
  /** Canvas dimensions */
  width: number;
  height: number;

  /** All elements on the canvas */
  elements: EditorElement[];

  /** Optional metadata */
  metadata?: {
    version?: string;
    mode?: string;
    created?: string;
    modified?: string;
    [key: string]: any;
  };
}

// ============================================================================
// UI Configuration Types
// ============================================================================

/**
 * Base interface for all custom editor actions
 */
interface CustomEditorActionBase {
  /** Unique identifier */
  id: string;

  /** Display label/tooltip */
  label: string;

  /** Disabled state */
  disabled?: boolean | ((api: EditorAPI) => boolean);
}

/**
 * Button action - Simple click handler
 */
export interface CustomEditorButtonAction extends CustomEditorActionBase {
  type: "button";

  /** Icon component */
  icon?: React.ReactNode;

  /** Keyboard shortcut hint */
  shortcut?: string;

  /** Click handler */
  onClick: (api: EditorAPI) => void;
}

/**
 * Dropdown action - Select from options
 */
export interface CustomEditorDropdownAction extends CustomEditorActionBase {
  type: "dropdown";

  /** Icon component (optional) */
  icon?: React.ReactNode;

  /** Dropdown options */
  options: Array<{
    value: string;
    label: string;
    icon?: React.ReactNode;
  }>;

  /** Current selected value */
  value?: string;

  /** Change handler */
  onChange: (value: string, api: EditorAPI) => void;

  /** Placeholder text when no value selected */
  placeholder?: string;
}

/**
 * Input action - Text input field
 */
export interface CustomEditorInputAction extends CustomEditorActionBase {
  type: "input";

  /** Input type (text, number, etc.) */
  inputType?: "text" | "number" | "email" | "password" | "search";

  /** Current value */
  value: string;

  /** Change handler */
  onChange: (value: string, api: EditorAPI) => void;

  /** Placeholder text */
  placeholder?: string;

  /** Min/max for number inputs */
  min?: number;
  max?: number;
  step?: number;
}

/**
 * Color picker action - Color selection
 */
export interface CustomEditorColorAction extends CustomEditorActionBase {
  type: "color";

  /** Current color value */
  value: string;

  /** Change handler */
  onChange: (color: string, api: EditorAPI) => void;

  /** Show alpha channel */
  showAlpha?: boolean;
}

/**
 * Toggle action - On/off switch
 */
export interface CustomEditorToggleAction extends CustomEditorActionBase {
  type: "toggle";

  /** Icon component (optional) */
  icon?: React.ReactNode;

  /** Current toggle state */
  value: boolean;

  /** Change handler */
  onChange: (value: boolean, api: EditorAPI) => void;
}

/**
 * Separator - Visual divider (no interaction)
 */
export interface CustomEditorSeparator {
  type: "separator";
  id: string;
}

/**
 * Union type for all custom editor actions
 */
export type CustomEditorAction =
  | CustomEditorButtonAction
  | CustomEditorDropdownAction
  | CustomEditorInputAction
  | CustomEditorColorAction
  | CustomEditorToggleAction
  | CustomEditorSeparator;

/**
 * Configuration for topbar controls visibility
 */
export interface TopbarConfig {
  /** Show undo button */
  showUndo?: boolean;

  /** Show redo button */
  showRedo?: boolean;

  /** Show delete button */
  showDelete?: boolean;

  /** Show copy button */
  showCopy?: boolean;

  /** Show paste button */
  showPaste?: boolean;

  /** Show duplicate button */
  showDuplicate?: boolean;

  /** Show export button */
  showExport?: boolean;

  /** Show import button */
  showImport?: boolean;

  /** Show canvas size controls */
  showCanvasSize?: boolean;

  /** Show snap guides toggle */
  showSnapGuides?: boolean;

  /** Custom actions to add before default controls (left side) */
  actionsStart?: CustomEditorAction[];

  /** Custom actions to add after default controls (right side) */
  actionsEnd?: CustomEditorAction[];

  /** Custom CSS classes for the start actions container */
  actionsStartClassName?: string;

  /** Custom CSS classes for the end actions container */
  actionsEndClassName?: string;

  /** @deprecated Use actionsEnd instead. Custom actions to add to topbar (defaults to end) */
  customActions?: CustomEditorAction[];
}

/**
 * Configuration for toolbar controls visibility
 */
export interface ToolbarConfig {
  /** Show element creation tools */
  showElementTools?: boolean;

  /** Specific element types to hide from toolbar (by type string) */
  hiddenElementTypes?: string[];

  /** Custom tools to add before default element tools (top) */
  toolsStart?: CustomEditorAction[];

  /** Custom tools to add after default element tools (bottom) */
  toolsEnd?: CustomEditorAction[];

  /** Custom CSS classes for the start tools container */
  toolsStartClassName?: string;

  /** Custom CSS classes for the end tools container */
  toolsEndClassName?: string;

  /** @deprecated Use toolsEnd instead. Custom tools to add to toolbar (defaults to end) */
  customTools?: CustomEditorAction[];
}

// ============================================================================
// Editor Mode Configuration
// ============================================================================

/**
 * Configuration for different editor modes (Card Editor, Playground, etc.)
 */
export interface EditorMode {
  /** Mode identifier */
  name: string;

  /** Display name for UI */
  displayName: string;

  /**
   * Elements available in this mode (optional)
   * If omitted, defaultElements will be used
   * If provided, will be merged with defaultElements
   */
  registeredElements?: ElementRenderer[];

  /** Default canvas size */
  defaultCanvasSize: {
    width: number;
    height: number;
  };

  /** Whether the canvas size can be changed */
  canResizeCanvas?: boolean;

  /** Whether elements can be added/removed */
  readonly?: boolean;

  /** Whether to show grid */
  showGrid?: boolean;

  /** Grid size in pixels */
  gridSize?: number;

  /** Whether to snap to grid */
  snapToGrid?: boolean;

  /** Background color */
  backgroundColor?: string;

  /** Background image (asset filename) */
  backgroundImage?: string;

  /** Optional context data to pass to element renderers */
  context?: Record<string, any>;

  /** Custom asset picker component */
  assetPickerComponent?: React.ComponentType<any>;

  /** Props to pass to the custom asset picker */
  assetPickerProps?: Record<string, any>;

  /** Asset picker height (CSS class like "h-64", "h-[40%]", "flex-1", etc.) */
  assetPickerHeight?: string;

  /** Asset picker position - 'bottom' shows below inspector, 'right' shows as separate panel */
  assetPickerPosition?: "bottom" | "right";

  /** Custom inspector placeholder component (shown when no element is selected) */
  inspectorPlaceholder?: React.ComponentType<any>;

  /** Configuration for topbar controls (hide/show specific actions) */
  topbarConfig?: TopbarConfig;

  /** Configuration for toolbar controls (hide/show specific tools) */
  toolbarConfig?: ToolbarConfig;

  /** Optional mode-specific behavior hooks */
  onModeActivate?: (api: EditorAPI) => void;
  onModeDeactivate?: (api: EditorAPI) => void;
  onElementAdded?: (element: EditorElement, api: EditorAPI) => void;
  onElementRemoved?: (element: EditorElement, api: EditorAPI) => void;
}

// ============================================================================
// Editor Configuration
// ============================================================================

/**
 * Main configuration for the Visual Editor component
 */
export interface VisualEditorProps {
  /** Current editor mode */
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

  /** Callback when an element is selected */
  onSelectionChange?: (element: EditorElement | null) => void;

  /** Callback for export action */
  onExport?: (data: CanvasExport) => void;

  /** Custom element renderers (extends mode elements) */
  customElements?: ElementRenderer[];

  /** Whether to show the toolbar */
  showToolbar?: boolean;

  /** Whether to show the inspector panel */
  showInspector?: boolean;

  /** Custom CSS class */
  className?: string;

  /** Custom styles */
  style?: React.CSSProperties;
}

// ============================================================================
// Internal State Types
// ============================================================================

/**
 * Internal editor state (not exposed externally)
 */
export interface EditorState {
  elements: EditorElement[];
  selectedElementId: string | null;
  canvasSize: {
    width: number;
    height: number;
  };
  zoom: number;
  pan: {
    x: number;
    y: number;
  };
  mode: EditorMode | null;
  history: {
    past: EditorElement[][];
    future: EditorElement[][];
  };
}

/**
 * Actions for state management
 */
export type EditorAction =
  | { type: "ADD_ELEMENT"; element: EditorElement }
  | { type: "UPDATE_ELEMENT"; id: string; updates: Partial<EditorElement> }
  | { type: "REMOVE_ELEMENT"; id: string }
  | { type: "SELECT_ELEMENT"; id: string | null }
  | { type: "SET_ELEMENTS"; elements: EditorElement[] }
  | { type: "LOAD_ELEMENTS"; elements: EditorElement[] } // Load without recording history
  | { type: "REORDER_ELEMENT"; elementId: string; newIndex: number }
  | { type: "SET_CANVAS_SIZE"; width: number; height: number }
  | { type: "SET_ZOOM"; zoom: number }
  | { type: "SET_PAN"; x: number; y: number }
  | { type: "SET_MODE"; mode: EditorMode }
  | { type: "CLEAR" }
  | { type: "UNDO" }
  | { type: "REDO" };
