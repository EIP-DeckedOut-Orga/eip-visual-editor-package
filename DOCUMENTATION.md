# Documentation Guide

This project uses [TypeDoc](https://typedoc.org/) to automatically generate API documentation from TypeScript source code.

## Viewing Documentation

### Online
The documentation is automatically built and deployed to GitHub Pages on every push to the main branch:
- **URL**: [https://eip-deckedout-orga.github.io/eip-visual-editor-package/](https://eip-deckedout-orga.github.io/eip-visual-editor-package/)

### Locally
To generate and view the documentation locally:

```bash
# Generate documentation
npm run docs

# Open docs/index.html in your browser
open docs/index.html
```

## Documentation Structure

The generated documentation includes:

- **Modules**: Overview of all exported modules
- **Classes**: All exported classes with their methods and properties
- **Interfaces**: TypeScript interfaces including component props
- **Types**: Type aliases and custom types
- **Functions**: Exported utility functions

## Writing Documentation

TypeDoc generates documentation from JSDoc comments and TypeScript types. Follow these guidelines:

### Components

```typescript
/**
 * Visual Editor component for creating interactive canvases.
 * 
 * @component
 * @example
 * ```tsx
 * <VisualEditor
 *   width={800}
 *   height={600}
 *   mode="edit"
 * />
 * ```
 */
export const VisualEditor: React.FC<VisualEditorProps> = (props) => {
  // ...
}
```

### Functions

```typescript
/**
 * Calculates snapping points for element alignment.
 * 
 * @param element - The element to snap
 * @param elements - All elements on the canvas
 * @param threshold - Snap distance threshold in pixels (default: 5)
 * @returns Snap suggestions for x and y coordinates
 * 
 * @example
 * ```typescript
 * const snapPoints = calculateSnapPoints(element, allElements, 10);
 * ```
 */
export function calculateSnapPoints(
  element: EditorElement,
  elements: EditorElement[],
  threshold: number = 5
): SnapSuggestion {
  // ...
}
```

### Interfaces

```typescript
/**
 * Properties for the VisualEditor component.
 * 
 * @interface
 */
export interface VisualEditorProps {
  /**
   * Canvas width in pixels.
   * @default 800
   */
  width?: number;
  
  /**
   * Canvas height in pixels.
   * @default 600
   */
  height?: number;
  
  /**
   * Editor mode: 'edit' allows modifications, 'preview' is read-only.
   * @default 'edit'
   */
  mode?: 'edit' | 'preview';
}
```

### Types

```typescript
/**
 * Represents an element on the canvas.
 * 
 * @typedef EditorElement
 */
export type EditorElement = {
  /** Unique identifier */
  id: string;
  
  /** Element type (text, image, custom, etc.) */
  type: string;
  
  /** X coordinate in pixels */
  x: number;
  
  /** Y coordinate in pixels */
  y: number;
  
  /** Width in pixels */
  width: number;
  
  /** Height in pixels */
  height: number;
}
```

## Supported JSDoc Tags

- `@param` - Function/method parameters
- `@returns` / `@return` - Return value description
- `@example` - Usage examples
- `@default` - Default value
- `@deprecated` - Mark as deprecated
- `@see` - References to related items
- `@throws` - Exceptions that may be thrown
- `@remarks` - Additional notes
- `@category` - Organize by category

## Configuration

Documentation settings are defined in `typedoc.json`:

```json
{
  "entryPoints": ["./src/index.ts"],
  "out": "docs",
  "excludePrivate": true,
  "includeVersion": true,
  "name": "@deckedout/visual-editor"
}
```

## CI/CD

Documentation is automatically:
1. Generated on every push to `main`
2. Deployed to GitHub Pages via GitHub Actions
3. Available at the project's GitHub Pages URL

See `.github/workflows/deploy-docs.yml` for the deployment workflow.

## Troubleshooting

### Documentation not updating
- Check GitHub Actions workflow status
- Ensure GitHub Pages is enabled in repository settings
- Verify the deployment source is set to "GitHub Actions"

### Missing types
- Ensure types are exported from `src/index.ts`
- Check that files are not in `excludeExternals` list

### Broken links
- Use relative paths for internal links
- Ensure referenced types/functions are exported

## Resources

- [TypeDoc Documentation](https://typedoc.org/)
- [TypeDoc JSDoc Support](https://typedoc.org/guides/doccomments/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
