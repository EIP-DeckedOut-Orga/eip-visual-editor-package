/**
 * Visual Editor - Text Element Renderer
 *
 * Built-in text element renderer using Konva.
 */

import React from "react";
import { Text } from "react-konva";
import { ElementRenderer, EditorElement, TextElementProps } from "../types";
import { Type } from "lucide-react";
import { getSnappingPosition, SnapGuide } from "../utils/snapping";
import { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";

/**
 * Text element renderer component
 */
export const TextElementRenderer: React.FC<{
  element: EditorElement<TextElementProps>;
  isSelected: boolean;
  onSelect: () => void;
  onTransform: (updates: Partial<EditorElement>) => void;
  // Snapping props
  allElements?: EditorElement[];
  canvasSize?: { width: number; height: number };
  onSnapGuides?: (guides: { vertical: SnapGuide[]; horizontal: SnapGuide[] }) => void;
  onClearSnapGuides?: () => void;
  // Element ID for centralized transformer
  elementId?: string;
}> = ({
  element,
  isSelected,
  onSelect,
  onTransform,
  allElements = [],
  canvasSize,
  onSnapGuides,
  onClearSnapGuides,
  elementId,
}) => {
  const shapeRef = React.useRef<any>(null);

  // Don't render if element is hidden
  const isVisible = element.visible !== false;
  const isLocked = element.locked === true;

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  const handleClick = (e: KonvaEventObject<MouseEvent, Node<NodeConfig>>) => {
    if (isLocked) return;
    e.evt.button !== 0 ? undefined : onSelect();
  };

  const handleDragMove = (e: KonvaEventObject<MouseEvent, Node<NodeConfig>>) => {
    // Only allow left-click (button 0) dragging
    if (!canvasSize || !onSnapGuides || !isSelected || e.evt.button !== 0) return;

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

  const handleTransform = () => {
    const node = shapeRef.current;
    if (!node) return;

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // Update width based on scaleX, keep font size constant
    const newWidth = Math.max(20, node.width() * scaleX);
    const newHeight = Math.max(20, node.height() * scaleY);

    // Reset scale immediately to prevent stretching
    node.scaleX(1);
    node.scaleY(1);

    // Update dimensions
    node.width(newWidth);
    node.height(newHeight);
  };

  // Build text decoration string
  const getTextDecoration = () => {
    const decorations: string[] = [];
    if (element.props.underline) decorations.push("underline");
    if (element.props.strikethrough) decorations.push("line-through");
    if (element.props.overline) decorations.push("overline");
    return decorations.join(" ") || "";
  };

  return (
    <>
      <Text
        ref={shapeRef}
        id={elementId || element.id}
        x={element.position.x}
        y={element.position.y}
        width={element.size.width}
        height={element.size.height}
        text={element.props.content}
        fontSize={element.props.fontSize}
        fontFamily={element.props.fontFamily || "Arial"}
        opacity={element.opacity}
        fill={element.props.color}
        align={element.props.align || "left"}
        fontStyle={
          `${element.props.bold ? "bold" : ""} ${element.props.italic ? "italic" : ""}`.trim() ||
          "normal"
        }
        textDecoration={getTextDecoration()}
        rotation={element.rotation}
        draggable={!isLocked && isSelected}
        listening={!isLocked}
        onClick={handleClick}
        onTap={isLocked ? undefined : onSelect}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onTransform={handleTransform}
        ellipsis={element.props.textOverflow === "ellipsis"}
        verticalAlign={element.props.verticalAlign || "top"}
        stroke={element.props.strokeColor || "#000000"}
        strokeWidth={element.props.strokeWidth || 0}
        strokeEnabled
        fillAfterStrokeEnabled
      />
    </>
  );
};

/**
 * Text element renderer definition
 */
export const textElementRenderer: ElementRenderer<TextElementProps> = {
  type: "text",
  displayName: "Text",
  render: (element) => <div>Text: {element.props.content}</div>, // Placeholder for non-Konva contexts
  renderComponent: TextElementRenderer, // Konva rendering component
  icon: <Type className="w-4 h-4" />,
  defaultProps: {
    content: "Text",
    fontSize: 16,
    fontFamily: "Arial",
    color: "#000000",
    strokeColor: "#000000",
    strokeWidth: 0,
    align: "left",
    verticalAlign: "top",
    bold: false,
    italic: false,
    underline: false,
    overline: false,
    strikethrough: false,
    wordWrap: "break-word",
  },
  defaultSize: {
    width: 200,
    height: 50,
  },
  inspectorSchema: [
    {
      name: "content",
      type: "string",
      label: "Text Content",
      defaultValue: "Text",
    },
    {
      name: "fontSize",
      type: "number",
      label: "Font Size",
      min: 0,
      max: 1024,
      step: 1,
      defaultValue: 16,
    },
    {
      name: "fontFamily",
      type: "select",
      label: "Font Family",
      options: [
        { value: "Arial", label: "Arial" },
        { value: "Times New Roman", label: "Times New Roman" },
        { value: "Courier New", label: "Courier New" },
        { value: "Georgia", label: "Georgia" },
        { value: "Verdana", label: "Verdana" },
        { value: "Outfit", label: "Outfit" },
      ],
      defaultValue: "Outfit",
    },
    {
      name: "color",
      type: "color",
      label: "Text Color",
      defaultValue: "#000000",
    },
    {
      name: "strokeColor",
      type: "color",
      label: "Stroke Color",
      defaultValue: "#000000",
    },
    {
      name: "strokeWidth",
      type: "number",
      label: "Stroke Width",
      min: 0,
      max: 50,
      step: 1,
      defaultValue: 0,
    },
    {
      name: "align",
      type: "select",
      label: "Horizontal Alignment",
      options: [
        { value: "left", label: "Left" },
        { value: "center", label: "Center" },
        { value: "right", label: "Right" },
      ],
      defaultValue: "left",
    },
    {
      name: "verticalAlign",
      type: "select",
      label: "Vertical Alignment",
      options: [
        { value: "top", label: "Top" },
        { value: "middle", label: "Middle" },
        { value: "bottom", label: "Bottom" },
      ],
      defaultValue: "top",
    },
    {
      name: "bold",
      type: "boolean",
      label: "Bold",
      defaultValue: false,
    },
    {
      name: "italic",
      type: "boolean",
      label: "Italic",
      defaultValue: false,
    },
    {
      name: "underline",
      type: "boolean",
      label: "Underline",
      defaultValue: false,
    },
    {
      name: "strikethrough",
      type: "boolean",
      label: "Strikethrough",
      defaultValue: false,
    },
  ],
};
