/**
 * Example 4: Programmatic API Usage
 * 
 * This example shows how to use the editor API to programmatically
 * manipulate elements, handle events, and integrate with external logic.
 */

import React, { useCallback } from 'react';
import { 
  VisualEditorWorkspace, 
  useEditorState,
  createElement
} from '@deckedout/visual-editor';

export function ProgrammaticAPIExample() {
  // Access editor state and API
  const { state, api, undo, redo, canUndo, canRedo } = useEditorState();
  
  // Add text element programmatically
  const addTextElement = useCallback(() => {
    const element = createElement('text', {
      content: 'Programmatic Text',
      fontSize: 24,
      color: '#1e293b',
      fontFamily: 'Arial',
      align: 'center'
    }, {
      position: { 
        x: Math.random() * 600, 
        y: Math.random() * 400 
      },
      size: { width: 200, height: 50 }
    });
    
    api.addElement(element);
  }, [api]);

  // Add image element programmatically
  const addImageElement = useCallback(() => {
    const element = createElement('image', {
      src: 'https://via.placeholder.com/200x150',
      fit: 'contain'
    }, {
      position: { 
        x: Math.random() * 600, 
        y: Math.random() * 400 
      },
      size: { width: 200, height: 150 }
    });
    
    api.addElement(element);
  }, [api]);

  // Modify selected element
  const modifySelected = useCallback(() => {
    const selected = api.getSelectedElement();
    if (!selected) {
      alert('No element selected');
      return;
    }

    // Update properties
    api.updateElement(selected.id, {
      rotation: selected.rotation + 15,
      opacity: Math.max(0.2, selected.opacity - 0.1)
    });
  }, [api]);

  // Duplicate selected element
  const duplicateSelected = useCallback(() => {
    const selected = api.getSelectedElement();
    if (!selected) {
      alert('No element selected');
      return;
    }

    api.duplicateElement(selected.id, { x: 20, y: 20 });
  }, [api]);

  // Arrange elements
  const arrangeInGrid = useCallback(() => {
    const elements = api.getAllElements();
    const cols = 3;
    const spacing = 150;
    const startX = 50;
    const startY = 50;

    elements.forEach((element, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      
      api.updateElement(element.id, {
        position: {
          x: startX + col * spacing,
          y: startY + row * spacing
        },
        rotation: 0
      });
    });
  }, [api]);

  // Clear canvas
  const clearCanvas = useCallback(() => {
    if (confirm('Clear all elements?')) {
      api.clear();
    }
  }, [api]);

  // Randomize all elements
  const randomizeAll = useCallback(() => {
    const elements = api.getAllElements();
    elements.forEach((element) => {
      api.updateElement(element.id, {
        position: {
          x: Math.random() * 700,
          y: Math.random() * 500
        },
        rotation: Math.random() * 360,
        opacity: 0.5 + Math.random() * 0.5
      });
    });
  }, [api]);

  // Export data
  const exportData = useCallback(() => {
    const data = api.exportJSON();
    alert(`Exported ${data.elements.length} elements`);
  }, [api]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Control Panel */}
      <div style={{ 
        padding: '15px', 
        borderBottom: '1px solid #ccc',
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', gap: '5px' }}>
          <button onClick={addTextElement}>➕ Add Text</button>
          <button onClick={addImageElement}>➕ Add Image</button>
        </div>

        <div style={{ display: 'flex', gap: '5px' }}>
          <button onClick={modifySelected}>🔄 Modify Selected</button>
          <button onClick={duplicateSelected}>📋 Duplicate</button>
        </div>

        <div style={{ display: 'flex', gap: '5px' }}>
          <button onClick={arrangeInGrid}>📊 Arrange Grid</button>
          <button onClick={randomizeAll}>🎲 Randomize</button>
        </div>

        <div style={{ display: 'flex', gap: '5px' }}>
          <button onClick={undo} disabled={!canUndo}>↩️ Undo</button>
          <button onClick={redo} disabled={!canRedo}>↪️ Redo</button>
        </div>

        <div style={{ display: 'flex', gap: '5px' }}>
          <button onClick={clearCanvas}>🗑️ Clear</button>
          <button onClick={exportData}>💾 Export</button>
        </div>

        <div style={{ marginLeft: 'auto', padding: '5px 10px', background: '#f0f0f0', borderRadius: '4px' }}>
          Elements: {state.elements.length} | 
          Selected: {state.selectedElementId || 'None'} |
          History: {state.history.past.length}
        </div>
      </div>

      {/* Editor */}
      <div style={{ flex: 1 }}>
        <VisualEditorWorkspace
          width={state.canvasSize.width}
          height={state.canvasSize.height}
          showToolbar={false}
          showTopbar={false}
          showInspector={true}
          showLayers={true}
        />
      </div>
    </div>
  );
}

/**
 * EditorAPI Methods:
 * 
 * Element Manipulation:
 * - addElement(element): Add new element
 * - updateElement(id, updates): Modify element properties
 * - removeElement(id): Delete element
 * - duplicateElement(id, offset): Clone element
 * - copyElement(id): Copy to clipboard
 * - pasteElement(element, offset): Paste from clipboard
 * 
 * Selection:
 * - selectElement(id): Select element
 * - getSelectedElement(): Get selected element
 * 
 * Queries:
 * - getAllElements(): Get all elements array
 * 
 * Transformations:
 * - moveElement(id, deltaX, deltaY): Move by offset
 * - rotateElement(id, angle): Set rotation
 * - resizeElement(id, width, height): Set size
 * - updateZIndex(id, zIndex): Change layer order
 * - reorderElement(id, newIndex): Change array position
 * 
 * Canvas:
 * - clear(): Remove all elements
 * - clearHistory(): Reset undo/redo
 * - loadElements(elements): Load without history
 * - exportJSON(): Get canvas data
 * - importJSON(data): Load canvas data
 */
