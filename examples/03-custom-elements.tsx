/**
 * Example 3: Creating Custom Element Types
 * 
 * This example demonstrates how to create and register custom element types
 * with custom rendering, properties, and inspector schemas.
 */

import React from 'react';
import { 
  VisualEditorWorkspace, 
  ElementRenderer,
  EditorElement,
  InspectorFieldSchema
} from '@deckedout/visual-editor';
import { Text, Circle, Star } from 'react-konva';
import { Circle as CircleIcon, Star as StarIcon } from 'lucide-react';

// Define custom props interface
interface CircleElementProps {
  radius: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
}

// Create Circle element renderer
const CircleElementRenderer: ElementRenderer<CircleElementProps> = {
  type: 'circle',
  displayName: 'Circle',
  icon: <CircleIcon size={16} />,
  
  defaultProps: {
    radius: 50,
    fill: '#3b82f6',
    stroke: '#1e40af',
    strokeWidth: 2
  },
  
  defaultSize: {
    width: 100,
    height: 100
  },
  
  // Inspector schema for property editing
  inspectorSchema: [
    {
      name: 'radius',
      type: 'slider',
      label: 'Radius',
      min: 10,
      max: 200,
      step: 5,
      description: 'Circle radius in pixels'
    },
    {
      name: 'fill',
      type: 'color',
      label: 'Fill Color',
      description: 'Interior color of the circle'
    },
    {
      name: 'stroke',
      type: 'color',
      label: 'Stroke Color',
      description: 'Border color of the circle'
    },
    {
      name: 'strokeWidth',
      type: 'slider',
      label: 'Stroke Width',
      min: 0,
      max: 20,
      step: 1
    }
  ] as InspectorFieldSchema[],
  
  // Non-Konva render (for previews, exports, etc.)
  render: (element: EditorElement<CircleElementProps>) => {
    return (
      <div
        style={{
          width: element.props.radius * 2,
          height: element.props.radius * 2,
          borderRadius: '50%',
          backgroundColor: element.props.fill,
          border: `${element.props.strokeWidth}px solid ${element.props.stroke}`
        }}
      />
    );
  },
  
  // Konva canvas rendering
  renderComponent: ({ element, isSelected, onSelect, onTransform }) => {
    return (
      <Circle
        x={element.position.x + element.props.radius}
        y={element.position.y + element.props.radius}
        radius={element.props.radius}
        fill={element.props.fill}
        stroke={element.props.stroke}
        strokeWidth={element.props.strokeWidth}
        opacity={element.opacity}
        rotation={element.rotation}
        draggable={!element.locked}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          const node = e.target;
          onTransform({
            position: {
              x: node.x() - element.props.radius,
              y: node.y() - element.props.radius
            }
          });
        }}
      />
    );
  }
};

// Define Star element props
interface StarElementProps {
  numPoints: number;
  innerRadius: number;
  outerRadius: number;
  fill: string;
}

// Create Star element renderer
const StarElementRenderer: ElementRenderer<StarElementProps> = {
  type: 'star',
  displayName: 'Star',
  icon: <StarIcon size={16} />,
  
  defaultProps: {
    numPoints: 5,
    innerRadius: 20,
    outerRadius: 40,
    fill: '#fbbf24'
  },
  
  defaultSize: {
    width: 80,
    height: 80
  },
  
  inspectorSchema: [
    {
      name: 'numPoints',
      type: 'slider',
      label: 'Points',
      min: 3,
      max: 12,
      step: 1,
      description: 'Number of star points'
    },
    {
      name: 'innerRadius',
      type: 'slider',
      label: 'Inner Radius',
      min: 10,
      max: 100,
      step: 5
    },
    {
      name: 'outerRadius',
      type: 'slider',
      label: 'Outer Radius',
      min: 20,
      max: 150,
      step: 5
    },
    {
      name: 'fill',
      type: 'color',
      label: 'Color'
    }
  ] as InspectorFieldSchema[],
  
  render: (element) => (
    <div style={{ color: element.props.fill }}>⭐</div>
  ),
  
  renderComponent: ({ element, isSelected, onSelect, onTransform }) => {
    return (
      <Star
        x={element.position.x + element.size.width / 2}
        y={element.position.y + element.size.height / 2}
        numPoints={element.props.numPoints}
        innerRadius={element.props.innerRadius}
        outerRadius={element.props.outerRadius}
        fill={element.props.fill}
        opacity={element.opacity}
        rotation={element.rotation}
        draggable={!element.locked}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          const node = e.target;
          onTransform({
            position: {
              x: node.x() - element.size.width / 2,
              y: node.y() - element.size.height / 2
            }
          });
        }}
      />
    );
  }
};

export function CustomElementsExample() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <VisualEditorWorkspace
        width={1000}
        height={700}
        customElements={[CircleElementRenderer, StarElementRenderer]}
        showToolbar={true}
        showInspector={true}
        showLayers={true}
      />
    </div>
  );
}

/**
 * Creating custom elements involves:
 * 
 * 1. Define Props Interface
 *    - Specify all customizable properties
 * 
 * 2. Create ElementRenderer Object
 *    - type: Unique identifier
 *    - displayName: UI label
 *    - icon: Toolbar icon
 *    - defaultProps: Initial property values
 *    - defaultSize: Initial dimensions
 * 
 * 3. Define Inspector Schema
 *    - Specify editable fields and their types
 *    - Add validation (min/max/step)
 *    - Provide descriptions
 * 
 * 4. Implement Render Methods
 *    - render(): For non-canvas contexts
 *    - renderComponent(): For Konva canvas
 * 
 * 5. Register with Editor
 *    - Pass to customElements prop
 *    - Elements appear in toolbar automatically
 */
