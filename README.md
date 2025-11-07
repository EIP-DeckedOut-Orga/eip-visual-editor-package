# @deckedout/visual-editor

A flexible, drag-and-drop visual editor built with React and Konva for creating interactive canvases with customizable elements.

## Features

- 🎨 **Visual Canvas Editor**: Drag, resize, and rotate elements on a canvas
- 🔧 **Extensible Element System**: Create custom element types with renderers
- 📐 **Smart Snapping**: Automatic alignment guides and grid snapping
- 🎯 **Inspector Panel**: Dynamic property editing for selected elements
- 📦 **Layer Management**: Organize elements with a layer panel
- 🎭 **Multiple Modes**: Edit and preview modes
- 📸 **Export Support**: Export canvas to JSON or image formats
- 🎨 **Asset Management**: Built-in asset picker for images

## Installation

```bash
npm install @deckedout/visual-editor
# or
yarn add @deckedout/visual-editor
# or
pnpm add @deckedout/visual-editor
```

### Peer Dependencies

Make sure you have the required peer dependencies installed:

```bash
npm install react react-dom
```

### Tailwind CSS (Optional)

This package uses Tailwind CSS. If you're using Tailwind in your project, add the package to your `tailwind.config.js`:

```js
module.exports = {
  content: [
    // ... your other content
    './node_modules/@deckedout/visual-editor/dist/**/*.{js,mjs}',
  ],
  // ... rest of config
}
```

If you're not using Tailwind, you can import the pre-built styles:

```js
import '@deckedout/visual-editor/styles';
```

## Quick Start

```tsx
import { VisualEditorWorkspace } from '@deckedout/visual-editor';
import { useState } from 'react';

function App() {
  const [mode, setMode] = useState('edit');

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <VisualEditorWorkspace
        canvasWidth={800}
        canvasHeight={600}
        mode={mode}
        showInspector={true}
        showLayers={true}
      />
    </div>
  );
}
```

## Core Components

### VisualEditorWorkspace

The main workspace component that includes the canvas, inspector, and layers panel.

```tsx
<VisualEditorWorkspace
  canvasWidth={800}
  canvasHeight={600}
  mode="edit" // 'edit' | 'preview'
  showInspector={true}
  showLayers={true}
  backgroundColor="#ffffff"
  onExport={(data) => console.log(data)}
/>
```

### VisualEditor

The core editor component without the workspace UI.

```tsx
import { VisualEditor } from '@deckedout/visual-editor';

<VisualEditor
  canvasWidth={800}
  canvasHeight={600}
  mode="edit"
  elements={elements}
  onElementsChange={setElements}
/>
```

## Custom Elements

Create custom element types by implementing the `ElementRenderer` interface:

```tsx
import { ElementRenderer, EditorElement } from '@deckedout/visual-editor';

export const customElementRenderer: ElementRenderer = {
  type: 'custom',
  name: 'Custom Element',
  icon: '🎨',
  
  // Default props when creating new element
  defaultProps: {
    color: '#000000',
    text: 'Hello World',
  },
  
  // Inspector fields for property editing
  inspectorFields: [
    {
      name: 'text',
      label: 'Text',
      type: 'text',
    },
    {
      name: 'color',
      label: 'Color',
      type: 'color',
    },
  ],
  
  // Render function for the element
  render: (element, isSelected, isPreview) => {
    return (
      <div style={{ color: element.props.color }}>
        {element.props.text}
      </div>
    );
  },
};
```

Register your custom element:

```tsx
import { globalElementRegistry } from '@deckedout/visual-editor';

globalElementRegistry.register(customElementRenderer);
```

## API Reference

### Types

- `EditorElement`: Base element type with position, size, rotation, etc.
- `ElementRenderer`: Interface for custom element renderers
- `EditorAPI`: API for programmatic control
- `EditorMode`: 'edit' | 'preview'
- `InspectorFieldSchema`: Field configuration for the inspector

### Hooks

- `useEditorState()`: Access editor state and actions
- `useElementRegistry()`: Access element registry

### Utilities

- `globalElementRegistry`: Global registry for element types
- Built-in elements: `textElementRenderer`, `imageElementRenderer`

## Examples

### Basic Editor

```tsx
import { VisualEditorWorkspace } from '@deckedout/visual-editor';

function BasicEditor() {
  return (
    <div style={{ width: '100%', height: '600px' }}>
      <VisualEditorWorkspace
        canvasWidth={800}
        canvasHeight={600}
      />
    </div>
  );
}
```

### With Custom Elements

```tsx
import { 
  VisualEditorWorkspace, 
  globalElementRegistry,
  textElementRenderer,
  imageElementRenderer 
} from '@deckedout/visual-editor';
import { myCustomElement } from './elements';

// Register elements
globalElementRegistry.register(textElementRenderer);
globalElementRegistry.register(imageElementRenderer);
globalElementRegistry.register(myCustomElement);

function EditorWithCustomElements() {
  return <VisualEditorWorkspace canvasWidth={800} canvasHeight={600} />;
}
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
