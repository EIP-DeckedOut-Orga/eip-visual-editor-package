# Publishing to npm

## � How to Publish a New Version (CI/CD)

The package uses npm Trusted Publisher (OIDC) for automated publishing. No tokens needed!

```bash
# 1. Commit your changes
git add .
git commit -m "feat: your changes"
git push

# 2. Bump the version
npm version patch   # 1.0.5 → 1.0.6 (bug fixes)
npm version minor   # 1.0.5 → 1.1.0 (new features)
npm version major   # 1.0.5 → 2.0.0 (breaking changes)

# 3. Push the tag
git push && git push --tags
```

That's it! The CI/CD pipeline automatically:
- ✅ Runs tests
- ✅ Builds the package
- ✅ Publishes to npm

**Monitor**: https://github.com/EIP-DeckedOut-Orga/eip-visual-editor-package/actions

---

## 📦 Manual Publishing (Fallback)

If CI/CD fails or for first-time setup:

```bash
npm login
npm run build
npm test
npm publish --access public
```

---

## 🔍 Local Testing

```bash
# Build and pack
npm run build
npm pack

# Install in test project
npm install /path/to/deckedout-visual-editor-1.0.6.tgz
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
