import { useState, useCallback, useMemo, useRef } from 'react'
import { VisualEditorWorkspace, EditorMode, CanvasExport } from '@deckedout/visual-editor'

/**
 * Asset Picker Example
 * 
 * Demonstrates asset management with file upload.
 * Shows how to upload custom backgrounds and add assets dynamically.
 */
export default function WithAssets() {
  const [canvasData, setCanvasData] = useState<CanvasExport | null>(null)
  const [selectedBackground, setSelectedBackground] = useState<string | undefined>(undefined)
  const [uploadedBackgrounds, setUploadedBackgrounds] = useState<Array<{ name: string; path: string }>>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  // Combine mock assets with uploaded backgrounds
  const allBackgrounds = useMemo(() => [
    ...mockAssets.filter(a => a.type === 'background'),
    ...uploadedBackgrounds
  ], [mockAssets, uploadedBackgrounds])

  // Handle background upload
  const handleBackgroundUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    // Create object URL for the uploaded file
    const imageUrl = URL.createObjectURL(file)
    
    // Add to uploaded backgrounds
    const newBackground = {
      name: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
      path: imageUrl
    }
    
    setUploadedBackgrounds(prev => [...prev, newBackground])
    
    // Automatically select the newly uploaded background
    setSelectedBackground(imageUrl)

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  // Trigger file input click
  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  // Handle background selection change
  const handleBackgroundChange = useCallback((value: string) => {
    setSelectedBackground(value === 'none' ? undefined : value)
  }, [])

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
          type: 'button' as const,
          id: 'upload-background',
          label: 'Upload Background',
          onClick: handleUploadClick
        },
        {
          type: 'separator' as const,
          id: 'sep-1'
        },
        {
          type: 'dropdown' as const,
          id: 'background-selector',
          label: 'Background',
          placeholder: 'Select background',
          options: [
            { value: 'none', label: 'None' },
            ...allBackgrounds.map(bg => ({
              value: bg.path,
              label: bg.name
            }))
          ],
          value: selectedBackground || 'none',
          onChange: handleBackgroundChange
        }
      ]
    }
  }), [selectedBackground, allBackgrounds, handleUploadClick, handleBackgroundChange, mockAssets])



  // Handle canvas changes
  const handleChange = useCallback((data: CanvasExport) => {
    setCanvasData(data)
    // eslint-disable-next-line no-console
    console.log('Canvas updated:', data)
  }, [])

  return (
    <div className="flex flex-col w-full h-full">
      {/* Hidden file input for background upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleBackgroundUpload}
        style={{ display: 'none' }}
      />
      
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
