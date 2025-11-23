import { useState, useCallback, useMemo } from 'react'
import { VisualEditorWorkspace } from '@deckedout/visual-editor'

/**
 * Asset Picker Demo - Game Asset Editor
 * 
 * Demonstrates asset management integration:
 * - Asset picker panel with game assets
 * - Background image selector dropdown
 * - Dark canvas theme for game design
 * - Grid overlay for precise positioning
 */
export default function App() {
  const [canvasData, setCanvasData] = useState(null)
  const [selectedBackground, setSelectedBackground] = useState(undefined)

  // Mock game assets
  const mockAssets = useMemo(() => [
    {
      name: 'Character',
      path: 'https://via.placeholder.com/150/ff6b6b/ffffff?text=Character',
      type: 'sprite'
    },
    {
      name: 'Background',
      path: 'https://via.placeholder.com/150/4ecdc4/ffffff?text=Background',
      type: 'background'
    },
    {
      name: 'Item',
      path: 'https://via.placeholder.com/150/ffe66d/000000?text=Item',
      type: 'item'
    },
    {
      name: 'Enemy',
      path: 'https://via.placeholder.com/150/ff6b9d/ffffff?text=Enemy',
      type: 'sprite'
    },
    {
      name: 'Platform',
      path: 'https://via.placeholder.com/150/95e1d3/000000?text=Platform',
      type: 'tile'
    },
    {
      name: 'Coin',
      path: 'https://via.placeholder.com/150/f9ca24/000000?text=Coin',
      type: 'item'
    }
  ], [])

  // Game asset editor mode
  const mode = useMemo(() => ({
    name: 'Game Asset Editor',
    displayName: 'Game Asset Editor',
    
    defaultCanvasSize: {
      width: 1200,
      height: 800
    },
    
    backgroundColor: '#1e1e2e',
    showGrid: true,
    gridSize: 40,
    snapToGrid: false,

    // Asset picker configuration
    assetPickerProps: {
      assets: mockAssets,
      onAssetSelect: (assetPath) => {
        // eslint-disable-next-line no-console
        console.log('Asset selected:', assetPath)
      }
    },
    assetPickerPosition: 'bottom',

    // Background selector in topbar
    topbarConfig: {
      showUndo: true,
      showRedo: true,
      showDelete: true,
      showCanvasSize: true,
      showSnapGuides: true,
      
      actionsStart: [
        {
          type: 'dropdown',
          id: 'background-selector',
          label: 'Background',
          placeholder: 'Select background',
          options: [
            { value: 'none', label: 'None' },
            ...mockAssets.filter(a => a.type === 'background').map(a => ({
              value: a.path,
              label: a.name
            }))
          ],
          value: selectedBackground || 'none',
          onChange: (value) => {
            setSelectedBackground(value === 'none' ? undefined : value)
          }
        }
      ]
    }
  }), [mockAssets, selectedBackground])

  const handleChange = useCallback((data) => {
    setCanvasData(data)
  }, [])

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ 
        padding: '1rem', 
        backgroundColor: '#f8f9fa', 
        borderBottom: '1px solid #dee2e6',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#212529' }}>
          Game Asset Editor - Asset Picker Demo
        </h1>
        <p style={{ margin: '0.5rem 0 0', color: '#6c757d', fontSize: '0.9rem' }}>
          Drag assets from the bottom panel onto the canvas
        </p>
      </div>

      {/* Visual Editor */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <VisualEditorWorkspace
          mode={mode}
          initialData={canvasData}
          onChange={handleChange}
          showToolbar={true}
          showTopbar={true}
          showInspector={true}
          showLayers={true}
          showAssetPicker={true}
          backgroundImageUrl={selectedBackground}
          enableSnapGuides={true}
        />
      </div>
    </div>
  )
}
