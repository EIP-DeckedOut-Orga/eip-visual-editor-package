/**
 * Visual Editor - Utility Functions
 *
 * Common utility functions used throughout the visual editor.
 */

import { EditorElement, CanvasExport } from "../types";
import { v4 as uuidv4 } from "uuid";

/**
 * Generate a unique ID for an element
 */
export const generateElementId = (): string => {
  return `element-${uuidv4()}`;
};

/**
 * Create a new element with default values
 */
export const createElement = <TProps = any>(
  type: string,
  props: TProps,
  options?: {
    position?: { x: number; y: number };
    size?: { width: number; height: number };
    rotation?: number;
    opacity?: number;
    zIndex?: number;
    visible?: boolean;
    locked?: boolean;
    displayName?: string;
  }
): EditorElement<TProps> => {
  return {
    id: generateElementId(),
    type,
    position: options?.position || { x: 0, y: 0 },
    size: options?.size || { width: 100, height: 100 },
    rotation: options?.rotation || 0,
    opacity: options?.opacity ?? 1,
    zIndex: options?.zIndex || 0,
    visible: options?.visible ?? true,
    locked: options?.locked ?? false,
    displayName: options?.displayName,
    props,
  };
};

/**
 * Deep clone an element
 */
export const cloneElement = <TProps = any>(
  element: EditorElement<TProps>
): EditorElement<TProps> => {
  return {
    ...element,
    id: generateElementId(), // New ID for the clone
    props: { ...element.props },
    position: { ...element.position },
    size: { ...element.size },
  };
};

/**
 * Duplicate an element with a slight offset
 */
export const duplicateElement = <TProps = any>(
  element: EditorElement<TProps>,
  offset: { x: number; y: number } = { x: 20, y: 20 }
): EditorElement<TProps> => {
  const cloned = cloneElement(element);
  return {
    ...cloned,
    position: {
      x: element.position.x + offset.x,
      y: element.position.y + offset.y,
    },
    zIndex: element.zIndex + 1, // Place on top
  };
};

/**
 * Sort elements by z-index (ascending)
 */
export const sortByZIndex = (elements: EditorElement[]): EditorElement[] => {
  return [...elements].sort((a, b) => a.zIndex - b.zIndex);
};

/**
 * Get the highest z-index among elements
 */
export const getMaxZIndex = (elements: EditorElement[]): number => {
  if (elements.length === 0) return 0;
  return Math.max(...elements.map((el) => el.zIndex));
};

/**
 * Bring an element to front
 */
export const bringToFront = (elements: EditorElement[], elementId: string): EditorElement[] => {
  const maxZ = getMaxZIndex(elements);
  return elements.map((el) => (el.id === elementId ? { ...el, zIndex: maxZ + 1 } : el));
};

/**
 * Send an element to back
 */
export const sendToBack = (elements: EditorElement[], elementId: string): EditorElement[] => {
  const minZ = Math.min(...elements.map((el) => el.zIndex));
  return elements.map((el) => (el.id === elementId ? { ...el, zIndex: minZ - 1 } : el));
};

/**
 * Check if two rectangles overlap
 */
export const checkOverlap = (
  rect1: { x: number; y: number; width: number; height: number },
  rect2: { x: number; y: number; width: number; height: number }
): boolean => {
  return !(
    rect1.x + rect1.width < rect2.x ||
    rect2.x + rect2.width < rect1.x ||
    rect1.y + rect1.height < rect2.y ||
    rect2.y + rect2.height < rect1.y
  );
};

/**
 * Check if a point is inside a rectangle
 */
export const pointInRect = (
  point: { x: number; y: number },
  rect: { x: number; y: number; width: number; height: number }
): boolean => {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
};

/**
 * Snap a value to grid
 */
export const snapToGrid = (value: number, gridSize: number): number => {
  return Math.round(value / gridSize) * gridSize;
};

/**
 * Snap position to grid
 */
export const snapPositionToGrid = (
  position: { x: number; y: number },
  gridSize: number
): { x: number; y: number } => {
  return {
    x: snapToGrid(position.x, gridSize),
    y: snapToGrid(position.y, gridSize),
  };
};

/**
 * Constrain a value between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Constrain position within canvas bounds
 */
export const constrainToCanvas = (
  position: { x: number; y: number },
  size: { width: number; height: number },
  canvasSize: { width: number; height: number }
): { x: number; y: number } => {
  return {
    x: clamp(position.x, 0, canvasSize.width - size.width),
    y: clamp(position.y, 0, canvasSize.height - size.height),
  };
};

/**
 * Calculate bounding box for rotated rectangle
 */
export const getRotatedBoundingBox = (
  x: number,
  y: number,
  width: number,
  height: number,
  rotation: number
): { x: number; y: number; width: number; height: number } => {
  const rad = (rotation * Math.PI) / 180;
  const cos = Math.abs(Math.cos(rad));
  const sin = Math.abs(Math.sin(rad));

  const newWidth = width * cos + height * sin;
  const newHeight = width * sin + height * cos;

  return {
    x: x - (newWidth - width) / 2,
    y: y - (newHeight - height) / 2,
    width: newWidth,
    height: newHeight,
  };
};

/**
 * Export canvas to JSON string
 */
export const exportToJSON = (data: CanvasExport): string => {
  return JSON.stringify(data, null, 2);
};

/**
 * Import canvas from JSON string
 */
export const importFromJSON = (json: string): CanvasExport => {
  try {
    const data = JSON.parse(json);
    // Validate basic structure
    if (!data.width || !data.height || !Array.isArray(data.elements)) {
      throw new Error("Invalid canvas data structure");
    }

    // Normalize elements to ensure they have visible and locked properties
    const normalizedElements = data.elements.map((element: EditorElement) => ({
      ...element,
      visible: element.visible ?? true,
      locked: element.locked ?? false,
    }));

    return {
      ...data,
      elements: normalizedElements,
    };
  } catch (error) {
    throw new Error(`Failed to parse canvas data: ${(error as Error).message}`);
  }
};

/**
 * Calculate center point of an element
 */
export const getElementCenter = (element: EditorElement): { x: number; y: number } => {
  return {
    x: element.position.x + element.size.width / 2,
    y: element.position.y + element.size.height / 2,
  };
};

/**
 * Calculate distance between two points
 */
export const distance = (p1: { x: number; y: number }, p2: { x: number; y: number }): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Degrees to radians
 */
export const degToRad = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};

/**
 * Radians to degrees
 */
export const radToDeg = (radians: number): number => {
  return (radians * 180) / Math.PI;
};

/**
 * Validate element data
 */
export const isValidElement = (element: any): element is EditorElement => {
  return (
    element &&
    typeof element.id === "string" &&
    typeof element.type === "string" &&
    element.position &&
    typeof element.position.x === "number" &&
    typeof element.position.y === "number" &&
    element.size &&
    typeof element.size.width === "number" &&
    typeof element.size.height === "number" &&
    typeof element.rotation === "number" &&
    typeof element.zIndex === "number" &&
    element.props !== undefined
  );
};

/**
 * Validate canvas export data
 */
export const isValidCanvasExport = (data: any): data is CanvasExport => {
  return (
    data &&
    typeof data.width === "number" &&
    typeof data.height === "number" &&
    Array.isArray(data.elements) &&
    data.elements.every(isValidElement)
  );
};
