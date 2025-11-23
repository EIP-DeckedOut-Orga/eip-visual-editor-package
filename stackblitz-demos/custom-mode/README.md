# Custom Mode Demo - Card Designer

Advanced demonstration of `@deckedout/visual-editor` with custom toolbar, topbar, and auto-save functionality.

## Features Demonstrated

- 🎴 Custom canvas size for card design (750×1050)
- 🔧 Custom toolbar with "Load Template" button
- 💾 Auto-save with visual indicator
- 🎨 Custom topbar with "Export PNG" button
- 📐 Grid overlay and snap settings
- ⚙️ Mode lifecycle hooks

## What Makes This Advanced

Unlike the basic demo, this shows how to:

1. **Define Custom Modes**: Create specialized editor configurations for specific use cases
2. **Custom Toolbar Actions**: Add buttons that interact with the editor API
3. **Custom Topbar Controls**: Add export functionality and status indicators
4. **State Management**: Handle canvas data changes with auto-save logic
5. **Debouncing**: Prevent excessive saves by debouncing user edits

## Try It Out

1. Click **"Load Template"** to populate the canvas with a card background and title
2. Edit the title text and styling using the inspector panel
3. Add more elements from the toolbar
4. Watch the **"Saved"** indicator update as you make changes
5. Click **"Export PNG"** to see the export functionality (check console)

## Code Highlights

### Custom Mode Definition

```jsx
const cardDesignerMode = {
  name: 'Card Designer',
  defaultCanvasSize: { width: 750, height: 1050 },
  backgroundColor: '#f0f4f8',
  showGrid: true,
  
  toolbarConfig: {
    toolsStart: [
      {
        type: 'button',
        id: 'load-template',
        label: 'Load Template',
        onClick: (api) => {
          api.loadElements([...templateElements])
        }
      }
    ]
  },
  
  topbarConfig: {
    actionsEnd: [
      {
        type: 'button',
        id: 'export-png',
        label: 'Export PNG',
        onClick: () => exportCard()
      }
    ]
  }
}
```

### Auto-Save Pattern

```jsx
const handleChange = useCallback((data) => {
  setCanvasData(data)
  
  // Debounce save (1 second after last edit)
  if (saveTimerRef.current) {
    clearTimeout(saveTimerRef.current)
  }
  
  saveTimerRef.current = setTimeout(() => {
    saveToBackend(data)
  }, 1000)
}, [])
```

## Learn More

- [Full Documentation](https://github.com/EIP-DeckedOut-Orga/eip-visual-editor-package)
- [API Reference](https://github.com/EIP-DeckedOut-Orga/eip-visual-editor-package/blob/main/API_REFERENCE.md)
- [More Examples](https://github.com/EIP-DeckedOut-Orga/eip-visual-editor-package/tree/main/example-vite)
