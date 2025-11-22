# Visual Editor - Quick API Reference

## Core Hooks

### `useEditorState(initialMode?)`
Main state management hook for the editor.

```tsx
const { state, api, undo, redo, canUndo, canRedo, setCanvasSize, setMode } = useEditorState(initialMode);
```

**Returns:**
- `state`: Current editor state (elements, selection, canvas size, history)
- `api`: EditorAPI for manipulating elements
- `undo()`: Undo last action
- `redo()`: Redo last undone action
- `canUndo`: Boolean indicating if undo is available
- `canRedo`: Boolean indicating if redo is available
- `setCanvasSize(width, height)`: Update canvas dimensions
- `setMode(mode)`: Change editor mode

### `useElementRegistry(initialRenderers?)`
Hook for managing element renderers.

```tsx
const registry = useElementRegistry([TextElement, ImageElement]);
```

### `useIsMobile()`
Detect if viewport is mobile-sized (<768px).

```tsx
const isMobile = useIsMobile();
```

## Components

### `<VisualEditorWorkspace />`
Complete editor workspace with all panels.

```tsx
<VisualEditorWorkspace
  mode={editorMode}              // EditorMode configuration
  initialData={canvasData}       // Initial canvas state
  onChange={(data) => {}}        // Canvas change callback
  width={800}                    // Canvas width
  height={600}                   // Canvas height
  readonly={false}               // Disable editing
  showToolbar={true}             // Show element creation toolbar
  showTopbar={true}              // Show undo/redo/controls
  showInspector={true}           // Show property inspector
  showLayers={true}              // Show layers panel
  showAssetPicker={false}        // Show asset picker panel
  showCanvas={true}              // Show canvas
  enableSnapGuides={true}        // Enable snapping
  customElements={[]}            // Custom element renderers
/>
```

### `<Canvas />`
Konva canvas for rendering elements.

```tsx
<Canvas
  canvasSize={{ width: 800, height: 600 }}
  elements={elements}
  selectedElementId={selectedId}
  registry={elementRegistry}
  mode={editorMode}
  readonly={false}
  enableSnapGuides={true}
  enablePanZoom={false}
  backgroundImageUrl={undefined}
  hideElements={false}
  onSelectElement={(id) => {}}
  onTransformElement={(id, updates) => {}}
/>
```

### `<Inspector />`
Property inspector panel for selected element.

```tsx
<Inspector
  selectedElement={element}
  elementRenderer={renderer}
  api={editorAPI}
  mode={editorMode}
  canvasSize={canvasSize}
  setCanvasSize={(w, h) => {}}
/>
```

### `<LayersPanel />`
Element layers management panel.

```tsx
<LayersPanel
  elements={elements}
  selectedElementId={selectedId}
  api={editorAPI}
  elementRenderers={rendererMap}
/>
```

### `<Toolbar />`
Element creation toolbar.

```tsx
<Toolbar
  api={editorAPI}
  elementRenderers={renderers}
  canvasSize={canvasSize}
  config={toolbarConfig}
/>
```

### `<AssetPicker />`
Asset selection panel.

```tsx
<AssetPicker
  assets={assetList}
  onAssetSelect={(path) => {}}
  renderAsset={(asset) => <div />}
  title="Assets"
/>
```

## EditorAPI

### Element CRUD

```tsx
api.addElement(element)                    // Add new element
api.updateElement(id, updates)             // Update element properties
api.removeElement(id)                      // Delete element
api.loadElements(elements)                 // Load without history
api.clear()                                // Remove all elements
```

### Selection

```tsx
api.selectElement(id)                      // Select element (or null)
api.getSelectedElement()                   // Get selected element
```

### Queries

```tsx
api.getAllElements()                       // Get all elements array
```

### Transformations

```tsx
api.moveElement(id, deltaX, deltaY)        // Move by offset
api.rotateElement(id, angle)               // Set rotation
api.resizeElement(id, width, height)       // Set size
api.updateZIndex(id, zIndex)               // Change layer order
api.reorderElement(id, newIndex)           // Change array position
```

### Clipboard

```tsx
api.copyElement(id)                        // Copy to clipboard
api.pasteElement(element, offset)          // Paste from clipboard
api.duplicateElement(id, offset)           // Clone with offset
```

### History

```tsx
api.clearHistory()                         // Reset undo/redo
```

### Import/Export

```tsx
api.exportJSON()                           // Get CanvasExport
api.importJSON(data)                       // Load CanvasExport
```

## Utility Functions

### Element Creation

```tsx
createElement(type, props, options)        // Create new element
cloneElement(element)                      // Deep clone
duplicateElement(element, offset)          // Clone with offset
```

### Element Queries

```tsx
sortByZIndex(elements)                     // Sort by layer order
getMaxZIndex(elements)                     // Get highest z-index
getElementCenter(element)                  // Get center point
```

### Z-Index Management

```tsx
bringToFront(elements, id)                 // Move to top
sendToBack(elements, id)                   // Move to bottom
```

### Collision Detection

```tsx
checkOverlap(rect1, rect2)                 // Check if rects overlap
pointInRect(point, rect)                   // Check if point in rect
```

### Snapping

```tsx
snapToGrid(value, gridSize)                // Snap value to grid
snapPositionToGrid(position, gridSize)     // Snap position to grid
getSnappingPosition(element, x, y, allElements, options)  // Smart snapping
```

### Canvas Constraints

```tsx
constrainToCanvas(position, size, canvasSize)  // Keep within bounds
clamp(value, min, max)                         // Clamp value
```

