/**
 * Tests for ElementRegistry
 */

import { ElementRegistry, globalElementRegistry, useElementRegistry } from '../ElementRegistry';
import { ElementRenderer } from '../../types';
import { renderHook } from '@testing-library/react';

describe('ElementRegistry', () => {
  const mockRenderer1: ElementRenderer = {
    type: 'test1',
    displayName: 'Test 1',
    render: () => null,
    defaultProps: { text: 'Hello' },
  };

  const mockRenderer2: ElementRenderer = {
    type: 'test2',
    displayName: 'Test 2',
    render: () => null,
    defaultProps: { value: 42 },
  };

  let registry: ElementRegistry;

  beforeEach(() => {
    registry = new ElementRegistry();
  });

  describe('register', () => {
    it('should register a renderer', () => {
      registry.register(mockRenderer1);
      expect(registry.has('test1')).toBe(true);
      expect(registry.get('test1')).toEqual(mockRenderer1);
    });

    it('should not register duplicate types', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      registry.register(mockRenderer1);
      registry.register(mockRenderer1);
      
      expect(registry.size).toBe(1);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Element renderer with type "test1" is already registered. Skipping.'
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe('registerMany', () => {
    it('should register multiple renderers', () => {
      registry.registerMany([mockRenderer1, mockRenderer2]);
      
      expect(registry.size).toBe(2);
      expect(registry.has('test1')).toBe(true);
      expect(registry.has('test2')).toBe(true);
    });

    it('should skip duplicates when registering many', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      registry.registerMany([mockRenderer1, mockRenderer1, mockRenderer2]);
      
      expect(registry.size).toBe(2);
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      
      consoleSpy.mockRestore();
    });
  });

  describe('get', () => {
    it('should return renderer for existing type', () => {
      registry.register(mockRenderer1);
      expect(registry.get('test1')).toEqual(mockRenderer1);
    });

    it('should return undefined for non-existing type', () => {
      expect(registry.get('nonexistent')).toBeUndefined();
    });
  });

  describe('has', () => {
    it('should return true for existing type', () => {
      registry.register(mockRenderer1);
      expect(registry.has('test1')).toBe(true);
    });

    it('should return false for non-existing type', () => {
      expect(registry.has('nonexistent')).toBe(false);
    });
  });

  describe('getAll', () => {
    it('should return all registered renderers', () => {
      registry.registerMany([mockRenderer1, mockRenderer2]);
      const all = registry.getAll();
      
      expect(all).toHaveLength(2);
      expect(all).toContainEqual(mockRenderer1);
      expect(all).toContainEqual(mockRenderer2);
    });

    it('should return empty array when no renderers registered', () => {
      expect(registry.getAll()).toEqual([]);
    });
  });

  describe('getMap', () => {
    it('should return the internal map', () => {
      registry.registerMany([mockRenderer1, mockRenderer2]);
      const map = registry.getMap();
      
      expect(map).toBeInstanceOf(Map);
      expect(map.size).toBe(2);
      expect(map.get('test1')).toEqual(mockRenderer1);
    });
  });

  describe('getAllTypes', () => {
    it('should return all registered types', () => {
      registry.registerMany([mockRenderer1, mockRenderer2]);
      const types = registry.getAllTypes();
      
      expect(types).toHaveLength(2);
      expect(types).toContain('test1');
      expect(types).toContain('test2');
    });

    it('should return empty array when no types registered', () => {
      expect(registry.getAllTypes()).toEqual([]);
    });
  });

  describe('unregister', () => {
    it('should remove a registered renderer', () => {
      registry.register(mockRenderer1);
      const result = registry.unregister('test1');
      
      expect(result).toBe(true);
      expect(registry.has('test1')).toBe(false);
      expect(registry.size).toBe(0);
    });

    it('should return false when unregistering non-existing type', () => {
      const result = registry.unregister('nonexistent');
      expect(result).toBe(false);
    });
  });

  describe('clear', () => {
    it('should remove all registered renderers', () => {
      registry.registerMany([mockRenderer1, mockRenderer2]);
      registry.clear();
      
      expect(registry.size).toBe(0);
      expect(registry.getAll()).toEqual([]);
    });
  });

  describe('size', () => {
    it('should return the number of registered renderers', () => {
      expect(registry.size).toBe(0);
      
      registry.register(mockRenderer1);
      expect(registry.size).toBe(1);
      
      registry.register(mockRenderer2);
      expect(registry.size).toBe(2);
    });
  });

  describe('globalElementRegistry', () => {
    it('should be an instance of ElementRegistry', () => {
      expect(globalElementRegistry).toBeInstanceOf(ElementRegistry);
    });

    it('should be a singleton', () => {
      const registry1 = globalElementRegistry;
      const registry2 = globalElementRegistry;
      expect(registry1).toBe(registry2);
    });
  });

  describe('useElementRegistry hook', () => {
    it('should create a registry with initial renderers', () => {
      const { result } = renderHook(() =>
        useElementRegistry([mockRenderer1, mockRenderer2])
      );
      
      expect(result.current).toBeInstanceOf(ElementRegistry);
      expect(result.current.size).toBe(2);
      expect(result.current.has('test1')).toBe(true);
      expect(result.current.has('test2')).toBe(true);
    });

    it('should create empty registry when no initial renderers', () => {
      const { result } = renderHook(() => useElementRegistry());
      
      expect(result.current).toBeInstanceOf(ElementRegistry);
      expect(result.current.size).toBe(0);
    });

    it('should memoize the registry with same initial renderers', () => {
      const renderers = [mockRenderer1];
      const { result, rerender } = renderHook(
        ({ initialRenderers }) => useElementRegistry(initialRenderers),
        { initialProps: { initialRenderers: renderers } }
      );
      
      const firstRegistry = result.current;
      rerender({ initialRenderers: renderers });
      const secondRegistry = result.current;
      
      // Should be the same instance since initialRenderers reference didn't change
      expect(firstRegistry).toBe(secondRegistry);
    });
  });
});
