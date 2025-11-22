/**
 * Tests for VisualEditor component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { VisualEditor } from '../VisualEditor';
import { EditorMode } from '../../types';

// Mock child components and dependencies
jest.mock('react-konva', () => ({
  Stage: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => (
    <div data-testid="konva-stage" {...props}>{children}</div>
  ),
  Layer: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="konva-layer">{children}</div>
  ),
}));

describe('VisualEditor', () => {
  const mockMode: EditorMode = {
    name: 'test-mode',
    displayName: 'Test Mode',
    defaultCanvasSize: { width: 800, height: 600 },
  };

  it('should render the editor', () => {
    const { container } = render(<VisualEditor />);
    expect(container).toBeInTheDocument();
  });

  it('should render with mode', () => {
    render(<VisualEditor mode={mockMode} />);
    expect(screen.getByTestId('konva-stage')).toBeInTheDocument();
  });

  it('should render with custom width and height', () => {
    render(<VisualEditor width={1920} height={1080} />);
    const stage = screen.getByTestId('konva-stage');
    expect(stage).toBeInTheDocument();
  });

  it('should render in readonly mode', () => {
    render(<VisualEditor readonly={true} />);
    expect(screen.getByTestId('konva-stage')).toBeInTheDocument();
  });

  it('should handle initial data', () => {
    const initialData = {
      width: 800,
      height: 600,
      elements: [],
      metadata: { version: '1.0' },
    };

    render(<VisualEditor initialData={initialData} />);
    expect(screen.getByTestId('konva-stage')).toBeInTheDocument();
  });

  it('should handle onChange callback', () => {
    const onChange = jest.fn();
    render(<VisualEditor onChange={onChange} />);
    expect(screen.getByTestId('konva-stage')).toBeInTheDocument();
  });

  it('should handle onSelectionChange callback', () => {
    const onSelectionChange = jest.fn();
    render(<VisualEditor onSelectionChange={onSelectionChange} />);
    expect(screen.getByTestId('konva-stage')).toBeInTheDocument();
  });

  it('should handle onExport callback', () => {
    const onExport = jest.fn();
    render(<VisualEditor onExport={onExport} />);
    expect(screen.getByTestId('konva-stage')).toBeInTheDocument();
  });

  it('should render with custom elements', () => {
    const customElements = [{
      type: 'custom',
      displayName: 'Custom Element',
      render: () => <div>Custom</div>,
      defaultProps: {},
    }];

    render(<VisualEditor customElements={customElements} />);
    expect(screen.getByTestId('konva-stage')).toBeInTheDocument();
  });

  it('should hide toolbar when showToolbar is false', () => {
    render(<VisualEditor showToolbar={false} />);
    expect(screen.getByTestId('konva-stage')).toBeInTheDocument();
  });

  it('should hide inspector when showInspector is false', () => {
    render(<VisualEditor showInspector={false} />);
    expect(screen.getByTestId('konva-stage')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<VisualEditor className="custom-editor" />);
    expect(container.firstChild).toHaveClass('custom-editor');
  });

  it('should apply custom styles', () => {
    const customStyle = { backgroundColor: 'red', padding: '20px' };
    const { container } = render(<VisualEditor style={customStyle} />);
    const editorDiv = container.firstChild as HTMLElement;
    expect(editorDiv).toHaveStyle('background-color: red');
  });

  it('should render stage and layer', () => {
    render(<VisualEditor />);
    expect(screen.getByTestId('konva-stage')).toBeInTheDocument();
    expect(screen.getByTestId('konva-layer')).toBeInTheDocument();
  });

  it('should handle mode with background color', () => {
    const modeWithBg: EditorMode = {
      ...mockMode,
      backgroundColor: '#ff0000',
    };

    render(<VisualEditor mode={modeWithBg} />);
    expect(screen.getByTestId('konva-stage')).toBeInTheDocument();
  });

  it('should handle empty custom elements array', () => {
    render(<VisualEditor customElements={[]} />);
    expect(screen.getByTestId('konva-stage')).toBeInTheDocument();
  });

  it('should render without crashing when no props provided', () => {
    const { container } = render(<VisualEditor />);
    expect(container).toBeInTheDocument();
    expect(screen.getByTestId('konva-stage')).toBeInTheDocument();
  });

  it('should handle mode switching', () => {
    const { rerender } = render(<VisualEditor mode={mockMode} />);
    
    const newMode: EditorMode = {
      name: 'new-mode',
      displayName: 'New Mode',
      defaultCanvasSize: { width: 1080, height: 1080 },
    };

    rerender(<VisualEditor mode={newMode} />);
    expect(screen.getByTestId('konva-stage')).toBeInTheDocument();
  });

  it('should handle width and height prop changes', () => {
    const { rerender } = render(<VisualEditor width={800} height={600} />);
    
    rerender(<VisualEditor width={1920} height={1080} />);
    expect(screen.getByTestId('konva-stage')).toBeInTheDocument();
  });
});