### Math Utilities

```tsx
distance(p1, p2)                           // Distance between points
degToRad(degrees)                          // Degrees to radians
radToDeg(radians)                          // Radians to degrees
getRotatedBoundingBox(x, y, w, h, rot)     // Rotated bounding box
```

### Data Management

```tsx
exportToJSON(data)                         // Serialize to JSON string
importFromJSON(json)                       // Parse JSON string
isValidElement(element)                    // Validate element
isValidCanvasExport(data)                  // Validate canvas data
generateElementId()                        // Generate unique ID
```

## Type Definitions

### Core Types

```tsx
EditorElement<TProps>      // Base element interface
EditorState                // Editor state structure
EditorAPI                  // API interface
EditorMode                 // Mode configuration
EditorAction               // Action type
```

### Element Types

```tsx
ElementRenderer<TProps>    // Element renderer definition
TextElementProps           // Built-in text props
ImageElementProps          // Built-in image props
```

### Inspector Types

```tsx
InspectorFieldSchema       // Field schema definition
InspectorFieldType         // Field type enum
CustomRendererProps        // Custom renderer props
```

### Canvas Types

```tsx
CanvasExport              // Export/import format
```

### Custom Actions

```tsx
CustomEditorButtonAction      // Button action
CustomEditorDropdownAction    // Dropdown action
CustomEditorInputAction       // Input action
CustomEditorColorAction       // Color picker action
CustomEditorToggleAction      // Toggle action
CustomEditorSeparator         // Visual separator
```

### Configuration

```tsx
TopbarConfig              // Topbar controls config
ToolbarConfig             // Toolbar config
```

## Element Renderer Structure

```tsx
const MyElementRenderer: ElementRenderer<MyProps> = {
  type: 'my-element',                    // Unique identifier
  displayName: 'My Element',             // UI label
  icon: <Icon />,                        // Toolbar icon
  
  defaultProps: {                        // Initial properties
    // ... custom props
  },
  
  defaultSize: {                         // Initial dimensions
    width: 100,
    height: 100
  },
  
  inspectorSchema: [                     // Property inspector
    {
      name: 'propName',
      type: 'string',
      label: 'Display Label',
      description: 'Help text'
    }
  ],
  
  render: (element) => {                 // Non-Konva render
    return <div>{/* ... */}</div>;
  },
  
  renderComponent: ({ element, isSelected, onSelect, onTransform }) => {
    return <KonvaShape />;               // Konva render
  }
};
```

## Editor Mode Structure

```tsx
const myMode: EditorMode = {
  id: 'my-mode',
  name: 'My Mode',
  description: 'Mode description',
  
  canvasSize: {
    width: 800,
    height: 600
  },
  
  toolbarConfig: {
    showElementTools: true,
    hiddenElementTypes: [],
    toolsStart: [],
    toolsEnd: []
  },
  
  topbarConfig: {
    showUndo: true,
    showRedo: true,
    showDelete: true,
    showCopy: true,
    showPaste: true,
    showDuplicate: true,
    showImport: true,
    showExport: true
  },
  
  assetPickerConfig: {
    title: 'Assets'
  }
};
```

## Snapping Options

```tsx
interface SnapOptions {
  threshold?: number;           // Snap distance (default: 5px)
  snapToElements?: boolean;     // Snap to other elements
  snapToCanvas?: boolean;       // Snap to canvas edges
  canvasSize?: {                // Canvas dimensions
    width: number;
    height: number;
  };
}
```

## Common Patterns

### Creating and Adding Elements

```tsx
const element = createElement('text', {
  content: 'Hello',
  fontSize: 24,
  color: '#000000'
}, {
  position: { x: 100, y: 100 },
  size: { width: 200, height: 50 }
});

api.addElement(element);
```

### Updating Selected Element

```tsx
const selected = api.getSelectedElement();
if (selected) {
  api.updateElement(selected.id, {
    props: {
      ...selected.props,
      fontSize: 32
    }
  });
}
```

### Batch Updates

```tsx
const elements = api.getAllElements();
elements.forEach(element => {
  api.updateElement(element.id, {
    opacity: 0.5
  });
});
```

### Export/Import

```tsx
// Export
const data = api.exportJSON();
const json = exportToJSON(data);
localStorage.setItem('canvas', json);

// Import
const json = localStorage.getItem('canvas');
if (json) {
  const data = importFromJSON(json);
  api.importJSON(data);
}
```

### Custom Element Registration

```tsx
const registry = useElementRegistry();

registry.register(MyCustomElement);
registry.registerMany([Element1, Element2, Element3]);

const renderer = registry.get('my-element');
```

## Events and Callbacks

```tsx
<VisualEditorWorkspace
  onChange={(data: CanvasExport) => {
    // Canvas changed - save, sync, etc.
  }}
/>

<AssetPicker
  onAssetSelect={(path: string) => {
    // Asset selected - create image element
  }}
/>

<Canvas
  onSelectElement={(id: string | null) => {
    // Element selected/deselected
  }}
  onTransformElement={(id: string, updates: Partial<EditorElement>) => {
    // Element transformed (moved, resized, rotated)
  }}
/>
```

## For More Information

- **Full Documentation**: https://deckedout.fr/dev/docs/editor/
- **Examples**: See `/examples` directory
- **GitHub**: https://github.com/EIP-DeckedOut-Orga/eip-visual-editor-package
- **NPM**: https://www.npmjs.com/package/@deckedout/visual-editor
