# Asset Picker Demo - Game Asset Editor

Asset management demonstration for `@deckedout/visual-editor` with game assets and background selection.

## Features Demonstrated

- 🎮 Asset picker panel with game assets
- 🖼️ Background image selector dropdown
- 🌙 Dark canvas theme for game design
- 📐 Grid overlay for precise positioning
- 🎯 Asset categories (sprites, backgrounds, items, tiles)
- 📦 Drag-and-drop from asset library

## What's Special About This Demo

This shows how to integrate a full asset management system into your editor:

1. **Asset Library**: Provide a collection of images users can drag onto the canvas
2. **Asset Categories**: Organize assets by type (sprite, background, item, tile)
3. **Background Selector**: Dropdown to set canvas background from asset library
4. **Game-Focused UI**: Dark theme and grid for game level design

## Try It Out

1. **Browse Assets**: Scroll through the asset picker at the bottom
2. **Drag Assets**: Drag any asset onto the canvas to create an element
3. **Set Background**: Use the "Background" dropdown to set a canvas background
4. **Position**: Use the grid to align elements precisely
5. **Customize**: Select elements and edit in the inspector panel

## Perfect For

- 🎮 Game level editors
- 🖼️ Design tools with asset libraries
- 📱 UI/UX design with component libraries
- 🎨 Any application that needs reusable visual assets

## Code Highlights

### Providing Assets

```jsx
const mockAssets = [
  {
    name: 'Character',
    path: 'https://example.com/character.png',
    type: 'sprite'
  },
  {
    name: 'Background',
    path: 'https://example.com/bg.png',
    type: 'background'
  }
]
```

### Configuring Asset Picker

```jsx
const mode = {
  assetPickerProps: {
    assets: mockAssets,
    onAssetSelect: (assetPath) => {
      console.log('Asset selected:', assetPath)
    }
  },
  assetPickerPosition: 'bottom'
}
```

### Background Selector

```jsx
topbarConfig: {
  actionsStart: [
    {
      type: 'dropdown',
      id: 'background-selector',
      label: 'Background',
      options: mockAssets
        .filter(a => a.type === 'background')
        .map(a => ({ value: a.path, label: a.name })),
      onChange: (value) => setBackground(value)
    }
  ]
}
```

## Real-World Usage

In a production app, you would:

- Load assets from your backend/CMS
- Support asset upload and management
- Add search/filter functionality
- Implement asset pagination
- Cache asset thumbnails
- Support multiple asset sources

## Learn More

- [Full Documentation](https://github.com/EIP-DeckedOut-Orga/eip-visual-editor-package)
- [Asset Picker API](https://github.com/EIP-DeckedOut-Orga/eip-visual-editor-package/blob/main/API_REFERENCE.md)
- [More Examples](https://github.com/EIP-DeckedOut-Orga/eip-visual-editor-package/tree/main/example-vite)
