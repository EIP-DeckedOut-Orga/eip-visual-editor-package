# StackBlitz Demos Guide

This document explains how to create, update, and maintain StackBlitz demos for the visual editor package.

## Overview

We maintain 3 standalone StackBlitz demos that showcase different features of `@deckedout/visual-editor`:

1. **Basic Editor** - Simple integration with core features
2. **Custom Mode (Card Designer)** - Advanced customization with custom toolbar/topbar
3. **Asset Picker** - Asset management integration

## Demo Structure

Each demo is a complete, standalone Vite + React application located in `/stackblitz-demos/`:

```
stackblitz-demos/
├── basic-editor/
│   ├── src/
│   │   ├── App.jsx          # Main demo component
│   │   ├── main.jsx         # React entry point
│   │   └── index.css        # Global styles
│   ├── index.html           # HTML template
│   ├── package.json         # Dependencies
│   ├── vite.config.js       # Vite configuration
│   └── README.md            # Demo documentation
├── custom-mode/
│   └── ... (same structure)
└── asset-picker/
    └── ... (same structure)
```

## Creating New Demos

### 1. Set Up Demo Directory

```bash
cd stackblitz-demos
mkdir my-new-demo
cd my-new-demo
```

### 2. Create Essential Files

**package.json:**
```json
{
  "name": "visual-editor-my-demo",
  "version": "1.0.0",
  "description": "Description of your demo",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@deckedout/visual-editor": "^1.0.7",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "vite": "^5.4.21"
  }
}
```

**vite.config.js:**
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@deckedout/visual-editor']
  }
})
```

**index.html:**
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Visual Editor - My Demo</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

**src/main.jsx:**
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

**src/index.css:**
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#root {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
```

**src/App.jsx:**
```jsx
import { VisualEditorWorkspace } from '@deckedout/visual-editor'

export default function App() {
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

### 3. Add Demo README

Create a comprehensive README.md explaining:
- What features are demonstrated
- How to use the demo
- Code highlights
- Links to full documentation

See existing demo READMEs for examples.

## Publishing to StackBlitz

### Option 1: GitHub Integration (Recommended)

1. **Commit your demo** to the repository:
   ```bash
   git add stackblitz-demos/my-new-demo
   git commit -m "Add new demo: my-new-demo"
   git push
   ```

2. **Create StackBlitz link** using GitHub:
   ```
   https://stackblitz.com/github/EIP-DeckedOut-Orga/eip-visual-editor-package/tree/main/stackblitz-demos/my-new-demo?file=src/App.jsx
   ```

3. **Test the link** - Click it to verify it opens correctly in StackBlitz

### Option 2: Manual Upload

1. Go to [stackblitz.com](https://stackblitz.com)
2. Click "New Project" → "Import from GitHub"
3. Paste your GitHub repository URL
4. Navigate to your demo folder

## Updating Demos

### Update Package Version

When releasing a new version of `@deckedout/visual-editor`:

1. Update `package.json` in all demo folders:
   ```json
   {
     "dependencies": {
       "@deckedout/visual-editor": "^1.0.8"  // Update version
     }
   }
   ```

2. Commit and push changes

### Update Demo Code

To update demo functionality:

1. Edit the `src/App.jsx` file
2. Test locally if possible (see "Testing Locally" below)
3. Commit and push
4. StackBlitz will automatically use the latest code

## Testing Locally

Test demos before committing:

```bash
cd stackblitz-demos/basic-editor
npm install
npm run dev
```

Open `http://localhost:3000` to verify the demo works.

## Best Practices

### Keep Demos Simple
- Focus on one feature per demo
- Avoid unnecessary complexity
- Use clear, commented code

### Self-Contained
- Each demo should work independently
- Don't rely on external files outside the demo folder
- Include all necessary styles inline

### Educational
- Add helpful comments in the code
- Write clear README documentation
- Explain why, not just what

### Performance
- Keep bundle size small
- Use placeholder images (via.placeholder.com)
- Avoid heavy dependencies

### Accessibility
- Use semantic HTML
- Include proper ARIA labels
- Ensure keyboard navigation works

## Troubleshooting

### Demo won't load in StackBlitz

**Problem:** StackBlitz shows "Failed to load project"

**Solutions:**
- Verify all file paths are correct
- Check package.json syntax
- Ensure repository is public
- Try clearing StackBlitz cache (refresh with Ctrl+Shift+R)

### Dependencies not installing

**Problem:** `@deckedout/visual-editor` not found

**Solutions:**
- Verify package version exists on npm
- Check package.json syntax
- Wait a few minutes after publishing new version

### Demo works locally but not on StackBlitz

**Problem:** Demo runs fine locally but fails on StackBlitz

**Solutions:**
- Check for absolute file paths (use relative paths)
- Verify all imports are correct
- Check for environment-specific code
- Look at StackBlitz console for errors

## Maintenance Checklist

When releasing a new package version:

- [ ] Update package version in all demo `package.json` files
- [ ] Test each demo on StackBlitz
- [ ] Update README if API changes affect demos
- [ ] Verify all demo links work
- [ ] Check for any deprecation warnings

## Adding Demo Links to README

Update the main README.md with StackBlitz links:

```markdown
## 🚀 Try It Online

- **[Basic Editor](https://stackblitz.com/github/EIP-DeckedOut-Orga/eip-visual-editor-package/tree/main/stackblitz-demos/basic-editor?file=src/App.jsx)**
- **[Custom Mode](https://stackblitz.com/github/EIP-DeckedOut-Orga/eip-visual-editor-package/tree/main/stackblitz-demos/custom-mode?file=src/App.jsx)**
- **[Asset Picker](https://stackblitz.com/github/EIP-DeckedOut-Orga/eip-visual-editor-package/tree/main/stackblitz-demos/asset-picker?file=src/App.jsx)**
```

## Resources

- [StackBlitz Documentation](https://developer.stackblitz.com/)
- [StackBlitz GitHub Integration](https://developer.stackblitz.com/guides/integration/open-from-github)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)

## Questions?

For questions about StackBlitz demos, open an issue on the GitHub repository.
