/**
 * Tests for editorUtils.ts
 */

import {
  generateElementId,
  createElement,
  cloneElement,
  duplicateElement,
  sortByZIndex,
  getMaxZIndex,
  bringToFront,
  sendToBack,
  checkOverlap,
  pointInRect,
  snapToGrid,
  snapPositionToGrid,
  clamp,
  constrainToCanvas,
  getRotatedBoundingBox,
  exportToJSON,
  importFromJSON,
  getElementCenter,
  distance,
  degToRad,
  radToDeg,
  isValidElement,
  isValidCanvasExport,
} from '../editorUtils';
import { EditorElement, CanvasExport } from '../../types';

describe('editorUtils', () => {
  describe('generateElementId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateElementId();
      const id2 = generateElementId();
      
      expect(id1).toMatch(/^element-/);
      expect(id2).toMatch(/^element-/);
      expect(id1).not.toBe(id2);
    });
  });

  describe('createElement', () => {
    it('should create an element with default values', () => {
      const element = createElement('text', { content: 'Hello' });
      
      expect(element.id).toMatch(/^element-/);
      expect(element.type).toBe('text');
      expect(element.props).toEqual({ content: 'Hello' });
      expect(element.position).toEqual({ x: 0, y: 0 });
      expect(element.size).toEqual({ width: 100, height: 100 });
      expect(element.rotation).toBe(0);
      expect(element.opacity).toBe(1);
      expect(element.zIndex).toBe(0);
      expect(element.visible).toBe(true);
      expect(element.locked).toBe(false);
    });

    it('should create an element with custom options', () => {
      const element = createElement('image', { src: 'test.jpg' }, {
        position: { x: 50, y: 100 },
        size: { width: 200, height: 150 },
        rotation: 45,
        opacity: 0.8,
        zIndex: 5,
        visible: false,
        locked: true,
        displayName: 'My Image',
      });
      
      expect(element.position).toEqual({ x: 50, y: 100 });
      expect(element.size).toEqual({ width: 200, height: 150 });
      expect(element.rotation).toBe(45);
      expect(element.opacity).toBe(0.8);
      expect(element.zIndex).toBe(5);
      expect(element.visible).toBe(false);
      expect(element.locked).toBe(true);
      expect(element.displayName).toBe('My Image');
    });
  });

  describe('cloneElement', () => {
    it('should clone an element with a new ID', () => {
      const original = createElement('text', { content: 'Test' });
      const clone = cloneElement(original);
      
      expect(clone.id).not.toBe(original.id);
      expect(clone.type).toBe(original.type);
      expect(clone.props).toEqual(original.props);
      expect(clone.position).toEqual(original.position);
      expect(clone.size).toEqual(original.size);
    });

    it('should create independent copies', () => {
      const original = createElement('text', { content: 'Test' });
      const clone = cloneElement(original);
      
      clone.props.content = 'Modified';
      clone.position.x = 100;
      
      expect(original.props.content).toBe('Test');
      expect(original.position.x).toBe(0);
    });
  });

  describe('duplicateElement', () => {
    it('should duplicate with default offset', () => {
      const original = createElement('text', { content: 'Test' }, {
        position: { x: 10, y: 20 },
        zIndex: 3,
      });
      const duplicate = duplicateElement(original);
      
      expect(duplicate.id).not.toBe(original.id);
      expect(duplicate.position).toEqual({ x: 30, y: 40 }); // +20 offset
      expect(duplicate.zIndex).toBe(4); // +1
    });

    it('should duplicate with custom offset', () => {
      const original = createElement('text', { content: 'Test' }, {
        position: { x: 0, y: 0 },
      });
      const duplicate = duplicateElement(original, { x: 50, y: 75 });
      
      expect(duplicate.position).toEqual({ x: 50, y: 75 });
    });
  });

  describe('sortByZIndex', () => {
    it('should sort elements by zIndex in ascending order', () => {
      const elements: EditorElement[] = [
        createElement('text', {}, { zIndex: 3 }),
        createElement('text', {}, { zIndex: 1 }),
        createElement('text', {}, { zIndex: 2 }),
      ];
      
      const sorted = sortByZIndex(elements);
      
      expect(sorted[0].zIndex).toBe(1);
      expect(sorted[1].zIndex).toBe(2);
      expect(sorted[2].zIndex).toBe(3);
    });

    it('should not mutate original array', () => {
      const elements: EditorElement[] = [
        createElement('text', {}, { zIndex: 3 }),
        createElement('text', {}, { zIndex: 1 }),
      ];
      const original = [...elements];
      
      sortByZIndex(elements);
      
      expect(elements).toEqual(original);
    });
  });

  describe('getMaxZIndex', () => {
    it('should return the highest zIndex', () => {
      const elements: EditorElement[] = [
        createElement('text', {}, { zIndex: 3 }),
        createElement('text', {}, { zIndex: 7 }),
        createElement('text', {}, { zIndex: 1 }),
      ];
      
      expect(getMaxZIndex(elements)).toBe(7);
    });

    it('should return 0 for empty array', () => {
      expect(getMaxZIndex([])).toBe(0);
    });
  });

  describe('bringToFront', () => {
    it('should move element to front', () => {
      const elements: EditorElement[] = [
        createElement('text', {}, { zIndex: 1 }),
        createElement('text', {}, { zIndex: 2 }),
        createElement('text', {}, { zIndex: 3 }),
      ];
      const targetId = elements[0].id;
      
      const result = bringToFront(elements, targetId);
      const target = result.find(el => el.id === targetId);
      
      expect(target?.zIndex).toBe(4); // max + 1
    });
  });

  describe('sendToBack', () => {
    it('should move element to back', () => {
      const elements: EditorElement[] = [
        createElement('text', {}, { zIndex: 1 }),
        createElement('text', {}, { zIndex: 2 }),
        createElement('text', {}, { zIndex: 3 }),
      ];
      const targetId = elements[2].id;
      
      const result = sendToBack(elements, targetId);
      const target = result.find(el => el.id === targetId);
      
      expect(target?.zIndex).toBe(0); // min - 1
    });
  });

  describe('checkOverlap', () => {
    it('should detect overlapping rectangles', () => {
      const rect1 = { x: 0, y: 0, width: 100, height: 100 };
      const rect2 = { x: 50, y: 50, width: 100, height: 100 };
      
      expect(checkOverlap(rect1, rect2)).toBe(true);
    });

    it('should detect non-overlapping rectangles', () => {
      const rect1 = { x: 0, y: 0, width: 50, height: 50 };
      const rect2 = { x: 100, y: 100, width: 50, height: 50 };
      
      expect(checkOverlap(rect1, rect2)).toBe(false);
    });

    it('should detect edge-touching rectangles as overlapping', () => {
      const rect1 = { x: 0, y: 0, width: 50, height: 50 };
      const rect2 = { x: 50, y: 0, width: 50, height: 50 };
      
      // Edge touching IS considered overlapping (uses < not <=)
      expect(checkOverlap(rect1, rect2)).toBe(true);
    });
  });

  describe('pointInRect', () => {
    it('should detect point inside rectangle', () => {
      const point = { x: 25, y: 25 };
      const rect = { x: 0, y: 0, width: 50, height: 50 };
      
      expect(pointInRect(point, rect)).toBe(true);
    });

    it('should detect point outside rectangle', () => {
      const point = { x: 75, y: 75 };
      const rect = { x: 0, y: 0, width: 50, height: 50 };
      
      expect(pointInRect(point, rect)).toBe(false);
    });

    it('should detect point on edge as inside', () => {
      const point = { x: 50, y: 25 };
      const rect = { x: 0, y: 0, width: 50, height: 50 };
      
      expect(pointInRect(point, rect)).toBe(true);
    });
  });

  describe('snapToGrid', () => {
    it('should snap value to grid', () => {
      expect(snapToGrid(17, 10)).toBe(20);
      expect(snapToGrid(12, 10)).toBe(10);
      expect(snapToGrid(25, 10)).toBe(30);
    });

    it('should handle negative values', () => {
      expect(snapToGrid(-17, 10)).toBe(-20);
    });
  });

  describe('snapPositionToGrid', () => {
    it('should snap position to grid', () => {
      const position = { x: 17, y: 23 };
      const snapped = snapPositionToGrid(position, 10);
      
      expect(snapped).toEqual({ x: 20, y: 20 });
    });
  });

  describe('clamp', () => {
    it('should clamp values within range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });
  });

  describe('constrainToCanvas', () => {
    it('should constrain position within canvas bounds', () => {
      const position = { x: 900, y: 700 };
      const size = { width: 100, height: 100 };
      const canvasSize = { width: 800, height: 600 };
      
      const constrained = constrainToCanvas(position, size, canvasSize);
      
      expect(constrained).toEqual({ x: 700, y: 500 }); // Max allowed
    });

    it('should not modify valid positions', () => {
      const position = { x: 100, y: 100 };
      const size = { width: 50, height: 50 };
      const canvasSize = { width: 800, height: 600 };
      
      const constrained = constrainToCanvas(position, size, canvasSize);
      
      expect(constrained).toEqual(position);
    });
  });

  describe('getRotatedBoundingBox', () => {
    it('should calculate bounding box for 90-degree rotation', () => {
      const bbox = getRotatedBoundingBox(0, 0, 100, 50, 90);
      
      expect(bbox.width).toBeCloseTo(50, 1);
      expect(bbox.height).toBeCloseTo(100, 1);
    });

    it('should return same size for 0-degree rotation', () => {
      const bbox = getRotatedBoundingBox(0, 0, 100, 50, 0);
      
      expect(bbox.width).toBeCloseTo(100, 1);
      expect(bbox.height).toBeCloseTo(50, 1);
    });
  });

  describe('exportToJSON and importFromJSON', () => {
    it('should export and import canvas data', () => {
      const data: CanvasExport = {
        width: 800,
        height: 600,
        elements: [createElement('text', { content: 'Test' })],
        metadata: {
          version: '1.0.0',
          created: new Date().toISOString(),
        },
      };
      
      const json = exportToJSON(data);
      const imported = importFromJSON(json);
      
      expect(imported.width).toBe(data.width);
      expect(imported.height).toBe(data.height);
      expect(imported.elements).toHaveLength(1);
      expect(imported.elements[0].type).toBe('text');
    });

    it('should normalize elements on import', () => {
      const json = JSON.stringify({
        width: 800,
        height: 600,
        elements: [
          {
            id: 'test-1',
            type: 'text',
            position: { x: 0, y: 0 },
            size: { width: 100, height: 100 },
            rotation: 0,
            zIndex: 0,
            opacity: 1,
            props: { content: 'Test' },
            // Missing visible and locked
          },
        ],
      });
      
      const imported = importFromJSON(json);
      
      expect(imported.elements[0].visible).toBe(true);
      expect(imported.elements[0].locked).toBe(false);
    });

    it('should throw error for invalid JSON', () => {
      expect(() => importFromJSON('invalid json')).toThrow();
    });

    it('should throw error for invalid structure', () => {
      const invalidJson = JSON.stringify({ invalid: 'data' });
      
      expect(() => importFromJSON(invalidJson)).toThrow('Invalid canvas data structure');
    });
  });

  describe('getElementCenter', () => {
    it('should calculate element center point', () => {
      const element = createElement('text', {}, {
        position: { x: 100, y: 200 },
        size: { width: 50, height: 100 },
      });
      
      const center = getElementCenter(element);
      
      expect(center).toEqual({ x: 125, y: 250 });
    });
  });

  describe('distance', () => {
    it('should calculate distance between two points', () => {
      const p1 = { x: 0, y: 0 };
      const p2 = { x: 3, y: 4 };
      
      expect(distance(p1, p2)).toBe(5); // 3-4-5 triangle
    });

    it('should return 0 for same point', () => {
      const p = { x: 10, y: 20 };
      
      expect(distance(p, p)).toBe(0);
    });
  });

  describe('degToRad and radToDeg', () => {
    it('should convert degrees to radians', () => {
      expect(degToRad(180)).toBeCloseTo(Math.PI, 5);
      expect(degToRad(90)).toBeCloseTo(Math.PI / 2, 5);
      expect(degToRad(0)).toBe(0);
    });

    it('should convert radians to degrees', () => {
      expect(radToDeg(Math.PI)).toBeCloseTo(180, 5);
      expect(radToDeg(Math.PI / 2)).toBeCloseTo(90, 5);
      expect(radToDeg(0)).toBe(0);
    });

    it('should be reversible', () => {
      const degrees = 45;
      const radians = degToRad(degrees);
      const backToDegrees = radToDeg(radians);
      
      expect(backToDegrees).toBeCloseTo(degrees, 5);
    });
  });

  describe('isValidElement', () => {
    it('should validate correct element', () => {
      const element = createElement('text', { content: 'Test' });
      
      expect(isValidElement(element)).toBe(true);
    });

    it('should reject invalid element', () => {
      expect(isValidElement(null as any)).toBeFalsy();
      expect(isValidElement({} as any)).toBe(false);
      expect(isValidElement({ id: 'test' } as any)).toBe(false);
    });
  });

  describe('isValidCanvasExport', () => {
    it('should validate correct canvas export', () => {
      const data: CanvasExport = {
        width: 800,
        height: 600,
        elements: [createElement('text', { content: 'Test' })],
        metadata: {
          version: '1.0.0',
          created: new Date().toISOString(),
        },
      };
      
      expect(isValidCanvasExport(data)).toBe(true);
    });

    it('should reject invalid canvas export', () => {
      expect(isValidCanvasExport(null as any)).toBeFalsy();
      expect(isValidCanvasExport({} as any)).toBe(false);
      expect(isValidCanvasExport({ width: 800 } as any)).toBe(false);
      expect(isValidCanvasExport({ 
        width: 800, 
        height: 600, 
        elements: 'not an array' 
      } as any)).toBe(false);
    });
  });
});
