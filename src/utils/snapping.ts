/**
 * Snapping Utilities
 *
 * Helper functions for snapping elements to guides, other elements, and canvas edges.
 */

import { EditorElement } from "../types";

export interface SnapGuide {
  /** Position of the guide line */
  position: number;
  /** Orientation of the guide (vertical or horizontal) */
  orientation: "vertical" | "horizontal";
  /** Snap type (element edge, center, or canvas edge) */
  type: "edge" | "center" | "canvas";
}

export interface SnapResult {
  /** Snapped x position */
  x: number;
  /** Snapped y position */
  y: number;
  /** Vertical guides to display */
  verticalGuides: SnapGuide[];
  /** Horizontal guides to display */
  horizontalGuides: SnapGuide[];
}

export interface SnapOptions {
  /** Snap threshold in pixels */
  threshold?: number;
  /** Whether to snap to other elements */
  snapToElements?: boolean;
  /** Whether to snap to canvas edges */
  snapToCanvas?: boolean;
  /** Canvas size */
  canvasSize?: { width: number; height: number };
}

/**
 * Calculate the axis-aligned bounding box for a rotated element
 * Note: In Konva (without offsetX/offsetY), rotation happens around the TOP-LEFT corner (x, y)
 * For snapping, we primarily care about the CENTER point, not the rotated edges
 */
function getRotatedBounds(
  x: number,
  y: number,
  width: number,
  height: number,
  rotation: number
): { left: number; right: number; top: number; bottom: number; centerX: number; centerY: number } {
  // If no significant rotation, return simple bounds
  if (Math.abs(rotation) < 0.1 || Math.abs(rotation - 360) < 0.1) {
    return {
      left: x,
      right: x + width,
      top: y,
      bottom: y + height,
      centerX: x + width / 2,
      centerY: y + height / 2,
    };
  }

  // Convert rotation to radians
  const rad = (rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  // Calculate the four corners (relative to rotation origin at x, y)
  const corners = [
    { x: 0, y: 0 }, // top-left (rotation origin)
    { x: width, y: 0 }, // top-right
    { x: width, y: height }, // bottom-right
    { x: 0, y: height }, // bottom-left
  ];

  // Rotate corners around (x, y) and find min/max
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const corner of corners) {
    // Rotate point around origin (x, y)
    const rotatedX = x + corner.x * cos - corner.y * sin;
    const rotatedY = y + corner.x * sin + corner.y * cos;
    minX = Math.min(minX, rotatedX);
    maxX = Math.max(maxX, rotatedX);
    minY = Math.min(minY, rotatedY);
    maxY = Math.max(maxY, rotatedY);
  }

  // Calculate the actual center of the rotated rectangle
  // The center point rotates around (x, y)
  const centerX = x + (width / 2) * cos - (height / 2) * sin;
  const centerY = y + (width / 2) * sin + (height / 2) * cos;

  return {
    left: minX,
    right: maxX,
    top: minY,
    bottom: maxY,
    centerX,
    centerY,
  };
}

/**
 * Calculate snapping for an element being dragged
 */
