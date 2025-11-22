/**
 * Example 2: Controlled Mode with State Management
 * 
 * This example shows how to use the editor in controlled mode,
 * managing the canvas state externally and responding to changes.
 */

import React, { useState, useCallback } from 'react';
import { 
  VisualEditorWorkspace, 
  CanvasExport,
  exportToJSON,
  importFromJSON
} from '@deckedout/visual-editor';

export function ControlledEditorExample() {
  const [canvasData, setCanvasData] = useState<CanvasExport>({
    width: 800,
    height: 600,
    elements: [],
    metadata: {
      created: new Date().toISOString(),
      version: '1.0.0'
    }
  });

  // Handle canvas changes
  const handleChange = useCallback((data: CanvasExport) => {
    setCanvasData(data);
    console.log('Canvas updated:', data);
  }, []);

  // Save to localStorage
  const handleSave = useCallback(() => {
    const json = exportToJSON(canvasData);
    localStorage.setItem('my-canvas', json);
    alert('Canvas saved!');
  }, [canvasData]);

  // Load from localStorage
  const handleLoad = useCallback(() => {
    const json = localStorage.getItem('my-canvas');
    if (json) {
      try {
        const data = importFromJSON(json);
        setCanvasData(data);
        alert('Canvas loaded!');
      } catch (error) {
        alert('Failed to load canvas');
      }
    }
  }, []);

  // Export as JSON file
  const handleExport = useCallback(() => {
    const json = exportToJSON(canvasData);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'canvas-export.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [canvasData]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Custom controls */}
      <div style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
        <button onClick={handleSave}>Save to Storage</button>
        <button onClick={handleLoad}>Load from Storage</button>
        <button onClick={handleExport}>Export JSON</button>
        <span style={{ marginLeft: '20px' }}>
          Elements: {canvasData.elements.length}
        </span>
      </div>

      {/* Editor */}
      <div style={{ flex: 1 }}>
        <VisualEditorWorkspace
          initialData={canvasData}
          onChange={handleChange}
          width={canvasData.width}
          height={canvasData.height}
        />
      </div>
    </div>
  );
}

/**
 * Key concepts:
 * - Use initialData prop to set initial canvas state
 * - Use onChange callback to track canvas updates
 * - Export/import canvas data using utility functions
 * - Integrate with external storage (localStorage, API, etc.)
 * - Monitor canvas state (element count, dimensions, etc.)
 */
