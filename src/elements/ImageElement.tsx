/**
 * Visual Editor - Image Element Renderer
 *
 * Built-in image element renderer using Konva.
 */

import React from "react";
import { Image as KonvaImage, Transformer, Rect, Text, Group } from "react-konva";
import { ElementRenderer, EditorElement, ImageElementProps } from "../types";
import useImage from "use-image";
import { Image } from "lucide-react";
import { getSnappingPosition, SnapGuide } from "../utils/snapping";
import { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";

/**
 * Image element renderer component
 */
export const ImageElementRenderer: React.FC<{
  element: EditorElement<ImageElementProps>;
  isSelected: boolean;
  onSelect: () => void;
  onTransform: (updates: Partial<EditorElement>) => void;
  // Snapping props
  allElements?: EditorElement[];
  canvasSize?: { width: number; height: number };
  onSnapGuides?: (guides: { vertical: SnapGuide[]; horizontal: SnapGuide[] }) => void;
  onClearSnapGuides?: () => void;
  // Image URL mapping for asset resolution
  imageUrls?: Map<string, string>;
  // Element ID for centralized transformer
  elementId?: string;
  // Callback to notify when node structure changes (e.g., image loads)
  onNodeUpdate?: () => void;
}> = ({
  element,
  isSelected,
  onSelect,
  onTransform,
  allElements = [],
  canvasSize,
  onSnapGuides,
  onClearSnapGuides,
  imageUrls,
  elementId,
  onNodeUpdate,
}) => {
  // Resolve image source - use imageUrls map if available
  const imageSrc = React.useMemo(() => {
    const src = element.props.src;

    // If src is already a full URL (http, blob, data), use it directly
    if (src && (src.startsWith("http") || src.startsWith("blob:") || src.startsWith("data:"))) {
      return src;
    }

    // Otherwise, try to resolve from imageUrls map
    if (src && imageUrls) {
      const resolvedUrl = imageUrls.get(src);
      if (resolvedUrl) {
        return resolvedUrl;
      }
    }

    // Fallback to original src
    return src;
  }, [element.props.src, imageUrls]);

  const [image] = useImage(imageSrc);
  const shapeRef = React.useRef<any>(null);
  const transformerRef = React.useRef<any>(null);

  // Don't render if element is hidden
  const isVisible = element.visible !== false;
  const isLocked = element.locked === true;

  React.useEffect(() => {
    if (isSelected && transformerRef.current && shapeRef.current) {
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  // Trigger a re-render/update when the image loads or changes
  // This helps the CentralizedTransformer re-attach to the updated node
  React.useEffect(() => {
    if (shapeRef.current) {
      // Force the layer to redraw when image changes
      const layer = shapeRef.current.getLayer();
      if (layer) {
        layer.batchDraw();
      }
      
      // Notify parent that the node has been updated (for transformer re-attachment)
      if (onNodeUpdate) {
        onNodeUpdate();
      }
    }
  }, [image, onNodeUpdate]);

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  const handleClick = (e: KonvaEventObject<MouseEvent, Node<NodeConfig>>) => {
    if (isLocked) return;
    e.evt.button !== 0 ? undefined : onSelect();
  };

  const handleDragMove = (e: KonvaEventObject<MouseEvent, Node<NodeConfig>>) => {
    if (!canvasSize || !onSnapGuides || e.evt.button !== 0) return;

    const node = e.target;
    const snapResult = getSnappingPosition(element, node.x(), node.y(), allElements, {
      threshold: 5,
      snapToElements: true,
      snapToCanvas: true,
      canvasSize,
    });

    // Apply snapped position
    node.x(snapResult.x);
    node.y(snapResult.y);

    // Show snap guides
    onSnapGuides({
      vertical: snapResult.verticalGuides,
      horizontal: snapResult.horizontalGuides,
    });
  };

  const handleDragEnd = (e: any) => {
    // Clear snap guides
    if (onClearSnapGuides) {
      onClearSnapGuides();
    }

    onTransform({
      position: {
        x: e.target.x(),
        y: e.target.y(),
      },
    });
  };

  return (
    <>
      {image ? (
        <KonvaImage
          ref={shapeRef}
          id={elementId || element.id}
          x={element.position.x}
          y={element.position.y}
          width={element.size.width}
          height={element.size.height}
          image={image}
          opacity={element.opacity}
          rotation={element.rotation}
          draggable={!isLocked && isSelected}
          listening={!isLocked}
          onClick={handleClick}
          onTap={isLocked ? undefined : onSelect}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
        />
      ) : (
        <Group
          ref={shapeRef}
          id={elementId || element.id}
          x={element.position.x}
          y={element.position.y}
          width={element.size.width}
          height={element.size.height}
          rotation={element.rotation}
          draggable={!isLocked && isSelected}
          listening={!isLocked}
          onClick={isLocked ? undefined : handleClick}
          onTap={isLocked ? undefined : onSelect}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
        >
          {/* Placeholder rectangle with dashed border */}
          <Rect
            width={element.size.width}
            height={element.size.height}
            fill="#f0f0f0"
            stroke="#999999"
            strokeWidth={2}
            dash={[10, 5]}
            opacity={element.opacity}
          />
          {/* Placeholder text */}
          <Text
            width={element.size.width}
            height={element.size.height}
            text="No Image"
            fontSize={16}
            fill="#666666"
            align="center"
            verticalAlign="middle"
          />
        </Group>
      )}
    </>
  );
};

/**
 * Image element renderer definition
 */
export const imageElementRenderer: ElementRenderer<ImageElementProps> = {
  type: "image",
  displayName: "Image",
  render: (element) => <div>Image: {element.props.src}</div>, // Placeholder for non-Konva contexts
  renderComponent: ImageElementRenderer, // Konva rendering component
  icon: <Image className="w-4 h-4" />,
  defaultProps: {
    src: "",
    fit: "fill",
  },
  defaultSize: {
    width: 200,
    height: 200,
  },
  inspectorSchema: [
    {
      name: "src",
      type: "image",
      label: "Image Source",
      description: "URL or path to the image",
      defaultValue: "",
    },
    {
      name: "fit",
      type: "select",
      label: "Fit Mode",
      options: [{ value: "fill", label: "Fill" }],
      defaultValue: "contain",
    },
  ],
};
