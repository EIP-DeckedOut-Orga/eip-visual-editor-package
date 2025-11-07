# Quick Reference - Visual Editor Package

## 🚀 Installation Commands

### Local Install (Development)
```bash
# From your main project
cd /Users/yanisberkane/Documents/eip-decked-out-electron/editor
npm install /Users/yanisberkane/Documents/visual-editor-package
```

### npm Link (Development)
```bash
# In package directory
cd /Users/yanisberkane/Documents/visual-editor-package
npm link

# In your project
cd /Users/yanisberkane/Documents/eip-decked-out-electron/editor
npm link @deckedout/visual-editor
```

### From npm (After Publishing)
```bash
npm install @deckedout/visual-editor
```

## 📦 Build Commands

```bash
cd /Users/yanisberkane/Documents/visual-editor-package

npm run build        # Build for production
npm run dev          # Watch mode for development
npm run type-check   # Check TypeScript types
```

## 🌐 Publishing Commands

```bash
cd /Users/yanisberkane/Documents/visual-editor-package

npm login                          # Login to npm (first time)
npm publish --access public        # Publish package

# Version bumps
npm version patch   # 1.0.0 -> 1.0.1 (bug fixes)
npm version minor   # 1.0.0 -> 1.1.0 (new features)
npm version major   # 1.0.0 -> 2.0.0 (breaking changes)
```

## 📝 Import Examples

```tsx
// Main components
import { 
  VisualEditor,
  VisualEditorWorkspace,
  Inspector,
  LayersPanel,
  AssetPicker 
} from '@deckedout/visual-editor';

// Built-in elements
import { 
  textElementRenderer,
  imageElementRenderer,
  TextElementRenderer,
  ImageElementRenderer
} from '@deckedout/visual-editor';

// Hooks & utilities
import { 
  useEditorState,
  useElementRegistry,
  globalElementRegistry 
} from '@deckedout/visual-editor';

// Types
import type { 
  EditorElement,
  ElementRenderer,
  EditorAPI,
  EditorMode,
  EditorState,
  InspectorFieldSchema 
} from '@deckedout/visual-editor';
```

## 🎯 Common Tasks

### Update the Package
1. Edit files in `visual-editor-package/src/`
2. Run `npm run build`
3. Test in your project
4. Commit changes

### Publish Update
1. Make changes and build
2. `npm version patch` (or minor/major)
3. `npm publish --access public`

### Use in Another Project
1. `npm install @deckedout/visual-editor`
2. Import components
3. Use in your React app

## 📂 Package Location
```
/Users/yanisberkane/Documents/visual-editor-package
```

## 📚 Documentation Files
- `README.md` - User documentation
- `SETUP_COMPLETE.md` - Setup summary
- `PUBLISHING.md` - Publishing guide
- `QUICK_REFERENCE.md` - This file

## ⚡ One-Liner to Start

```bash
cd /Users/yanisberkane/Documents/visual-editor-package && npm run build && npm link
```

Then in your project:
```bash
npm link @deckedout/visual-editor
```

Now use:
```tsx
import { VisualEditorWorkspace } from '@deckedout/visual-editor';
```
