# Visual Editor - Vite + React Example

A complete example demonstrating how to integrate `@deckedout/visual-editor` into a Vite + React application.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- React 18.x (the visual editor currently uses react-konva v18)
- The parent package must be built first

### Installation

1. **Build the main package** (from the root directory):
   ```bash
   cd ..
   npm install
   npm run build
   ```

2. **Install dependencies** (in this directory):
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:3000`

## 📁 Project Structure

```
example-vite/
├── src/
│   ├── pages/
│   │   ├── BasicEditor.tsx      # Simple editor integration
│   │   ├── CustomMode.tsx       # Custom mode with toolbar/topbar
│   │   └── WithAssets.tsx       # Asset picker integration
│   ├── App.tsx                  # Main app with routing
│   ├── App.css                  # App styles
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles
├── index.html                   # HTML template
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript config
└── package.json                 # Dependencies
```

## 🎯 Examples Included

### 1. Basic Editor (`/`)
The simplest integration showing default editor functionality:
- All panels enabled (toolbar, topbar, inspector, layers)
- Default canvas size
- Snap guides enabled

```tsx
import { VisualEditorWorkspace } from '@deckedout/visual-editor'

export default function BasicEditor() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <VisualEditorWorkspace
        showToolbar={true}
        showTopbar={true}
        showInspector={true}
        showLayers={true}
        enableSnapGuides={true}
      />
    </div>
  )
}
```

### 2. Custom Mode (`/custom-mode`)
Demonstrates advanced customization:
- Custom canvas size (750×1050 for card design)
- Custom toolbar with "Load Template" button
- Custom topbar with "Export PNG" button
- Background color and grid settings
- Mode lifecycle hooks

Key features:
- **Custom canvas dimensions** for specific use cases
- **Custom toolbar actions** that manipulate the editor
- **Custom topbar controls** for additional functionality
- **Grid and snap settings** for precise layout

### 3. With Assets (`/with-assets`)
Shows asset management with file upload:
- Asset picker panel enabled
- Mock game assets provided
- **Background upload button** - Upload custom backgrounds
- Dynamic background list - Uploaded images appear in dropdown
- Custom canvas size (1200×800)
- Dark background theme
- Grid overlay

Perfect for:
- Game asset management with custom uploads
- Dynamic asset libraries
- User-provided content
- Design systems with flexible assets

## 🔧 Configuration

### Vite Configuration

The `vite.config.ts` includes optimization for the visual editor:

```ts
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@deckedout/visual-editor']
  }
})
```

### TypeScript Configuration

TypeScript is configured with strict mode and proper React JSX settings in `tsconfig.json`.

## 📦 Package Integration

The example uses a local file reference to the parent package:

```json
{
  "dependencies": {
    "@deckedout/visual-editor": "file:.."
  }
}
```

**Important**: You must build the parent package (`npm run build` from root) before the dependencies will work correctly.

## 🎨 Customization Guide

### Creating Custom Modes

```tsx
const customMode: EditorMode = {
  name: 'My Mode',
  displayName: 'My Custom Mode',
  
  // Canvas settings
  defaultCanvasSize: { width: 1000, height: 600 },
  backgroundColor: '#f0f0f0',
  showGrid: true,
  gridSize: 50,
  
  // Toolbar customization
  toolbarConfig: {
    showElementTools: true,
    toolsStart: [
      // Add custom buttons/controls
    ]
  },
  
  // Topbar customization
  topbarConfig: {
    showUndo: true,
    showRedo: true,
    actionsEnd: [
      // Add custom actions
    ]
  }
}
```

### Adding Custom Assets

```tsx
const assets = [
  {
    name: 'Asset Name',
    path: 'https://example.com/image.png',
    type: 'category' // optional
  }
]

<VisualEditorWorkspace
  showAssetPicker={true}
  assets={assets}
/>
```

### Handling Editor Events

```tsx
<VisualEditorWorkspace
  onChange={(data) => {
    // Called when canvas data changes
    console.log('Canvas updated:', data)
  }}
  onExport={(data) => {
    // Called when export is triggered
    console.log('Exporting:', data)
  }}
/>
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🐛 Troubleshooting

### Module not found: '@deckedout/visual-editor'

**Solution**: Build the parent package first:
```bash
cd ..
npm run build
cd example-vite
npm install
```

### Types not available

**Solution**: Ensure TypeScript compilation is enabled in the parent package and the build completed successfully.

### Vite dev server issues

**Solution**: Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📚 Additional Resources

- [Main Package Documentation](../README.md)
- [API Reference](../API_REFERENCE.md)
- [TypeScript Examples](../examples/)
- [Package on npm](https://www.npmjs.com/package/@deckedout/visual-editor)

## 🤝 Contributing

This example is part of the `@deckedout/visual-editor` package. For contributions, please refer to the main package repository.

## 📄 License

Same as the parent package - see [LICENSE](../LICENSE).
