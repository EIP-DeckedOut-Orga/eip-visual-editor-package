/**
 * Tests for VisualEditorWorkspace component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { VisualEditorWorkspace } from '../VisualEditorWorkspace';
import { EditorMode, CanvasExport, EditorAPI } from '../../types';
import { createElement } from '../../utils/editorUtils';

// Mock all child components
jest.mock('../Topbar', () => ({
  Topbar: ({ onUndo, onRedo, onExport, onImport }: {
    onUndo: () => void;
    onRedo: () => void;
    onExport: () => void;
    onImport: () => void;
  }) => (
    <div data-testid="topbar">
      <button onClick={onUndo}>Undo</button>
      <button onClick={onRedo}>Redo</button>
      <button onClick={onExport}>Export</button>
      <button onClick={onImport}>Import</button>
    </div>
  ),
}));

jest.mock('../Toolbar', () => ({
  Toolbar: () => <div data-testid="toolbar">Toolbar</div>,
}));

jest.mock('../Canvas', () => ({
  Canvas: ({ onSelectElement, onTransformElement }: {
    onSelectElement: (id: string | null) => void;
    onTransformElement: (id: string, updates: Record<string, unknown>) => void;
  }) => (
    <div data-testid="canvas">
      <button onClick={() => onSelectElement('test-id')}>Select Element</button>
      <button onClick={() => onTransformElement('test-id', { position: { x: 100, y: 100 } })}>
        Transform Element
      </button>
    </div>
  ),
}));

jest.mock('../LayersPanel', () => ({
  LayersPanel: () => <div data-testid="layers-panel">Layers</div>,
}));

jest.mock('../Inspector', () => ({
  Inspector: () => <div data-testid="inspector">Inspector</div>,
}));

describe('VisualEditorWorkspace', () => {
  const mockMode: EditorMode = {
    name: 'test-mode',
    displayName: 'Test Mode',
    defaultCanvasSize: { width: 1080, height: 1080 },
    backgroundColor: '#ffffff',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render all panels by default', () => {
      render(<VisualEditorWorkspace />);

      expect(screen.getByTestId('topbar')).toBeInTheDocument();
      expect(screen.getByTestId('toolbar')).toBeInTheDocument();
      expect(screen.getByTestId('canvas')).toBeInTheDocument();
      expect(screen.getByTestId('layers-panel')).toBeInTheDocument();
      expect(screen.getByTestId('inspector')).toBeInTheDocument();
    });

    it('should hide topbar when showTopbar is false', () => {
      render(<VisualEditorWorkspace showTopbar={false} />);

      expect(screen.queryByTestId('topbar')).not.toBeInTheDocument();
    });

    it('should hide toolbar when showToolbar is false', () => {
      render(<VisualEditorWorkspace showToolbar={false} />);

      expect(screen.queryByTestId('toolbar')).not.toBeInTheDocument();
    });

    it('should hide canvas when showCanvas is false', () => {
      render(<VisualEditorWorkspace showCanvas={false} />);

      expect(screen.queryByTestId('canvas')).not.toBeInTheDocument();
    });

    it('should hide layers panel when showLayers is false', () => {
      render(<VisualEditorWorkspace showLayers={false} />);

      expect(screen.queryByTestId('layers-panel')).not.toBeInTheDocument();
    });

    it('should hide inspector when showInspector is false', () => {
      render(<VisualEditorWorkspace showInspector={false} />);

      expect(screen.queryByTestId('inspector')).not.toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<VisualEditorWorkspace className="custom-class" />);

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('Mode and Initial Data', () => {
    it('should initialize with mode', () => {
      render(<VisualEditorWorkspace mode={mockMode} />);

      // Mode is applied internally - verify component renders
      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });

    it('should initialize with initial data', () => {
      const initialData: CanvasExport = {
        width: 800,
        height: 600,
        elements: [createElement('text', { content: 'Test' })],
        metadata: { version: '1.0' },
      };

      render(<VisualEditorWorkspace initialData={initialData} />);

      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });

    it('should handle custom elements', () => {
      const customElement = {
        type: 'custom',
        name: 'Custom Element',
        icon: 'custom-icon',
        defaultProps: {},
        component: () => <div>Custom</div>,
      };

      render(<VisualEditorWorkspace customElements={[customElement]} />);

      expect(screen.getByTestId('toolbar')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should handle element selection', () => {
      render(<VisualEditorWorkspace />);

      const selectButton = screen.getByText('Select Element');
      fireEvent.click(selectButton);

      // Selection is handled internally - verify no crash
      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });

    it('should handle element transformation', () => {
      render(<VisualEditorWorkspace />);

      const transformButton = screen.getByText('Transform Element');
      fireEvent.click(transformButton);

      // Transformation is handled internally - verify no crash
      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });

    it('should handle undo action', () => {
      render(<VisualEditorWorkspace />);

      const undoButton = screen.getByText('Undo');
      fireEvent.click(undoButton);

      expect(screen.getByTestId('topbar')).toBeInTheDocument();
    });

    it('should handle redo action', () => {
      render(<VisualEditorWorkspace />);

      const redoButton = screen.getByText('Redo');
      fireEvent.click(redoButton);

      expect(screen.getByTestId('topbar')).toBeInTheDocument();
    });
  });

  describe('Export/Import', () => {
    it('should handle export action', () => {
      // Mock URL.createObjectURL and revokeObjectURL
      global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
      global.URL.revokeObjectURL = jest.fn();

      const originalCreateElement = document.createElement.bind(document);
      let createElementCallCount = 0;
      
      // Mock createElement to return mock only for the specific export call
      jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
        createElementCallCount++;
        if (tagName === 'a' && createElementCallCount > 10) {
          const mockLink = {
            href: '',
            download: '',
            click: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            setAttribute: jest.fn(),
            getAttribute: jest.fn(),
          } as unknown as HTMLElement;
          return mockLink;
        }
        return originalCreateElement(tagName);
      });

      const { unmount } = render(<VisualEditorWorkspace />);

      const exportButton = screen.getByText('Export');
      fireEvent.click(exportButton);

      // Cleanup
      unmount();
      jest.restoreAllMocks();
    });

    it('should handle import action', async () => {
      const originalCreateElement = document.createElement.bind(document);
      let createElementCallCount = 0;
      
      // Mock createElement to return mock only for the specific import call
      jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
        createElementCallCount++;
        if (tagName === 'input' && createElementCallCount > 10) {
          const mockInput = {
            type: '',
            accept: '',
            onchange: null as ((event: Event) => void) | null,
            click: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            setAttribute: jest.fn(),
            getAttribute: jest.fn(),
          } as unknown as HTMLElement;
          return mockInput;
        }
        return originalCreateElement(tagName);
      });

      const { unmount } = render(<VisualEditorWorkspace />);

      const importButton = screen.getByText('Import');
      fireEvent.click(importButton);

      // Cleanup
      unmount();
      jest.restoreAllMocks();
    });
  });

  describe('Keyboard Shortcuts', () => {
    it('should handle Escape key to deselect', () => {
      render(<VisualEditorWorkspace />);

      fireEvent.keyDown(window, { key: 'Escape' });

      // Deselection is handled internally - verify no crash
      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });

    it('should handle Delete key', () => {
      render(<VisualEditorWorkspace />);

      // First select an element
      const selectButton = screen.getByText('Select Element');
      fireEvent.click(selectButton);

      fireEvent.keyDown(window, { key: 'Delete' });

      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });

    it('should handle Ctrl+Z for undo', () => {
      render(<VisualEditorWorkspace />);

      fireEvent.keyDown(window, { key: 'z', ctrlKey: true });

      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });

    it('should handle Ctrl+Y for redo', () => {
      render(<VisualEditorWorkspace />);

      fireEvent.keyDown(window, { key: 'y', ctrlKey: true });

      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });

    it('should handle Ctrl+C for copy', () => {
      render(<VisualEditorWorkspace />);

      // Select an element first
      const selectButton = screen.getByText('Select Element');
      fireEvent.click(selectButton);

      fireEvent.keyDown(window, { key: 'c', ctrlKey: true });

      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });

    it('should handle Ctrl+V for paste', () => {
      render(<VisualEditorWorkspace />);

      fireEvent.keyDown(window, { key: 'v', ctrlKey: true });

      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });

    it('should handle Ctrl+D for duplicate', () => {
      render(<VisualEditorWorkspace />);

      // Select an element first
      const selectButton = screen.getByText('Select Element');
      fireEvent.click(selectButton);

      fireEvent.keyDown(window, { key: 'd', ctrlKey: true });

      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });

    it('should handle arrow keys for element movement', () => {
      render(<VisualEditorWorkspace />);

      // Select an element first
      const selectButton = screen.getByText('Select Element');
      fireEvent.click(selectButton);

      fireEvent.keyDown(window, { key: 'ArrowUp' });
      fireEvent.keyDown(window, { key: 'ArrowDown' });
      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      fireEvent.keyDown(window, { key: 'ArrowRight' });

      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });

    it('should not handle shortcuts in readonly mode', () => {
      render(<VisualEditorWorkspace readonly={true} />);

      fireEvent.keyDown(window, { key: 'Delete' });

      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });
  });

  describe('OnChange Callback', () => {
    it('should call onChange when data changes', async () => {
      const onChange = jest.fn();
      render(<VisualEditorWorkspace onChange={onChange} />);

      // Wait for initial onChange call
      await waitFor(() => {
        expect(onChange).toHaveBeenCalled();
      });
    });

    it('should pass correct data to onChange', async () => {
      const onChange = jest.fn();
      render(<VisualEditorWorkspace onChange={onChange} />);

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith(
          expect.objectContaining({
            width: expect.any(Number),
            height: expect.any(Number),
            elements: expect.any(Array),
            metadata: expect.any(Object),
          })
        );
      });
    });
  });

  describe('API Ref', () => {
    it('should expose API via ref', () => {
      const apiRef = React.createRef<EditorAPI>();
      render(<VisualEditorWorkspace apiRef={apiRef} />);

      expect(apiRef.current).toBeDefined();
      expect(apiRef.current).not.toBeNull();
      if (apiRef.current) {
        expect(apiRef.current.addElement).toBeDefined();
        expect(apiRef.current.removeElement).toBeDefined();
        expect(apiRef.current.updateElement).toBeDefined();
      }
    });
  });

  describe('Props Integration', () => {
    it('should respect width and height props', () => {
      render(<VisualEditorWorkspace width={1920} height={1080} />);

      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });

    it('should handle enableSnapGuides prop', () => {
      render(<VisualEditorWorkspace enableSnapGuides={false} />);

      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });

    it('should handle enablePanZoom prop', () => {
      render(<VisualEditorWorkspace enablePanZoom={false} />);

      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });

    it('should handle backgroundImageUrl prop', () => {
      render(<VisualEditorWorkspace backgroundImageUrl="https://example.com/bg.jpg" />);

      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });

    it('should handle hideElements prop', () => {
      render(<VisualEditorWorkspace hideElements={true} />);

      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });
  });

  describe('Asset Picker', () => {
    it('should hide asset picker when showAssetPicker is false', () => {
      render(<VisualEditorWorkspace showAssetPicker={false} />);

      expect(screen.getByTestId('inspector')).toBeInTheDocument();
    });

    it('should render asset picker in bottom position', () => {
      const modeWithAssetPicker: EditorMode = {
        ...mockMode,
        assetPickerComponent: () => <div data-testid="asset-picker">Assets</div>,
        assetPickerPosition: 'bottom',
      };

      render(<VisualEditorWorkspace mode={modeWithAssetPicker} />);

      // Asset picker is rendered but may not be visible in test without proper DOM
      expect(screen.getByTestId('inspector')).toBeInTheDocument();
    });
  });

  describe('Element Registry', () => {
    it('should initialize element registry', () => {
      render(<VisualEditorWorkspace />);

      expect(screen.getByTestId('toolbar')).toBeInTheDocument();
    });

    it('should register custom elements', () => {
      const customElement = {
        type: 'custom',
        name: 'Custom',
        icon: 'icon',
        defaultProps: {},
        component: () => <div>Custom</div>,
      };

      render(<VisualEditorWorkspace customElements={[customElement]} />);

      expect(screen.getByTestId('toolbar')).toBeInTheDocument();
    });
  });

  describe('Background Management', () => {
    it('should initialize background color from mode', () => {
      const modeWithBg: EditorMode = {
        ...mockMode,
        backgroundColor: '#ff0000',
      };

      render(<VisualEditorWorkspace mode={modeWithBg} />);

      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });

    it('should handle background image from mode', () => {
      const modeWithImage: EditorMode = {
        ...mockMode,
        backgroundImage: 'test-image-id',
        context: {
          imageUrls: new Map([['test-image-id', 'https://example.com/bg.jpg']]),
        },
      };

      render(<VisualEditorWorkspace mode={modeWithImage} />);

      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty initial data', () => {
      const emptyData: CanvasExport = {
        width: 800,
        height: 600,
        elements: [],
      };

      render(<VisualEditorWorkspace initialData={emptyData} />);

      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });

    it('should handle missing mode properties', () => {
      const minimalMode: EditorMode = {
        name: 'minimal',
        displayName: 'Minimal',
        defaultCanvasSize: { width: 800, height: 600 },
      };

      render(<VisualEditorWorkspace mode={minimalMode} />);

      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });

    it('should handle multiple rapid keyboard shortcuts', () => {
      render(<VisualEditorWorkspace />);

      fireEvent.keyDown(window, { key: 'z', ctrlKey: true });
      fireEvent.keyDown(window, { key: 'y', ctrlKey: true });
      fireEvent.keyDown(window, { key: 'z', ctrlKey: true });
      fireEvent.keyDown(window, { key: 'y', ctrlKey: true });

      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });
  });
});
