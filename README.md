# @deckedout/visual-editor

[![CI](https://github.com/EIP-DeckedOut-Orga/eip-visual-editor-package/actions/workflows/ci.yml/badge.svg)](https://github.com/EIP-DeckedOut-Orga/eip-visual-editor-package/actions/workflows/ci.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=EIP-DeckedOut-Orga_eip-visual-editor-package&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=EIP-DeckedOut-Orga_eip-visual-editor-package)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=EIP-DeckedOut-Orga_eip-visual-editor-package&metric=coverage)](https://sonarcloud.io/summary/new_code?id=EIP-DeckedOut-Orga_eip-visual-editor-package)
[![npm version](https://badge.fury.io/js/@deckedout%2Fvisual-editor.svg)](https://badge.fury.io/js/@deckedout%2Fvisual-editor)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A flexible, drag-and-drop visual editor built with React and Konva for creating interactive canvases with customizable elements.

## 🚀 Try It Online

**[Open in StackBlitz](https://stackblitz.com/github/EIP-DeckedOut-Orga/eip-visual-editor-package/tree/main/example-vite?file=src/App.tsx)** - Interactive demo with 3 examples

> **⚠️ Note:** StackBlitz link will work once the repository is public on GitHub. See [STACKBLITZ.md](./STACKBLITZ.md) for setup.

Once opened in StackBlitz, navigate between:
- **`/`** - Basic Editor with all core features
- **`/custom-mode`** - Card Designer with custom toolbar/topbar
- **`/with-assets`** - Asset Picker with game assets

> 💡 **Tip**: Fork the demo and start customizing immediately!

## 📸 Screenshots

<!-- TODO: Add screenshots here -->
<!-- Recommended: 
  - Main editor interface showing all panels
  - Custom mode example (card designer)
  - Asset picker in action
  - Inspector panel detail
  - Mobile responsive view (if applicable)
-->

**Editor Interface:**
> _Screenshot placeholder - Add image showing the full editor with toolbar, canvas, inspector, and layers panel_

**Custom Mode - Card Designer:**
> _Screenshot placeholder - Add image showing custom canvas size and custom toolbar/topbar_

**Asset Picker:**
> _Screenshot placeholder - Add image showing the asset picker panel with game assets_

**Demo GIF:**
> _GIF placeholder - Add animated GIF showing drag-drop, resize, rotate, and edit workflow_

## Features

- 🎨 **Visual Canvas Editor**: Drag, resize, and rotate elements on a canvas
- 🔧 **Extensible Element System**: Create custom element types with renderers
- 📐 **Smart Snapping**: Automatic alignment guides and grid snapping
- 🎯 **Inspector Panel**: Dynamic property editing for selected elements
- 📦 **Layer Management**: Organize elements with a layer panel
- 🎭 **Multiple Modes**: Edit and preview modes
- 📸 **Export Support**: Export canvas to JSON or image formats
- 🎨 **Asset Management**: Built-in asset picker for images
- ✅ **Well Tested**: 95%+ code coverage with comprehensive test suite

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

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <VisualEditorWorkspace
        showToolbar={true}
        showTopbar={true}
        showInspector={true}
        showLayers={true}
        enableSnapGuides={true}
      />
    </div>
  );
}
```

**Want to see it in action?** Check out the [live Vite example](#-live-examples) with three interactive demos!

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

## 🎯 Live Examples

A complete **Vite + React example project** with three interactive demos:

### [📁 example-vite/](./example-vite) - Full Application

**[Try in StackBlitz →](https://stackblitz.com/github/EIP-DeckedOut-Orga/eip-visual-editor-package/tree/main/example-vite?file=src/App.tsx)**

**Or run locally:**
```bash
cd example-vite
npm install
npm run dev
```

**Included Demos:**

1. **[Basic Editor](./example-vite/src/pages/BasicEditor.tsx)** (`/`)
   - Simple integration with all default features
   - All panels enabled (toolbar, topbar, inspector, layers)
   - Snap guides and alignment helpers
   - Perfect starting point for new projects

2. **[Custom Mode](./example-vite/src/pages/CustomMode.tsx)** (`/custom-mode`)
   - Card designer with 750×1050 custom canvas
   - Custom toolbar with "Load Template" action
   - Custom topbar with "Export PNG" button
   - Auto-save functionality with visual indicator
   - Background color and grid configuration
   - Shows advanced editor customization

3. **[Asset Picker](./example-vite/src/pages/WithAssets.tsx)** (`/with-assets`)
   - Asset management integration
   - Mock game assets (sprites, backgrounds, items)
   - **Background upload** - Upload custom images via file picker
   - Dynamic background selector - Uploaded images added to dropdown
   - 1200×800 canvas with dark theme
   - Grid overlay for precise positioning

**Features demonstrated:**
- 🎨 Custom canvas sizes and layouts
- 🔧 Toolbar and topbar customization
- 📦 Asset picker integration
- 💾 State persistence and auto-save
- 🎭 Different editor modes
- 🌙 Dark mode theming

See the [example-vite/README.md](./example-vite/README.md) for full setup instructions and customization guide.

## 📘 Code Examples

### Basic Editor

```tsx
import { VisualEditorWorkspace } from '@deckedout/visual-editor';

function BasicEditor() {
  return (
    <div style={{ width: '100%', height: '600px' }}>
      <VisualEditorWorkspace
        showToolbar={true}
        showTopbar={true}
        showInspector={true}
        showLayers={true}
        enableSnapGuides={true}
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
  return <VisualEditorWorkspace />;
}
```

### With Asset Picker

```tsx
import { VisualEditorWorkspace } from '@deckedout/visual-editor';

const assets = [
  { name: 'Character', path: '/assets/character.png', type: 'sprite' },
  { name: 'Background', path: '/assets/bg.png', type: 'background' }
];

function EditorWithAssets() {
  return (
    <VisualEditorWorkspace
      showAssetPicker={true}
      mode={{
        name: 'Asset Editor',
        assetPickerProps: { assets }
      }}
    />
  );
}
```

## 📚 Documentation

### Full API Documentation
Available at: [https://deckedout.fr/dev/docs/editor/](https://deckedout.fr/dev/docs/editor/)

### TypeScript Examples (`/examples`)

Comprehensive standalone examples showing specific features:

- **[01-basic-usage.tsx](./examples/01-basic-usage.tsx)** - Quickstart with minimal configuration
- **[02-controlled-mode.tsx](./examples/02-controlled-mode.tsx)** - External state management and persistence
- **[03-custom-elements.tsx](./examples/03-custom-elements.tsx)** - Creating custom element types
- **[04-programmatic-api.tsx](./examples/04-programmatic-api.tsx)** - Using the editor API programmatically
- **[05-editor-modes.tsx](./examples/05-editor-modes.tsx)** - Configuring different editor modes
- **[06-asset-picker.tsx](./examples/06-asset-picker.tsx)** - Integrating asset management

See the [examples README](./examples/README.md) for detailed documentation and usage patterns.

### Runnable Vite Example (`/example-vite`)

Complete working application with React Router and three interactive demos:

- **[BasicEditor.tsx](./example-vite/src/pages/BasicEditor.tsx)** - Simple integration
- **[CustomMode.tsx](./example-vite/src/pages/CustomMode.tsx)** - Card designer with custom toolbar/topbar
- **[WithAssets.tsx](./example-vite/src/pages/WithAssets.tsx)** - Asset picker and background selector

Run it locally: `cd example-vite && npm install && npm run dev`

Full guide: [example-vite/README.md](./example-vite/README.md)

### Generating Documentation Locally

```bash
# Generate documentation
npm run docs

# Watch mode (regenerates on file changes)
npm run docs:watch
```

Documentation is automatically generated and deployed to the server on every push to the main branch.

## Development

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Building

```bash
# Build the package
npm run build

# Type check
npm run type-check

# Lint
npm run lint
```

### Testing Coverage

This package maintains high test coverage:
- **95.26%** statements
- **94.2%** branches  
- **93.05%** functions
- **95.77%** lines

See [TESTING.md](./TESTING.md) for detailed testing documentation.

## Contributing

Contributions are welcome! Please ensure:
1. All tests pass (`npm test`)
2. Code coverage remains above 90%
3. Code is properly linted (`npm run lint`)
4. Types are correct (`npm run type-check`)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