export function getSnappingPosition(
  draggedElement: EditorElement,
  x: number,
  y: number,
  allElements: EditorElement[],
  options: SnapOptions = {}
): SnapResult {
  const { threshold = 5, snapToElements = true, snapToCanvas = true, canvasSize } = options;

  let snappedX = x;
  let snappedY = y;
  const verticalGuides: SnapGuide[] = [];
  const horizontalGuides: SnapGuide[] = [];

  // Calculate dragged element bounds (accounting for rotation)
  const draggedBounds = getRotatedBounds(
    x,
    y,
    draggedElement.size.width,
    draggedElement.size.height,
    draggedElement.rotation
  );

  const draggedLeft = draggedBounds.left;
  const draggedRight = draggedBounds.right;
  const draggedTop = draggedBounds.top;
  const draggedBottom = draggedBounds.bottom;
  const draggedCenterX = draggedBounds.centerX;
  const draggedCenterY = draggedBounds.centerY;

  // Check if the dragged element is significantly rotated
  const isRotated =
    Math.abs(draggedElement.rotation) > 0.1 && Math.abs(draggedElement.rotation - 360) > 0.1;

  // Track closest snap distances
  let closestVerticalSnap = threshold;
  let closestHorizontalSnap = threshold;
  let verticalOffset = 0;
  let horizontalOffset = 0;

  // Snap to canvas edges
  if (snapToCanvas && canvasSize) {
    // For rotated elements, snap to axis-aligned bounding box edges
    // NOTE: Edge snapping for rotated elements now enabled
    // Left edge
    if (Math.abs(draggedLeft) <= closestVerticalSnap) {
      verticalOffset = -draggedLeft;
      closestVerticalSnap = Math.abs(draggedLeft);
      verticalGuides.push({ position: 0, orientation: "vertical", type: "canvas" });
    }

    // Right edge
    if (Math.abs(draggedRight - canvasSize.width) <= closestVerticalSnap) {
      verticalOffset = canvasSize.width - draggedRight;
      closestVerticalSnap = Math.abs(draggedRight - canvasSize.width);
      verticalGuides.push({
        position: canvasSize.width,
        orientation: "vertical",
        type: "canvas",
      });
    }

    // Top edge
    if (Math.abs(draggedTop) <= closestHorizontalSnap) {
      horizontalOffset = -draggedTop;
      closestHorizontalSnap = Math.abs(draggedTop);
      horizontalGuides.push({ position: 0, orientation: "horizontal", type: "canvas" });
    }

    // Bottom edge
    if (Math.abs(draggedBottom - canvasSize.height) <= closestHorizontalSnap) {
      horizontalOffset = canvasSize.height - draggedBottom;
      closestHorizontalSnap = Math.abs(draggedBottom - canvasSize.height);
      horizontalGuides.push({
        position: canvasSize.height,
        orientation: "horizontal",
        type: "canvas",
      });
    }

    // Center X (always available, even for rotated elements)
    const canvasCenterX = canvasSize.width / 2;
    if (Math.abs(draggedCenterX - canvasCenterX) <= closestVerticalSnap) {
      verticalOffset = canvasCenterX - draggedCenterX;
      closestVerticalSnap = Math.abs(draggedCenterX - canvasCenterX);
      verticalGuides.length = 0; // Clear edge guides if center snaps
      verticalGuides.push({
        position: canvasCenterX,
        orientation: "vertical",
        type: "center",
      });
    }

    // Center Y (always available, even for rotated elements)
    const canvasCenterY = canvasSize.height / 2;
    if (Math.abs(draggedCenterY - canvasCenterY) <= closestHorizontalSnap) {
      horizontalOffset = canvasCenterY - draggedCenterY;
      closestHorizontalSnap = Math.abs(draggedCenterY - canvasCenterY);
      horizontalGuides.length = 0; // Clear edge guides if center snaps
      horizontalGuides.push({
        position: canvasCenterY,
        orientation: "horizontal",
        type: "center",
      });
    }
  }

  // Snap to other elements
  if (snapToElements) {
    for (const element of allElements) {
      // Skip self
      if (element.id === draggedElement.id) continue;

      // Skip hidden elements
      if (element.visible === false) continue;

      // Calculate element bounds (accounting for rotation)
      const elementBounds = getRotatedBounds(
        element.position.x,
        element.position.y,
        element.size.width,
        element.size.height,
        element.rotation
      );

      const elementLeft = elementBounds.left;
      const elementRight = elementBounds.right;
      const elementTop = elementBounds.top;
      const elementBottom = elementBounds.bottom;
      const elementCenterX = elementBounds.centerX;
      const elementCenterY = elementBounds.centerY;

      // Check if target element is rotated
      const isElementRotated =
        Math.abs(element.rotation) > 0.1 && Math.abs(element.rotation - 360) > 0.1;

      // For rotated elements (either dragged or target), only snap centers, not edges
      // NOTE: Edge snapping for rotated elements now enabled - snaps to axis-aligned bounding box
      const shouldSkipEdges = false; // Changed: always show edge guides

      // Vertical snapping (left, right, center)
      if (!shouldSkipEdges) {
        // Left to left
        if (Math.abs(draggedLeft - elementLeft) <= closestVerticalSnap) {
          verticalOffset = elementLeft - draggedLeft;
          closestVerticalSnap = Math.abs(draggedLeft - elementLeft);
          verticalGuides.length = 0;
          verticalGuides.push({ position: elementLeft, orientation: "vertical", type: "edge" });
        }

        // Right to right
        if (Math.abs(draggedRight - elementRight) <= closestVerticalSnap) {
          verticalOffset = elementRight - draggedRight;
          closestVerticalSnap = Math.abs(draggedRight - elementRight);
          verticalGuides.length = 0;
          verticalGuides.push({
            position: elementRight,
            orientation: "vertical",
            type: "edge",
          });
        }

        // Left to right
        if (Math.abs(draggedLeft - elementRight) <= closestVerticalSnap) {
          verticalOffset = elementRight - draggedLeft;
          closestVerticalSnap = Math.abs(draggedLeft - elementRight);
          verticalGuides.length = 0;
          verticalGuides.push({
            position: elementRight,
            orientation: "vertical",
            type: "edge",
          });
        }

        // Right to left
        if (Math.abs(draggedRight - elementLeft) <= closestVerticalSnap) {
          verticalOffset = elementLeft - draggedRight;
          closestVerticalSnap = Math.abs(draggedRight - elementLeft);
          verticalGuides.length = 0;
          verticalGuides.push({ position: elementLeft, orientation: "vertical", type: "edge" });
        }
      }

      // Center to center (always available)
      if (Math.abs(draggedCenterX - elementCenterX) <= closestVerticalSnap) {
        verticalOffset = elementCenterX - draggedCenterX;
        closestVerticalSnap = Math.abs(draggedCenterX - elementCenterX);
        verticalGuides.length = 0;
        verticalGuides.push({
          position: elementCenterX,
          orientation: "vertical",
          type: "center",
        });
      }

      // Horizontal snapping (top, bottom, center)
      if (!shouldSkipEdges) {
        // Top to top
        if (Math.abs(draggedTop - elementTop) <= closestHorizontalSnap) {
          horizontalOffset = elementTop - draggedTop;
          closestHorizontalSnap = Math.abs(draggedTop - elementTop);
          horizontalGuides.length = 0;
          horizontalGuides.push({
            position: elementTop,
            orientation: "horizontal",
            type: "edge",
          });
        }

        // Bottom to bottom
        if (Math.abs(draggedBottom - elementBottom) <= closestHorizontalSnap) {
          horizontalOffset = elementBottom - draggedBottom;
          closestHorizontalSnap = Math.abs(draggedBottom - elementBottom);
          horizontalGuides.length = 0;
          horizontalGuides.push({
            position: elementBottom,
            orientation: "horizontal",
            type: "edge",
          });
        }

        // Top to bottom
        if (Math.abs(draggedTop - elementBottom) <= closestHorizontalSnap) {
          horizontalOffset = elementBottom - draggedTop;
          closestHorizontalSnap = Math.abs(draggedTop - elementBottom);
          horizontalGuides.length = 0;
          horizontalGuides.push({
            position: elementBottom,
            orientation: "horizontal",
            type: "edge",
          });
        }

        // Bottom to top
        if (Math.abs(draggedBottom - elementTop) <= closestHorizontalSnap) {
          horizontalOffset = elementTop - draggedBottom;
          closestHorizontalSnap = Math.abs(draggedBottom - elementTop);
          horizontalGuides.length = 0;
          horizontalGuides.push({
            position: elementTop,
            orientation: "horizontal",
            type: "edge",
          });
        }
      }

      // Center to center (always available)
      if (Math.abs(draggedCenterY - elementCenterY) <= closestHorizontalSnap) {
        horizontalOffset = elementCenterY - draggedCenterY;
        closestHorizontalSnap = Math.abs(draggedCenterY - elementCenterY);
        horizontalGuides.length = 0;
        horizontalGuides.push({
          position: elementCenterY,
          orientation: "horizontal",
          type: "center",
        });
      }
    }
  }

  // Apply offsets to get final snapped position
  snappedX = x + verticalOffset;
  snappedY = y + horizontalOffset;

  return {
    x: snappedX,
    y: snappedY,
    verticalGuides,
    horizontalGuides,
  };
}
