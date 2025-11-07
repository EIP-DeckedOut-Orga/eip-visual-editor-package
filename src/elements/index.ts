/**
 * Visual Editor - Built-in Elements
 *
 * Exports all built-in element renderers.
 */

export { textElementRenderer, TextElementRenderer } from "./TextElement";
export { imageElementRenderer, ImageElementRenderer } from "./ImageElement";

// Export default element set
import { textElementRenderer } from "./TextElement";
import { imageElementRenderer } from "./ImageElement";

export const defaultElements = [textElementRenderer, imageElementRenderer];
