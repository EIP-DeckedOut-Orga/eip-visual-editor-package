import { VisualEditorWorkspace } from '@deckedout/visual-editor'

/**
 * Basic Visual Editor Demo
 * 
 * A simple integration showing the visual editor with all default features:
 * - Drag and drop elements
 * - Resize and rotate
 * - Inspector panel for properties
 * - Layers panel for organization
 * - Snap guides for alignment
 */
export default function App() {
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
          @deckedout/visual-editor - Basic Demo
        </h1>
        <p style={{ margin: '0.5rem 0 0', color: '#6c757d', fontSize: '0.9rem' }}>
          Try dragging, resizing, and editing elements on the canvas
        </p>
      </div>

      {/* Visual Editor */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <VisualEditorWorkspace
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
