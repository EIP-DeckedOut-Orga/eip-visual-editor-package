/**
 * Example 5: Editor Modes and Configuration
 * 
 * This example demonstrates how to create custom editor modes
 * with specific configurations, custom tools, and behaviors.
 */

import React, { useState } from 'react';
import { 
  VisualEditorWorkspace, 
  EditorMode,
  EditorAPI,
  CustomEditorButtonAction,
  CustomEditorDropdownAction
} from '@deckedout/visual-editor';
import { Palette, Download, Upload, Wand2 } from 'lucide-react';

// Card Editor Mode - Optimized for card design
const cardEditorMode: EditorMode = {
  id: 'card-editor',
  name: 'Card Designer',
  description: 'Create and design game cards',
  
  // Default canvas size for cards
  canvasSize: {
    width: 750,
    height: 1050  // Standard poker card ratio
  },
  
  // Custom toolbar configuration
  toolbarConfig: {
    showElementTools: true,
    hiddenElementTypes: [], // Show all element types
    
    // Custom tools at the start
    toolsStart: [
      {
        type: 'button',
        id: 'apply-template',
        label: 'Apply Template',
        icon: <Wand2 size={16} />,
        onClick: (api: EditorAPI) => {
          // Apply a card template
          api.clear();
          
          // Background
          const bg = {
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
              src: 'https://via.placeholder.com/750x1050/e0e7ff/000000?text=Card+Background',
              fit: 'cover'
            }
          };
          
          // Title
          const title = {
            id: 'template-title',
            type: 'text',
            position: { x: 75, y: 50 },
            size: { width: 600, height: 80 },
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
          };
          
          api.loadElements([bg, title]);
        }
      } as CustomEditorButtonAction
    ],
    
    // Custom tools at the end
    toolsEnd: [
      {
        type: 'dropdown',
        id: 'card-size',
        label: 'Card Size',
        placeholder: 'Standard',
        options: [
          { value: 'poker', label: 'Poker (63×88mm)' },
          { value: 'bridge', label: 'Bridge (57×88mm)' },
          { value: 'tarot', label: 'Tarot (70×120mm)' },
          { value: 'mini', label: 'Mini (44×68mm)' }
        ],
        onChange: (value: string, api: EditorAPI) => {
          const sizes: Record<string, { width: number; height: number }> = {
            poker: { width: 750, height: 1050 },
            bridge: { width: 675, height: 1050 },
            tarot: { width: 525, height: 900 },
            mini: { width: 525, height: 810 }
          };
          
          const size = sizes[value];
          if (size) {
            // Resize canvas logic would go here
            console.log('Resize to:', size);
          }
        }
      } as CustomEditorDropdownAction
    ]
  },
  
  // Topbar configuration
  topbarConfig: {
    showUndo: true,
    showRedo: true,
    showDelete: true,
    showCopy: true,
    showPaste: true,
    showDuplicate: true,
    showCanvasSizeControls: false, // Fixed size for cards
    showImport: true,
    showExport: true
  }
};

// Poster Editor Mode - For larger designs
const posterEditorMode: EditorMode = {
  id: 'poster-editor',
  name: 'Poster Designer',
  description: 'Create posters and banners',
  
  canvasSize: {
    width: 1920,
    height: 1080  // HD ratio
  },
  
  toolbarConfig: {
    showElementTools: true,
    toolsStart: [
      {
        type: 'button',
        id: 'background-picker',
        label: 'Background',
        icon: <Palette size={16} />,
        onClick: (api: EditorAPI) => {
          // Add background color selector
          alert('Background picker would open here');
        }
      } as CustomEditorButtonAction
    ]
  },
  
  topbarConfig: {
    showUndo: true,
    showRedo: true,
    showDelete: true,
    showCanvasSizeControls: true, // Allow size adjustment
    showImport: true,
    showExport: true
  }
};

// Minimal Mode - For simple editing
const minimalMode: EditorMode = {
  id: 'minimal',
  name: 'Minimal Editor',
  description: 'Simple editing interface',
  
  canvasSize: {
    width: 1000,
    height: 600
  },
  
  toolbarConfig: {
    showElementTools: true,
    hiddenElementTypes: ['image'], // Only show text
    toolsStart: [],
    toolsEnd: []
  },
  
  topbarConfig: {
    showUndo: true,
    showRedo: true,
    showDelete: true,
    showCanvasSizeControls: false,
    showImport: false,
    showExport: false
  }
};

export function EditorModesExample() {
  const [currentMode, setCurrentMode] = useState<EditorMode>(cardEditorMode);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Mode Selector */}
      <div style={{ 
        padding: '15px', 
        borderBottom: '2px solid #ccc',
        background: '#f8fafc'
      }}>
        <h3 style={{ margin: '0 0 10px 0' }}>Select Editor Mode:</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setCurrentMode(cardEditorMode)}
            style={{
              padding: '10px 20px',
              background: currentMode.id === 'card-editor' ? '#3b82f6' : '#e2e8f0',
              color: currentMode.id === 'card-editor' ? 'white' : 'black',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            🎴 Card Designer
          </button>
          
          <button
            onClick={() => setCurrentMode(posterEditorMode)}
            style={{
              padding: '10px 20px',
              background: currentMode.id === 'poster-editor' ? '#3b82f6' : '#e2e8f0',
              color: currentMode.id === 'poster-editor' ? 'white' : 'black',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            📊 Poster Designer
          </button>
          
          <button
            onClick={() => setCurrentMode(minimalMode)}
            style={{
              padding: '10px 20px',
              background: currentMode.id === 'minimal' ? '#3b82f6' : '#e2e8f0',
              color: currentMode.id === 'minimal' ? 'white' : 'black',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            ✏️ Minimal Editor
          </button>
        </div>
        
        <p style={{ margin: '10px 0 0 0', color: '#64748b' }}>
          {currentMode.description} - Canvas: {currentMode.canvasSize?.width}×{currentMode.canvasSize?.height}
        </p>
      </div>

      {/* Editor with selected mode */}
      <div style={{ flex: 1 }}>
        <VisualEditorWorkspace
          key={currentMode.id} // Force remount on mode change
          mode={currentMode}
          showToolbar={true}
          showTopbar={true}
          showInspector={true}
          showLayers={true}
          enableSnapGuides={true}
        />
      </div>
    </div>
  );
}

/**
 * EditorMode Configuration:
 * 
 * Basic Settings:
 * - id: Unique mode identifier
 * - name: Display name
 * - description: Mode description
 * - canvasSize: Default canvas dimensions
 * 
 * Toolbar Configuration (toolbarConfig):
 * - showElementTools: Show built-in element buttons
 * - hiddenElementTypes: Array of element types to hide
 * - toolsStart: Custom tools at toolbar start
 * - toolsEnd: Custom tools at toolbar end
 * - toolsStartClassName: Custom CSS class
 * - toolsEndClassName: Custom CSS class
 * 
 * Topbar Configuration (topbarConfig):
 * - showUndo/showRedo: History controls
 * - showDelete: Delete button
 * - showCopy/showPaste: Clipboard controls
 * - showDuplicate: Duplicate button
 * - showCanvasSizeControls: Size adjustment
 * - showImport/showExport: Data transfer
 * 
 * Custom Actions Types:
 * - button: Simple click action
 * - dropdown: Select from options
 * - input: Text/number input
 * - color: Color picker
 * - toggle: On/off switch
 * - separator: Visual divider
 */
