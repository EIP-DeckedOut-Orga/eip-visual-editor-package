import { useState, useCallback, useMemo, useRef } from 'react'
import { VisualEditorWorkspace } from '@deckedout/visual-editor'

/**
 * Custom Mode Demo - Card Designer
 * 
 * Demonstrates advanced editor customization:
 * - Custom canvas size for card design (750×1050)
 * - Custom toolbar with "Load Template" button
 * - Custom topbar with "Export PNG" button and save indicator
 * - Auto-save functionality with debouncing
 */
export default function App() {
  const [canvasData, setCanvasData] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const saveTimerRef = useRef(null)

  // Define custom mode for card design
  const cardDesignerMode = useMemo(() => ({
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
    
    // Custom toolbar with template button
    toolbarConfig: {
      showElementTools: true,
      toolsStart: [
        {
          type: 'button',
          id: 'load-template',
          label: 'Load Template',
          onClick: (api) => {
            // Load a pre-made template
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
    
    // Custom topbar with export and save indicator
    topbarConfig: {
      showUndo: true,
      showRedo: true,
      showDelete: true,
      showCanvasSize: true,
      showSnapGuides: true,
      
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
    
    onModeActivate: (api) => {
      console.log('Card Designer mode activated', api)
    }
  }), [canvasData, isSaving])

  // Auto-save with debouncing
  const handleChange = useCallback((data) => {
    setCanvasData(data)

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current)
    }

    saveTimerRef.current = setTimeout(async () => {
      setIsSaving(true)
      
      // Simulate save
      await new Promise(resolve => setTimeout(resolve, 500))
      console.log('Auto-saved:', data)
      
      setIsSaving(false)
    }, 1000)
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
          Card Designer - Custom Mode Demo
        </h1>
        <p style={{ margin: '0.5rem 0 0', color: '#6c757d', fontSize: '0.9rem' }}>
          Try "Load Template" button, then customize your card design
        </p>
      </div>

      {/* Visual Editor */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <VisualEditorWorkspace
          mode={cardDesignerMode}
          initialData={canvasData}
          onChange={handleChange}
          showToolbar={true}
          showTopbar={true}
          showInspector={true}
          showLayers={true}
          enableSnapGuides={true}
        />
      </div>
    </div>
  )
}
