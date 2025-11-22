/**
 * Visual Editor - Element Registry
 *
 * Manages registration and retrieval of element renderers.
 * This is what makes the editor extensible - new element types
 * can be registered dynamically.
 */

import { ElementRenderer } from "../types";
import { useMemo } from "react";

/**
 * Registry class for managing element renderers
 */
export class ElementRegistry {
  private renderers: Map<string, ElementRenderer> = new Map();

  /**
   * Register a new element renderer
   */
  register(renderer: ElementRenderer): void {
    if (this.renderers.has(renderer.type)) {
      console.warn(
        `Element renderer with type "${renderer.type}" is already registered. Skipping.`
      );
      return;
    }
    this.renderers.set(renderer.type, renderer);
  }

  /**
   * Register multiple element renderers at once
   */
  registerMany(renderers: ElementRenderer[]): void {
    renderers.forEach((renderer) => this.register(renderer));
  }

  /**
   * Get a renderer by type
   */
  get(type: string): ElementRenderer | undefined {
    return this.renderers.get(type);
  }

  /**
   * Check if a renderer exists for a type
   */
  has(type: string): boolean {
    return this.renderers.has(type);
  }

  /**
   * Get all registered renderers
   */
  getAll(): ElementRenderer[] {
    return Array.from(this.renderers.values());
  }

  /**
   * Get the internal renderers map
   */
  getMap(): Map<string, ElementRenderer> {
    return this.renderers;
  }

  /**
   * Get all registered types
   */
  getAllTypes(): string[] {
    return Array.from(this.renderers.keys());
  }

  /**
   * Unregister a renderer
   */
  unregister(type: string): boolean {
    return this.renderers.delete(type);
  }

  /**
   * Clear all registered renderers
   */
  clear(): void {
    this.renderers.clear();
  }

  /**
   * Get the number of registered renderers
   */
  get size(): number {
    return this.renderers.size;
  }
}

/**
 * Create a global singleton registry (can be used across the app)
 */
export const globalElementRegistry = new ElementRegistry();

/**
 * React hook for creating and managing an element registry instance.
 * 
 * The registry is memoized and will only re-initialize if initialRenderers changes.
 * This ensures stable registry instances across re-renders.
 * 
 * @param initialRenderers - Optional array of element renderers to register on initialization
 * @returns ElementRegistry instance with registered renderers
 * 
 * @example
 * ```tsx
 * import { useElementRegistry } from '@/core/ElementRegistry';
 * import { TextElement, ImageElement } from '@/elements';
 * 
 * function MyEditor() {
 *   const registry = useElementRegistry([TextElement, ImageElement]);
 *   
 *   // Use registry to look up renderers
 *   const renderer = registry.get('text');
 *   
 *   return <Canvas registry={registry} />;
 * }
 * ```
 */
export const useElementRegistry = (initialRenderers?: ElementRenderer[]): ElementRegistry => {
  return useMemo(() => {
    const registry = new ElementRegistry();
    if (initialRenderers) {
      registry.registerMany(initialRenderers);
    }
    return registry;
  }, [initialRenderers]);
};
