# Publishing to npm

Follow these steps to publish your Visual Editor package to npm:

## 1. Test the Package Locally

Before publishing, test the package in your project:

```bash
# In the package directory
cd /Users/yanisberkane/Documents/visual-editor-package
npm run build

# Create a tarball for local testing
npm pack
```

This creates a `.tgz` file that you can install in other projects:

```bash
# In your other project
npm install /path/to/deckedout-visual-editor-1.0.0.tgz
```

## 2. Set up npm Account

If you don't have an npm account:
- Go to https://www.npmjs.com/signup
- Create an account
- Verify your email

## 3. Login to npm

```bash
npm login
```

Enter your npm username, password, and email.

## 4. Update Package Name (If Needed)

If `@deckedout/visual-editor` is taken, update the name in `package.json`:

```json
{
  "name": "@your-username/visual-editor"
}
```

Or use a non-scoped name:
```json
{
  "name": "visual-editor-deckedout"
}
```

## 5. Publish the Package

```bash
# For scoped packages (@deckedout/visual-editor)
npm publish --access public

# For non-scoped packages
npm publish
```

## 6. Update Version for Future Releases

When making updates:

```bash
# Patch release (1.0.0 -> 1.0.1) - for bug fixes
npm version patch

# Minor release (1.0.0 -> 1.1.0) - for new features
npm version minor

# Major release (1.0.0 -> 2.0.0) - for breaking changes
npm version major

# Then publish again
npm publish
```

## Using in Other Projects

Once published, install in any project:

```bash
npm install @deckedout/visual-editor
# or
yarn add @deckedout/visual-editor
# or
pnpm add @deckedout/visual-editor
```

## Using Locally (Without Publishing)

### Option 1: npm link

```bash
# In the package directory
cd /Users/yanisberkane/Documents/visual-editor-package
npm link

# In your project directory
cd /path/to/your/project
npm link @deckedout/visual-editor
```

### Option 2: Local file path

In your project's `package.json`:

```json
{
  "dependencies": {
    "@deckedout/visual-editor": "file:../visual-editor-package"
  }
}
```

### Option 3: Use in your current project

Update your current project's `package.json`:

```json
{
  "dependencies": {
    "@deckedout/visual-editor": "file:/Users/yanisberkane/Documents/visual-editor-package"
  }
}
```

Then run `npm install` in your project.

## Example Usage in Your Current Project

1. Build the package:
```bash
cd /Users/yanisberkane/Documents/visual-editor-package
npm run build
```

2. In your main project (`/Users/yanisberkane/Documents/eip-decked-out-electron/editor`), add to `package.json`:

```json
{
  "dependencies": {
    "@deckedout/visual-editor": "file:/Users/yanisberkane/Documents/visual-editor-package"
  }
}
```

3. Install:
```bash
cd /Users/yanisberkane/Documents/eip-decked-out-electron/editor
npm install
```

4. Update your imports from:
```tsx
import { VisualEditorWorkspace } from '../components/visual-editor';
```

to:
```tsx
import { VisualEditorWorkspace } from '@deckedout/visual-editor';
```

## Best Practices

1. **Semantic Versioning**: Follow semver (major.minor.patch)
2. **Changelog**: Keep a CHANGELOG.md documenting changes
3. **Testing**: Test the package before publishing
4. **README**: Keep README.md up to date with examples
5. **TypeScript Types**: Ensure type definitions are included
6. **License**: Include appropriate LICENSE file

## Troubleshooting

### Package name already exists
Change the package name in `package.json` to something unique.

### Build errors
Run `npm run build` and fix any TypeScript errors before publishing.

### Missing types
Ensure `tsup.config.ts` has `dts: true` to generate type definitions.

### Peer dependency warnings
Users will need to install React 18+ as specified in `peerDependencies`.
