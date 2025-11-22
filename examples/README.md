# Visual Editor Examples

This directory contains comprehensive examples demonstrating various features and use cases of the `@deckedout/visual-editor` package.

## Examples Overview

### 1. Basic Usage (`01-basic-usage.tsx`)
The simplest way to get started with the visual editor.
- Full-featured workspace
- Built-in text and image elements
- Complete UI with toolbar, inspector, and layers panel

**Use Case:** Quick integration, prototyping, learning the basics

### 2. Controlled Mode (`02-controlled-mode.tsx`)
Managing editor state externally for data persistence and integration.
- External state management
- Save/load functionality
- Export/import capabilities
- Integration with localStorage or APIs

**Use Case:** Applications requiring data persistence, undo/redo across sessions, integration with backend

### 3. Custom Elements (`03-custom-elements.tsx`)
Creating custom element types with unique properties and behaviors.
- Define custom element renderers
- Custom property schemas
- Inspector integration
- Konva canvas rendering

**Use Case:** Specialized elements (shapes, charts, custom components), domain-specific editors

### 4. Programmatic API (`04-programmatic-api.tsx`)
Using the editor API to manipulate elements programmatically.
- Add/update/remove elements via code
- Batch operations
- Element transformations
- Canvas management

**Use Case:** Automated layouts, templates, external triggers, integration with other systems

### 5. Editor Modes (`05-editor-modes.tsx`)
Configuring different editor modes for specific use cases.
- Custom toolbar configuration
- Mode-specific behaviors
- Custom actions and controls
- UI customization

**Use Case:** Multi-purpose editors, specialized workflows, branded interfaces

### 6. Asset Picker (`06-asset-picker.tsx`)
Integrating asset management and selection.
- Asset library integration
- Drag-and-drop support
- Custom asset rendering
- Dynamic asset loading

**Use Case:** Game editors, media-rich applications, component libraries

## Getting Started

### Installation

```bash
npm install @deckedout/visual-editor
```

### Running Examples

Each example is a standalone React component. To use an example:

```tsx
import React from 'react';
import { BasicEditorExample } from './examples/01-basic-usage';

function App() {
  return <BasicEditorExample />;
}

export default App;
```

### Required Styles

Make sure to import the required styles in your main file:

```tsx
import '@deckedout/visual-editor/dist/index.css';
```

## Common Patterns

### State Management

```tsx
import { useEditorState } from '@deckedout/visual-editor';

function MyEditor() {
  const { state, api, undo, redo, canUndo, canRedo } = useEditorState();
  
  // Use state and API as needed
  return <VisualEditorWorkspace />;
}
```

### Element Creation

```tsx
import { createElement } from '@deckedout/visual-editor';

const element = createElement('text', {
  content: 'Hello World',
  fontSize: 24,
  color: '#000000'
}, {
  position: { x: 100, y: 100 },
  size: { width: 200, height: 50 }
});

api.addElement(element);
```

### Data Persistence

```tsx
import { exportToJSON, importFromJSON } from '@deckedout/visual-editor';

// Export
const json = exportToJSON(canvasData);
localStorage.setItem('canvas', json);

// Import
const json = localStorage.getItem('canvas');
const data = importFromJSON(json);
```

### Custom Element Types

```tsx
import { ElementRenderer } from '@deckedout/visual-editor';

const MyElementRenderer: ElementRenderer<MyProps> = {
  type: 'my-element',
  displayName: 'My Element',
  defaultProps: { /* ... */ },
  inspectorSchema: [ /* ... */ ],
  render: (element) => { /* ... */ },
  renderComponent: ({ element, isSelected, onSelect, onTransform }) => {
    return <MyKonvaComponent />;
  }
};
```

## API Reference

### Core Hooks

- **`useEditorState(initialMode?)`** - Main state management hook
- **`useElementRegistry(initialRenderers?)`** - Element registry management
- **`useIsMobile()`** - Mobile detection hook

### Components

- **`VisualEditorWorkspace`** - Complete editor workspace
- **`VisualEditor`** - Core editor component
- **`Canvas`** - Rendering canvas
- **`Inspector`** - Property inspector panel
- **`LayersPanel`** - Element layers panel
- **`Toolbar`** - Element creation toolbar
- **`AssetPicker`** - Asset selection panel

### Utilities

- **`createElement(type, props, options)`** - Create element
- **`cloneElement(element)`** - Clone element
- **`duplicateElement(element, offset)`** - Duplicate with offset
- **`exportToJSON(data)`** - Export canvas data
- **`importFromJSON(json)`** - Import canvas data
- **`sortByZIndex(elements)`** - Sort by layer order
- **`getSnappingPosition(...)`** - Calculate snapping

## TypeScript Support

All examples include full TypeScript type definitions:

```tsx
import { 
  EditorElement,
  EditorAPI,
  EditorMode,
  ElementRenderer,
  CanvasExport,
  InspectorFieldSchema
} from '@deckedout/visual-editor';
```

## Best Practices

1. **Use Controlled Mode** for applications requiring data persistence
2. **Memoize Callbacks** when passing props to prevent unnecessary re-renders
3. **Define Element Types** separately for better code organization
4. **Use TypeScript** for better type safety and IDE support
5. **Handle Errors** when importing/exporting data
6. **Test Element Renderers** independently before integration
7. **Optimize Custom Renderers** for performance with large canvases

## Troubleshooting

### Common Issues

**Elements not appearing:**
- Check that `visible` property is not set to `false`
- Verify element is within canvas bounds
- Check z-index ordering

**Inspector not updating:**
- Ensure `inspectorSchema` is properly defined
- Check that field names match element props
- Verify field types are supported

**Performance issues:**
- Reduce number of elements on canvas
- Optimize custom render components
- Use React.memo for custom components
- Disable snap guides if not needed

## Contributing

Found a bug or have a suggestion? Please open an issue on GitHub.

Want to add an example? Submit a pull request with:
- Example file following naming convention
- Documentation in this README
- Clear comments explaining the use case

## License

MIT License - See LICENSE file for details

## Support

- Documentation: https://deckedout.fr/dev/docs/editor/
- GitHub: https://github.com/EIP-DeckedOut-Orga/eip-visual-editor-package
- NPM: https://www.npmjs.com/package/@deckedout/visual-editor
