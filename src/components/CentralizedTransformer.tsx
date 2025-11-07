/**
 * Centralized Transformer Component
 *
 * A single transformer that handles all selected elements,
 * eliminating the need for individual transformers in each element.
 */

import React, { useEffect, useRef } from "react";
import { Transformer } from "react-konva";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";

export interface CentralizedTransformerProps {
  /** ID of the selected element */
  selectedElementId: string | null;

  /** Reference to the stage to find nodes */
  stageRef: React.RefObject<Konva.Stage>;

  /** Whether the element is locked (readonly mode) */
  isLocked?: boolean;

  /** Update trigger - increment this to force re-attachment */
  updateTrigger?: number;

  /** Callback when transform ends */
  onTransformEnd?: (
    elementId: string,
    updates: {
      position?: { x: number; y: number };
      size?: { width: number; height: number };
      rotation?: number;
    }
  ) => void;

  /** Callback during transform for snap guides (optional) */
  onTransform?: (
    elementId: string,
    updates: {
      position?: { x: number; y: number };
      size?: { width: number; height: number };
      rotation?: number;
    }
  ) => void;
}

/**
 * Centralized transformer that attaches to the selected element
 */
export const CentralizedTransformer: React.FC<CentralizedTransformerProps> = ({
  selectedElementId,
  stageRef,
  isLocked = false,
  updateTrigger = 0,
  onTransformEnd,
  onTransform,
}) => {
  const transformerRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    const transformer = transformerRef.current;
    const stage = stageRef.current;

    if (!transformer || !stage || !selectedElementId || isLocked) {
      // Clear transformer if no selection or locked
      if (transformer) {
        transformer.nodes([]);
        transformer.getLayer()?.batchDraw();
      }
      return;
    }

    // Find the selected node by ID
    // We need to search for a node with matching ID in the stage
    const findNodeById = (id: string): Konva.Node | null => {
      const layer = stage.getLayers()[0]; // Get the main layer
      if (!layer) return null;

      // Search through all children
      const findInChildren = (node: Konva.Node): Konva.Node | null => {
        // Check if this node has the ID we're looking for
        // We'll use the element's ID as part of the key, so we need to check attrs
        if (node.attrs.id === id || node.id() === id) {
          return node;
        }

        // Recursively search children
        const children = (node as any).getChildren?.();
        if (children) {
          for (const child of children) {
            const found = findInChildren(child);
            if (found) return found;
          }
        }

        return null;
      };

      return findInChildren(layer);
    };

    const selectedNode = findNodeById(selectedElementId);

    if (selectedNode && selectedNode.draggable()) {
      // Attach transformer to the node
      transformer.nodes([selectedNode]);
      transformer.getLayer()?.batchDraw();
    } else {
      transformer.nodes([]);
      transformer.getLayer()?.batchDraw();
    }
  }, [selectedElementId, stageRef, isLocked, updateTrigger]);

  const handleTransform = (e: KonvaEventObject<Event>) => {
    if (!onTransform || !selectedElementId) return;

    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    const updates = {
      position: {
        x: node.x(),
        y: node.y(),
      },
      size: {
        width: Math.max(5, node.width() * scaleX),
        height: Math.max(5, node.height() * scaleY),
      },
      rotation: node.rotation(),
    };

    onTransform(selectedElementId, updates);
  };

  const handleTransformEnd = (e: KonvaEventObject<Event>) => {
    if (!onTransformEnd || !selectedElementId) return;

    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // Reset scale to 1 and apply it to width/height
    node.scaleX(1);
    node.scaleY(1);

    const updates = {
      position: {
        x: node.x(),
        y: node.y(),
      },
      size: {
        width: Math.max(5, node.width() * scaleX),
        height: Math.max(5, node.height() * scaleY),
      },
      rotation: node.rotation(),
    };

    onTransformEnd(selectedElementId, updates);
  };

  // Don't render if locked or no selection
  if (isLocked || !selectedElementId) {
    return null;
  }

  return (
    <Transformer
      ref={transformerRef}
      rotateEnabled={true}
      rotationSnaps={[0, 90, 180, 270]}
      keepRatio={false}
      anchorCornerRadius={2}
      flipEnabled={false}
      enabledAnchors={[
        "top-left",
        "top-right",
        "bottom-left",
        "bottom-right",
        "middle-left",
        "middle-right",
        "top-center",
        "bottom-center",
      ]}
      boundBoxFunc={(oldBox, newBox) => {
        // Limit resize to minimum 20px
        if (newBox.width < 20 || newBox.height < 20) {
          return oldBox;
        }
        return newBox;
      }}
      onTransform={handleTransform}
      onTransformEnd={handleTransformEnd}
    />
  );
};

export default CentralizedTransformer;
