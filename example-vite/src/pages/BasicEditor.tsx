import { VisualEditorWorkspace } from '@deckedout/visual-editor'

/**
 * Basic Editor Example
 * 
 * Demonstrates the simplest way to integrate the visual editor.
 * Uses default settings with all panels visible.
 */
export default function BasicEditor() {
  return (
    <div className="flex flex-col w-full h-full">
      <VisualEditorWorkspace
        className="w-full h-full"
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
