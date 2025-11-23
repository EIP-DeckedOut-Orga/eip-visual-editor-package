# StackBlitz Demo Guide

This document explains how to use and maintain the StackBlitz demo for the visual editor package.

## Overview

We use the **example-vite** project directly for StackBlitz demos. It includes 3 pages showcasing different features of `@deckedout/visual-editor`:

1. **Basic Editor** (`/`) - Simple integration with core features
2. **Custom Mode** (`/custom-mode`) - Card Designer with custom toolbar/topbar
3. **Asset Picker** (`/with-assets`) - Asset management integration

## Why One Demo Project?

Instead of maintaining multiple standalone demos, we use the existing `example-vite` app:

✅ **No code duplication** - Single source of truth
✅ **Easier maintenance** - Update once, works everywhere
✅ **Better UX** - Users can navigate between examples
✅ **Works locally AND online** - Same codebase for both

## Demo Structure

The demo is a complete Vite + React application with routing:

```
example-vite/
├── src/
│   ├── pages/
│   │   ├── BasicEditor.tsx      # / route
│   │   ├── CustomMode.tsx       # /custom-mode route
│   │   └── WithAssets.tsx       # /with-assets route
│   ├── App.tsx                  # Router setup
│   ├── App.css                  # Navigation styles
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles + dark mode
├── index.html                   # HTML template
├── package.json                 # Dependencies
├── vite.config.ts               # Vite configuration
├── tailwind.config.js           # Tailwind CSS
├── postcss.config.js            # PostCSS
└── README.md                    # Setup guide
```

## Adding New Example Pages

To add a new example to the demo:

### 1. Create New Page Component

Create a new file in `example-vite/src/pages/`:

```tsx
// src/pages/MyNewExample.tsx
import { VisualEditorWorkspace } from '@deckedout/visual-editor'

export default function MyNewExample() {
  return (
    <div className="flex flex-col w-full h-full">
      <VisualEditorWorkspace
        // Your example configuration
        showToolbar={true}
        showTopbar={true}
        showInspector={true}
        showLayers={true}
      />
    </div>
  )
}
```

### 2. Add Route

Update `example-vite/src/App.tsx`:

```tsx
import MyNewExample from './pages/MyNewExample'

// In the Routes component:
<Route path="/my-new-example" element={<MyNewExample />} />
```

### 3. Add Navigation Link

Update the navigation in `App.tsx`:

```tsx
<nav>
  <Link to="/">Basic</Link>
  <Link to="/custom-mode">Custom Mode</Link>
  <Link to="/with-assets">Assets</Link>
  <Link to="/my-new-example">My Example</Link>
</nav>
```

### 4. Document the Example

Add description to `example-vite/README.md` and the main `README.md`.

## Publishing to StackBlitz

### GitHub Integration (Automatic)

The demo uses GitHub integration - no manual upload needed!

**StackBlitz URL:**
```
https://stackblitz.com/github/EIP-DeckedOut-Orga/eip-visual-editor-package/tree/main/example-vite?file=src/App.tsx
```

**How it works:**
1. Push changes to GitHub
2. StackBlitz automatically fetches the latest code
3. Users can navigate between all example pages

**To open a specific page:**
```
?file=src/pages/BasicEditor.tsx     # Opens Basic Editor
?file=src/pages/CustomMode.tsx      # Opens Custom Mode
?file=src/pages/WithAssets.tsx      # Opens Asset Picker
```

## Updating the Demo

### Update Package Version

When releasing a new version of `@deckedout/visual-editor`:

1. Update `example-vite/package.json`:
   ```json
   {
     "dependencies": {
       "@deckedout/visual-editor": "^1.0.8"  // Update version
     }
   }
   ```

2. Test locally, then commit and push

### Update Example Code

To update or fix examples:

1. Edit files in `example-vite/src/pages/`
2. Test locally (see "Testing Locally" below)
3. Commit and push changes
4. StackBlitz will automatically use the latest code

## Testing Locally

Test the demo before committing:

```bash
cd example-vite
npm install
npm run dev
```

Open `http://localhost:3000` and test all three example pages:
- `http://localhost:3000/` - Basic Editor
- `http://localhost:3000/custom-mode` - Custom Mode
- `http://localhost:3000/with-assets` - Asset Picker

## Best Practices

### Keep Examples Focused
- Each page demonstrates specific features
- Use clear, commented code
- Show realistic use cases

### Educational Value
- Add helpful comments explaining why
- Document in page-specific READMEs if needed
- Include code examples in main README

### Performance
- Keep bundle size reasonable
- Use placeholder images (via.placeholder.com)
- Lazy load heavy features if needed

### Maintainability
- DRY - Don't duplicate code between pages
- Extract common components if needed
- Keep routing simple and clear

### Accessibility
- Use semantic HTML
- Include proper ARIA labels
- Ensure keyboard navigation works
- Test with screen readers

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

- [ ] Update package version in `example-vite/package.json`
- [ ] Test all pages locally
- [ ] Test on StackBlitz (click the link)
- [ ] Update README if API changes affect examples
- [ ] Verify StackBlitz link works
- [ ] Check for any deprecation warnings
- [ ] Update screenshots if UI changed

## Demo Link in README

The main README.md includes a single StackBlitz link:

```markdown
## 🚀 Try It Online

**[Open in StackBlitz](https://stackblitz.com/github/EIP-DeckedOut-Orga/eip-visual-editor-package/tree/main/example-vite?file=src/App.tsx)** - Interactive demo with 3 examples

Once opened in StackBlitz, navigate between:
- `/` - Basic Editor
- `/custom-mode` - Card Designer  
- `/with-assets` - Asset Picker
```

## Resources

- [StackBlitz Documentation](https://developer.stackblitz.com/)
- [StackBlitz GitHub Integration](https://developer.stackblitz.com/guides/integration/open-from-github)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)

## Questions?

For questions about StackBlitz demos, open an issue on the GitHub repository.
