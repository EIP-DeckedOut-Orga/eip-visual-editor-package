/**
 * Example 1: Basic Visual Editor Usage
 * 
 * This example demonstrates the simplest way to integrate the visual editor
 * into your React application with minimal configuration.
 */

import React from 'react';
import { VisualEditorWorkspace } from '@deckedout/visual-editor';

export function BasicEditorExample() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <VisualEditorWorkspace
        width={800}
        height={600}
        showToolbar={true}
        showTopbar={true}
        showInspector={true}
        showLayers={true}
        enableSnapGuides={true}
      />
    </div>
  );
}

/**
 * What this example includes:
 * - Full-featured editor workspace
 * - Toolbar for adding elements (text, images)
 * - Topbar with undo/redo controls
 * - Inspector panel for property editing
 * - Layers panel for element management
 * - Snap guides for precise positioning
 * 
 * The editor comes with built-in text and image elements ready to use.
 */
