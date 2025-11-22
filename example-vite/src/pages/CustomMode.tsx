import { useState, useCallback, useMemo, useRef } from 'react'
import { VisualEditorWorkspace, EditorMode, EditorAPI, CanvasExport } from '@deckedout/visual-editor'

/**
 * Custom Mode Example
 * 
 * Demonstrates how to create a custom editor mode with:
 * - Custom canvas size
 * - Custom toolbar actions
 * - Custom topbar controls
 * - Mode-specific behavior
 * - Auto-save pattern
 */
export default function CustomMode() {
  const [canvasData, setCanvasData] = useState<CanvasExport | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null)
  // Define a custom mode for card design
  const cardDesignerMode: EditorMode = {
    name: 'Card Designer',
    displayName: 'Card Designer',
    
    defaultCanvasSize: {
      width: 750,
      height: 1050  // Standard poker card ratio
    },
    
    backgroundColor: '#f0f4f8',
    showGrid: true,
    gridSize: 50,
    snapToGrid: false,
    
    // Configure toolbar
    toolbarConfig: {
      showElementTools: true,
      
      // Add custom template button
      toolsStart: [
        {
          type: 'button',
          id: 'load-template',
          label: 'Load Template',
          onClick: (api: EditorAPI) => {
            // Create a template with background and title
            const background = {
              id: 'template-bg',
              type: 'image',
              position: { x: 0, y: 0 },
              size: { width: 750, height: 1050 },
              rotation: 0,
              opacity: 1,
              zIndex: 0,
              visible: true,
              locked: false,
              props: {
                src: 'https://via.placeholder.com/750x1050/667eea/ffffff?text=Card+Background',
                fit: 'cover'
              }
            }
            
            const title = {
              id: 'template-title',
              type: 'text',
              position: { x: 75, y: 50 },
              size: { width: 600, height: 100 },
              rotation: 0,
              opacity: 1,
              zIndex: 1,
              visible: true,
              locked: false,
              props: {
                content: 'Card Title',
                fontSize: 48,
                color: '#1e293b',
                fontFamily: 'Arial',
                align: 'center',
                bold: true
              }
            }
            
            api.loadElements([background, title])
          }
        },
        {
          type: 'separator',
          id: 'sep-1'
        }
      ]
    },
    
    // Configure topbar
    topbarConfig: {
      showUndo: true,
      showRedo: true,
      showDelete: true,
      showCopy: false,
      showPaste: false,
      showDuplicate: false,
      showExport: false,
      showImport: false,
      showCanvasSize: true,
      showSnapGuides: true,
      
      // Custom container classes for flexible positioning
      actionsStartClassName: 'w-full',
      actionsEndClassName: '',
      
      // Add custom export button
      actionsEnd: [
        {
          type: 'separator',
          id: 'sep-export'
        },
        {
          type: 'button',
          id: 'export-png',
          label: 'Export PNG',
          onClick: () => {
            if (canvasData) {
              // In a real app, you would convert to PNG and download
              // eslint-disable-next-line no-console
              console.log('Exporting card:', canvasData)
              alert('Card exported! Check console for data.')
            }
          }
        },
        {
          type: 'button',
          id: 'save-indicator',
          label: isSaving ? 'Saving...' : 'Saved',
          disabled: true,
          onClick: () => {}
        }
      ]
    },
    
    // Mode lifecycle hooks
    onModeActivate: (api: EditorAPI) => {
      // eslint-disable-next-line no-console
      console.log('Card Designer mode activated', api)
    }
  }

  // Memoize mode to include dynamic state
  const cardDesignerModeWithState = useMemo(() => ({
    ...cardDesignerMode,
    topbarConfig: {
      ...cardDesignerMode.topbarConfig,
      actionsEnd: [
        {
          type: 'separator' as const,
          id: 'sep-export'
        },
        {
          type: 'button' as const,
          id: 'export-png',
          label: 'Export PNG',
          onClick: () => {
            if (canvasData) {
              // eslint-disable-next-line no-console
              console.log('Exporting card:', canvasData)
              alert('Card exported! Check console for data.')
            }
          }
        },
        {
          type: 'button' as const,
          id: 'save-indicator',
          label: isSaving ? 'Saving...' : 'Saved',
          disabled: true,
          onClick: () => {}
        }
      ]
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [isSaving])

  // Auto-save handler with debouncing
  const handleChange = useCallback((data: CanvasExport) => {
    setCanvasData(data)

    // Clear existing timer
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current)
    }

    // Debounce save (wait 1 second after last edit)
    saveTimerRef.current = setTimeout(async () => {
      setIsSaving(true)
      
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 500))
      // eslint-disable-next-line no-console
      console.log('Auto-saved:', data)
      
      setIsSaving(false)
    }, 1000)
  }, [])

  return (
    <div className="flex flex-col w-full h-full">
      <VisualEditorWorkspace
        className="w-full h-full"
        mode={cardDesignerModeWithState}
        initialData={canvasData || undefined}
        onChange={handleChange}
        showToolbar={true}
        showTopbar={true}
        showInspector={true}
        showLayers={true}
        showCanvas={true}
        enableSnapGuides={true}
      />
    </div>
  )
}
