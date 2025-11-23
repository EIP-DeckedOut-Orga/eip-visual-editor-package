# Basic Visual Editor Demo

A simple demonstration of `@deckedout/visual-editor` with all core features enabled.

## Features Demonstrated

- 🎨 Visual canvas editor with drag-and-drop
- 🔧 Toolbar with element creation tools
- 📐 Inspector panel for editing properties
- 📦 Layers panel for organization
- 🎯 Smart snap guides for alignment
- ↩️ Undo/redo functionality

## Quick Start

This demo runs on StackBlitz with zero configuration needed.

Click "Open in StackBlitz" to try it instantly!

## What You Can Do

1. **Add Elements**: Click the toolbar buttons to add text or image elements
2. **Select & Edit**: Click elements to select them and edit properties in the inspector
3. **Move & Resize**: Drag elements around and use handles to resize
4. **Rotate**: Use the rotation handle to rotate elements
5. **Organize**: Use the layers panel to reorder or hide elements
6. **Align**: Elements snap to alignment guides for precise positioning

## Code

The entire demo is just a few lines of code:

```jsx
import { VisualEditorWorkspace } from '@deckedout/visual-editor'

export default function App() {
  return (
    <VisualEditorWorkspace
      showToolbar={true}
      showTopbar={true}
      showInspector={true}
      showLayers={true}
      enableSnapGuides={true}
    />
  )
}
```

## Learn More

- [Full Documentation](https://github.com/EIP-DeckedOut-Orga/eip-visual-editor-package)
- [npm Package](https://www.npmjs.com/package/@deckedout/visual-editor)
- [More Examples](https://github.com/EIP-DeckedOut-Orga/eip-visual-editor-package/tree/main/example-vite)
