/**
 * Tests for snapping.ts
 */

import { getSnappingPosition, SnapOptions } from '../snapping';
import { EditorElement } from '../../types';
import { createElement } from '../editorUtils';

describe('snapping utilities', () => {
  describe('getSnappingPosition', () => {
    const canvasSize = { width: 800, height: 600 };

    it('should snap to canvas left edge', () => {
      const element = createElement('text', {}, {
        position: { x: 3, y: 100 },
        size: { width: 100, height: 50 },
      });

      const result = getSnappingPosition(element, 3, 100, [], {
        snapToCanvas: true,
        canvasSize,
      });

      expect(result.x).toBe(0);
      expect(result.y).toBe(100);
      expect(result.verticalGuides).toHaveLength(1);
      expect(result.verticalGuides[0].position).toBe(0);
    });

    it('should snap to canvas right edge', () => {
      const element = createElement('text', {}, {
        position: { x: 697, y: 100 },
        size: { width: 100, height: 50 },
      });

      const result = getSnappingPosition(element, 697, 100, [], {
        snapToCanvas: true,
        canvasSize,
      });

      expect(result.x).toBe(700); // 800 - 100
      expect(result.y).toBe(100);
      expect(result.verticalGuides).toHaveLength(1);
      expect(result.verticalGuides[0].position).toBe(800);
    });

    it('should snap to canvas top edge', () => {
      const element = createElement('text', {}, {
        position: { x: 100, y: 2 },
        size: { width: 100, height: 50 },
      });

      const result = getSnappingPosition(element, 100, 2, [], {
        snapToCanvas: true,
        canvasSize,
      });

      expect(result.x).toBe(100);
      expect(result.y).toBe(0);
      expect(result.horizontalGuides).toHaveLength(1);
      expect(result.horizontalGuides[0].position).toBe(0);
    });

    it('should snap to canvas bottom edge', () => {
      const element = createElement('text', {}, {
        position: { x: 100, y: 548 },
        size: { width: 100, height: 50 },
      });

      const result = getSnappingPosition(element, 100, 548, [], {
        snapToCanvas: true,
        canvasSize,
      });

      expect(result.x).toBe(100);
      expect(result.y).toBe(550); // 600 - 50
      expect(result.horizontalGuides).toHaveLength(1);
      expect(result.horizontalGuides[0].position).toBe(600);
    });

    it('should snap to canvas center horizontally', () => {
      const element = createElement('text', {}, {
        position: { x: 347, y: 100 },
        size: { width: 100, height: 50 },
      });

      // Center X should be at 400 (canvas width / 2)
      const result = getSnappingPosition(element, 347, 100, [], {
        snapToCanvas: true,
        canvasSize,
      });

      // Element center at 347 + 50 = 397, should snap to 400
      expect(result.x).toBe(350); // 400 - 50
      expect(result.verticalGuides).toHaveLength(1);
      expect(result.verticalGuides[0].type).toBe('center');
    });

    it('should snap to canvas center vertically', () => {
      const element = createElement('text', {}, {
        position: { x: 100, y: 273 },
        size: { width: 100, height: 50 },
      });

      // Center Y should be at 300 (canvas height / 2)
      const result = getSnappingPosition(element, 100, 273, [], {
        snapToCanvas: true,
        canvasSize,
      });

      // Element center at 273 + 25 = 298, should snap to 300
      expect(result.y).toBe(275); // 300 - 25
      expect(result.horizontalGuides).toHaveLength(1);
      expect(result.horizontalGuides[0].type).toBe('center');
    });

    it('should snap to another element left edge', () => {
      const draggedElement = createElement('text', {}, {
        position: { x: 103, y: 100 },
        size: { width: 100, height: 50 },
      });

      const targetElement = createElement('image', {}, {
        position: { x: 100, y: 200 },
        size: { width: 150, height: 75 },
      });

      const result = getSnappingPosition(draggedElement, 103, 100, [targetElement], {
        snapToElements: true,
      });

      expect(result.x).toBe(100);
      expect(result.verticalGuides).toHaveLength(1);
      expect(result.verticalGuides[0].position).toBe(100);
    });

    it('should snap to another element right edge', () => {
      const draggedElement = createElement('text', {}, {
        position: { x: 147, y: 100 },
        size: { width: 100, height: 50 },
      });

      const targetElement = createElement('image', {}, {
        position: { x: 100, y: 200 },
        size: { width: 150, height: 75 },
      });

      const result = getSnappingPosition(draggedElement, 147, 100, [targetElement], {
        snapToElements: true,
      });

      expect(result.x).toBe(150); // Align right edge to 250
      expect(result.verticalGuides).toHaveLength(1);
      expect(result.verticalGuides[0].position).toBe(250);
    });

    it('should snap to another element center', () => {
      const draggedElement = createElement('text', {}, {
        position: { x: 122, y: 100 },
        size: { width: 100, height: 50 },
      });

      const targetElement = createElement('image', {}, {
        position: { x: 100, y: 200 },
        size: { width: 150, height: 75 },
      });

      // Target center X: 100 + 75 = 175
      // Dragged center X: 122 + 50 = 172 (within threshold)
      const result = getSnappingPosition(draggedElement, 122, 100, [targetElement], {
        snapToElements: true,
      });

      expect(result.x).toBe(125); // 175 - 50
      expect(result.verticalGuides).toHaveLength(1);
      expect(result.verticalGuides[0].type).toBe('center');
    });

    it('should not snap if beyond threshold', () => {
      const element = createElement('text', {}, {
        position: { x: 50, y: 100 },
        size: { width: 100, height: 50 },
      });

      const result = getSnappingPosition(element, 50, 100, [], {
        snapToCanvas: true,
        canvasSize,
        threshold: 5,
      });

      // Position should not change (too far from edges)
      expect(result.x).toBe(50);
      expect(result.y).toBe(100);
      expect(result.verticalGuides).toHaveLength(0);
      expect(result.horizontalGuides).toHaveLength(0);
    });

    it('should skip hidden elements', () => {
      const draggedElement = createElement('text', {}, {
        position: { x: 103, y: 100 },
        size: { width: 100, height: 50 },
      });

      const targetElement = createElement('image', {}, {
        position: { x: 100, y: 200 },
        size: { width: 150, height: 75 },
        visible: false,
      });

      const result = getSnappingPosition(draggedElement, 103, 100, [targetElement], {
        snapToElements: true,
      });

      // Should not snap to hidden element
      expect(result.x).toBe(103);
      expect(result.verticalGuides).toHaveLength(0);
    });

    it('should skip self when snapping', () => {
      const element = createElement('text', {}, {
        position: { x: 100, y: 100 },
        size: { width: 100, height: 50 },
      });

      const result = getSnappingPosition(element, 105, 105, [element], {
        snapToElements: true,
      });

      // Should not snap to self
      expect(result.x).toBe(105);
      expect(result.y).toBe(105);
    });

    it('should handle custom threshold', () => {
      const element = createElement('text', {}, {
        position: { x: 8, y: 100 },
        size: { width: 100, height: 50 },
      });

      // With threshold of 10, should snap
      const resultWithSnap = getSnappingPosition(element, 8, 100, [], {
        snapToCanvas: true,
        canvasSize,
        threshold: 10,
      });

      expect(resultWithSnap.x).toBe(0);

      // With threshold of 5, should not snap
      const resultNoSnap = getSnappingPosition(element, 8, 100, [], {
        snapToCanvas: true,
        canvasSize,
        threshold: 5,
      });

      expect(resultNoSnap.x).toBe(8);
    });

    it('should disable canvas snapping when option is false', () => {
      const element = createElement('text', {}, {
        position: { x: 3, y: 2 },
        size: { width: 100, height: 50 },
      });

      const result = getSnappingPosition(element, 3, 2, [], {
        snapToCanvas: false,
        canvasSize,
      });

      expect(result.x).toBe(3);
      expect(result.y).toBe(2);
      expect(result.verticalGuides).toHaveLength(0);
      expect(result.horizontalGuides).toHaveLength(0);
    });

    it('should disable element snapping when option is false', () => {
      const draggedElement = createElement('text', {}, {
        position: { x: 103, y: 100 },
        size: { width: 100, height: 50 },
      });

      const targetElement = createElement('image', {}, {
        position: { x: 100, y: 200 },
        size: { width: 150, height: 75 },
      });

      const result = getSnappingPosition(draggedElement, 103, 100, [targetElement], {
        snapToElements: false,
      });

      expect(result.x).toBe(103);
      expect(result.verticalGuides).toHaveLength(0);
    });

    it('should prioritize closer snap targets', () => {
      const draggedElement = createElement('text', {}, {
        position: { x: 102, y: 100 },
        size: { width: 100, height: 50 },
      });

      const targetElement1 = createElement('image', {}, {
        position: { x: 100, y: 200 },
        size: { width: 150, height: 75 },
      });

      const targetElement2 = createElement('image', {}, {
        position: { x: 95, y: 300 },
        size: { width: 150, height: 75 },
      });

      const result = getSnappingPosition(
        draggedElement, 
        102, 
        100, 
        [targetElement1, targetElement2],
        { snapToElements: true }
      );

      // Should snap to closer target (100, distance = 2)
      expect(result.x).toBe(100);
    });

    it('should handle rotated elements when snapping', () => {
      const draggedElement = createElement('text', {}, {
        position: { x: 100, y: 100 },
        size: { width: 100, height: 50 },
        rotation: 45,
      });

      const result = getSnappingPosition(draggedElement, 100, 100, [], {
        snapToCanvas: true,
        canvasSize,
      });

      // Should calculate rotated bounds
      expect(result.x).toBeDefined();
      expect(result.y).toBeDefined();
    });

    it('should snap to top edge of other element', () => {
      const draggedElement = createElement('text', {}, {
        position: { x: 100, y: 98 },
        size: { width: 100, height: 50 },
      });

      const targetElement = createElement('image', {}, {
        position: { x: 100, y: 150 },
        size: { width: 150, height: 75 },
      });

      const result = getSnappingPosition(draggedElement, 100, 98, [targetElement], {
        snapToElements: true,
      });

      // Dragged bottom (98 + 50 = 148) should snap to target top (150)
      expect(result.y).toBe(100); // 150 - 50
    });

    it('should snap to vertical center alignment', () => {
      const draggedElement = createElement('text', {}, {
        position: { x: 100, y: 173 },
        size: { width: 100, height: 50 },
      });

      const targetElement = createElement('image', {}, {
        position: { x: 200, y: 150 },
        size: { width: 150, height: 100 },
      });

      // Target center Y: 150 + 50 = 200
      // Dragged center Y: 173 + 25 = 198 (within threshold)
      const result = getSnappingPosition(draggedElement, 100, 173, [targetElement], {
        snapToElements: true,
      });

      expect(result.y).toBe(175); // 200 - 25
    });

    it('should handle elements with no rotation', () => {
      const draggedElement = createElement('text', {}, {
        position: { x: 100, y: 100 },
        size: { width: 100, height: 50 },
        rotation: 0,
      });

      const result = getSnappingPosition(draggedElement, 100, 100, [], {
        snapToCanvas: true,
        canvasSize,
      });

      expect(result.x).toBe(100);
      expect(result.y).toBe(100);
    });

    it('should handle elements with 360 degree rotation', () => {
      const draggedElement = createElement('text', {}, {
        position: { x: 100, y: 100 },
        size: { width: 100, height: 50 },
        rotation: 360,
      });

      const result = getSnappingPosition(draggedElement, 100, 100, [], {
        snapToCanvas: true,
        canvasSize,
      });

      expect(result.x).toBe(100);
      expect(result.y).toBe(100);
    });

    it('should snap rotated element to canvas center', () => {
      const draggedElement = createElement('text', {}, {
        position: { x: 348, y: 273 },
        size: { width: 100, height: 50 },
        rotation: 45,
      });

      // Position close enough to trigger center snapping
      const result = getSnappingPosition(draggedElement, 348, 273, [], {
        snapToCanvas: true,
        canvasSize,
        threshold: 30, // Increase threshold to ensure snap
      });

      // Should still snap center even when rotated
      expect(result.verticalGuides.length + result.horizontalGuides.length).toBeGreaterThan(0);
    });

    it('should handle left-to-right element snapping', () => {
      const draggedElement = createElement('text', {}, {
        position: { x: 248, y: 100 },
        size: { width: 100, height: 50 },
      });

      const targetElement = createElement('image', {}, {
        position: { x: 100, y: 100 },
        size: { width: 150, height: 75 },
      });

      // Dragged left (248) should snap to target right (250)
      const result = getSnappingPosition(draggedElement, 248, 100, [targetElement], {
        snapToElements: true,
      });

      expect(result.x).toBe(250);
    });

    it('should handle right-to-left element snapping', () => {
      const draggedElement = createElement('text', {}, {
        position: { x: 2, y: 100 },
        size: { width: 100, height: 50 },
      });

      const targetElement = createElement('image', {}, {
        position: { x: 150, y: 100 },
        size: { width: 150, height: 75 },
      });

      // Dragged right (102) should snap to target left (150)
      const result = getSnappingPosition(draggedElement, 2, 100, [targetElement], {
        snapToElements: true,
        threshold: 50,
      });

      expect(result.x).toBe(50); // 150 - 100
    });

    it('should handle bottom-to-top element snapping', () => {
      const draggedElement = createElement('text', {}, {
        position: { x: 100, y: 2 },
        size: { width: 100, height: 50 },
      });

      const targetElement = createElement('image', {}, {
        position: { x: 100, y: 100 },
        size: { width: 150, height: 75 },
      });

      // Dragged bottom (52) should snap to target top (100)
      const result = getSnappingPosition(draggedElement, 100, 2, [targetElement], {
        snapToElements: true,
        threshold: 50,
      });

      expect(result.y).toBe(50); // 100 - 50
    });

    it('should handle bottom-to-bottom element snapping', () => {
      const draggedElement = createElement('text', {}, {
        position: { x: 100, y: 123 },
        size: { width: 100, height: 50 },
      });

      const targetElement = createElement('image', {}, {
        position: { x: 100, y: 100 },
        size: { width: 150, height: 75 },
      });

      // Dragged bottom (173) should snap to target bottom (175)
      const result = getSnappingPosition(draggedElement, 100, 123, [targetElement], {
        snapToElements: true,
      });

      expect(result.y).toBe(125); // 175 - 50
    });
  });
});
