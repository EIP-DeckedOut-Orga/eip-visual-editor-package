import { useState, useCallback, useMemo } from 'react'
import { VisualEditorWorkspace, EditorMode, CanvasExport } from '@deckedout/visual-editor'

/**
 * Asset Picker Example
 * 
 * Demonstrates how to integrate the asset picker panel.
 * Shows how to provide custom assets for users to drag onto the canvas.
 */
export default function WithAssets() {
  const [canvasData, setCanvasData] = useState<CanvasExport | null>(null)
  const [selectedBackground, setSelectedBackground] = useState<string | undefined>(undefined)
  // Mock assets - in a real app, these would come from your backend/CMS
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

  // Define editor mode with topbar config and asset picker
  const mode: EditorMode = useMemo(() => ({
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

    // Configure asset picker through mode props
    assetPickerProps: {
      assets: mockAssets,
      onAssetSelect: (assetPath: string) => {
        // eslint-disable-next-line no-console
        console.log('Asset selected:', assetPath)
      }
    },
    assetPickerPosition: 'bottom' as const,

    topbarConfig: {
      showUndo: true,
      showRedo: true,
      showDelete: true,
      showCanvasSize: true,
      showSnapGuides: true,
      
      actionsStart: [
        {
          type: 'dropdown' as const,
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
          onChange: (value: string) => {
            setSelectedBackground(value === 'none' ? undefined : value)
          }
        }
      ]
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [selectedBackground])



  // Handle canvas changes
  const handleChange = useCallback((data: CanvasExport) => {
    setCanvasData(data)
    // eslint-disable-next-line no-console
    console.log('Canvas updated:', data)
  }, [])

  return (
    <div className="flex flex-col w-full h-full">
      <VisualEditorWorkspace
        className="w-full h-full"
        mode={mode}
        initialData={canvasData || undefined}
        onChange={handleChange}
        showToolbar={true}
        showTopbar={true}
        showInspector={true}
        showLayers={true}
        showCanvas={true}
        showAssetPicker={true}
        backgroundImageUrl={selectedBackground}
        enableSnapGuides={true}
      />
    </div>
  )
}
