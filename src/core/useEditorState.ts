/**
 * Visual Editor - Core State Management
 *
 * Provides the state management logic for the visual editor using useReducer.
 * This hook encapsulates all state mutations and provides a clean API.
 */

import { useReducer, useCallback, useMemo } from "react";
import {
  EditorState,
  EditorAction,
  EditorElement,
  EditorAPI,
  EditorMode,
  CanvasExport,
} from "../types";

/**
 * Initial state for the editor
 */
const createInitialState = (mode: EditorMode | null): EditorState => ({
  elements: [],
  selectedElementId: null,
  canvasSize: mode?.defaultCanvasSize || { width: 800, height: 600 },
  zoom: 1,
  pan: { x: 0, y: 0 },
  mode,
  history: {
    past: [],
    future: [],
  },
});

/**
 * State reducer for the editor
 */
const editorReducer = (state: EditorState, action: EditorAction): EditorState => {
  switch (action.type) {
    case "ADD_ELEMENT": {
      // Normalize element to ensure it has visible and locked properties
      const normalizedElement = {
        ...action.element,
        visible: action.element.visible ?? true,
        locked: action.element.locked ?? false,
      };
      const newElements = [...state.elements, normalizedElement];
      return {
        ...state,
        elements: newElements,
        selectedElementId: normalizedElement.id,
        history: {
          past: [...state.history.past, state.elements],
          future: [],
        },
      };
    }

    case "UPDATE_ELEMENT": {
      const newElements = state.elements.map((el) =>
        el.id === action.id ? { ...el, ...action.updates } : el
      );
      return {
        ...state,
        elements: newElements,
        history: {
          past: [...state.history.past, state.elements],
          future: [],
        },
      };
    }

    case "REMOVE_ELEMENT": {
      const newElements = state.elements.filter((el) => el.id !== action.id);
      return {
        ...state,
        elements: newElements,
        selectedElementId: state.selectedElementId === action.id ? null : state.selectedElementId,
        history: {
          past: [...state.history.past, state.elements],
          future: [],
        },
      };
    }

    case "SELECT_ELEMENT":
      return {
        ...state,
        selectedElementId: action.id,
      };

    case "SET_ELEMENTS":
      return {
        ...state,
        elements: action.elements,
        history: {
          past: [...state.history.past, state.elements],
          future: [],
        },
      };

    case "LOAD_ELEMENTS":
      // Load elements without recording history (for initial load)
      return {
        ...state,
        elements: action.elements.map((el) => ({
          ...el,
          visible: el.visible ?? true,
          locked: el.locked ?? false,
        })),
      };

    case "REORDER_ELEMENT": {
      const currentIndex = state.elements.findIndex((el) => el.id === action.elementId);
      if (currentIndex === -1 || currentIndex === action.newIndex) return state;

      const newElements = [...state.elements];
      const [element] = newElements.splice(currentIndex, 1);
      newElements.splice(action.newIndex, 0, element);

      // Update z-indices to match array indices
      newElements.forEach((el, index) => {
        el.zIndex = index;
      });

      return {
        ...state,
        elements: newElements,
        history: {
          past: [...state.history.past, state.elements],
          future: [],
        },
      };
    }

    case "SET_CANVAS_SIZE":
      return {
        ...state,
        canvasSize: {
          width: action.width,
          height: action.height,
        },
      };

    case "SET_ZOOM":
      return {
        ...state,
        zoom: action.zoom,
      };

    case "SET_PAN":
      return {
        ...state,
        pan: {
          x: action.x,
          y: action.y,
        },
      };

    case "SET_MODE":
      return {
        ...state,
        mode: action.mode,
        canvasSize: action.mode.defaultCanvasSize,
      };

    case "CLEAR":
      return {
        ...state,
        elements: [],
        selectedElementId: null,
        history: {
          past: [...state.history.past, state.elements],
          future: [],
        },
      };

    case "UNDO": {
      if (state.history.past.length === 0) return state;
      const previous = state.history.past[state.history.past.length - 1];
      const newPast = state.history.past.slice(0, -1);
      return {
        ...state,
        elements: previous,
        history: {
          past: newPast,
          future: [state.elements, ...state.history.future],
        },
      };
    }

    case "REDO": {
      if (state.history.future.length === 0) return state;
      const next = state.history.future[0];
      const newFuture = state.history.future.slice(1);
      return {
        ...state,
        elements: next,
        history: {
          past: [...state.history.past, state.elements],
          future: newFuture,
        },
      };
    }

    default:
      return state;
  }
};

/**
 * Custom hook for managing editor state
 */
export const useEditorState = (initialMode: EditorMode | null = null) => {
  const [state, dispatch] = useReducer(editorReducer, createInitialState(initialMode));

  // ============================================================================
  // API Methods
  // ============================================================================

  const addElement = useCallback((element: EditorElement) => {
    dispatch({ type: "ADD_ELEMENT", element });
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<EditorElement>) => {
    dispatch({ type: "UPDATE_ELEMENT", id, updates });
  }, []);

  const removeElement = useCallback((id: string) => {
    dispatch({ type: "REMOVE_ELEMENT", id });
  }, []);

  const selectElement = useCallback((id: string | null) => {
    dispatch({ type: "SELECT_ELEMENT", id });
  }, []);

  const getSelectedElement = useCallback((): EditorElement | null => {
    if (!state.selectedElementId) return null;
    return state.elements.find((el) => el.id === state.selectedElementId) || null;
  }, [state.selectedElementId, state.elements]);

  const getAllElements = useCallback((): EditorElement[] => {
    return state.elements;
  }, [state.elements]);

  const moveElement = useCallback(
    (id: string, deltaX: number, deltaY: number) => {
      const element = state.elements.find((el) => el.id === id);
      if (!element) return;

      updateElement(id, {
        position: {
          x: element.position.x + deltaX,
          y: element.position.y + deltaY,
        },
      });
    },
    [state.elements, updateElement]
  );

  const rotateElement = useCallback(
    (id: string, angle: number) => {
      updateElement(id, { rotation: angle });
    },
    [updateElement]
  );

  const resizeElement = useCallback(
    (id: string, width: number, height: number) => {
      updateElement(id, {
        size: { width, height },
      });
    },
    [updateElement]
  );

  const updateZIndex = useCallback(
    (id: string, zIndex: number) => {
      updateElement(id, { zIndex });
    },
    [updateElement]
  );

  const reorderElement = useCallback((id: string, newIndex: number) => {
    dispatch({ type: "REORDER_ELEMENT", elementId: id, newIndex });
  }, []);

  const exportJSON = useCallback((): CanvasExport => {
    return {
      width: state.canvasSize.width,
      height: state.canvasSize.height,
      elements: state.elements,
      metadata: {
        version: "1.0.0",
        mode: state.mode?.name,
        created: new Date().toISOString(),
      },
    };
  }, [state.canvasSize, state.elements, state.mode]);

  const importJSON = useCallback((data: CanvasExport) => {
    dispatch({
      type: "SET_CANVAS_SIZE",
      width: data.width,
      height: data.height,
    });
    dispatch({ type: "SET_ELEMENTS", elements: data.elements });
  }, []);

  const clear = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  const setCanvasSize = useCallback((width: number, height: number) => {
    dispatch({ type: "SET_CANVAS_SIZE", width, height });
  }, []);

  const setMode = useCallback((mode: EditorMode) => {
    dispatch({ type: "SET_MODE", mode });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: "UNDO" });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: "REDO" });
  }, []);

  // ============================================================================
  // Copy/Paste/Duplicate Operations
  // ============================================================================

  const copyElement = useCallback(
    (id: string | null = null): EditorElement | null => {
      const elementToCopy = id ? state.elements.find((el) => el.id === id) : getSelectedElement();

      if (!elementToCopy) return null;

      // Return a deep copy for clipboard
      return {
        ...elementToCopy,
        props: { ...elementToCopy.props },
        position: { ...elementToCopy.position },
        size: { ...elementToCopy.size },
      };
    },
    [state.elements, getSelectedElement]
  );

  const duplicateElement = useCallback(
    (id: string | null = null, offset = { x: 20, y: 20 }) => {
      const elementToDuplicate = id
        ? state.elements.find((el) => el.id === id)
        : getSelectedElement();

      if (!elementToDuplicate) return;

      // Import duplicateElement utility
      const { duplicateElement: duplicateUtil } = require("../utils/editorUtils");
      const duplicated = duplicateUtil(elementToDuplicate, offset);

      addElement(duplicated);
    },
    [state.elements, getSelectedElement, addElement]
  );

  const pasteElement = useCallback(
    (copiedElement: EditorElement, offset = { x: 20, y: 20 }) => {
      if (!copiedElement) return;

      // Import utilities
      const { generateElementId } = require("../utils/editorUtils");

      // Create new element with new ID and offset position
      const pasted: EditorElement = {
        ...copiedElement,
        id: generateElementId(),
        props: { ...copiedElement.props },
        position: {
          x: copiedElement.position.x + offset.x,
          y: copiedElement.position.y + offset.y,
        },
        size: { ...copiedElement.size },
        zIndex: Math.max(...state.elements.map((el) => el.zIndex), 0) + 1,
      };

      addElement(pasted);
    },
    [state.elements, addElement]
  );

  // ============================================================================
  // Clear state history
  // ============================================================================

  const clearHistory = useCallback(() => {
    state.history.past = [];
    state.history.future = [];
  }, []);

  // ============================================================================
  // Load elements without history
  // ============================================================================

  const loadElements = useCallback((elements: EditorElement[]) => {
    dispatch({ type: "LOAD_ELEMENTS", elements });
  }, []);

  // ============================================================================
  // Build API Object
  // ============================================================================

  const api: EditorAPI = useMemo(
    () => ({
      addElement,
      updateElement,
      removeElement,
      selectElement,
      getSelectedElement,
      getAllElements,
      moveElement,
      rotateElement,
      resizeElement,
      updateZIndex,
      reorderElement,
      exportJSON,
      importJSON,
      clear,
      copyElement,
      duplicateElement,
      pasteElement,
      clearHistory,
      loadElements,
    }),
    [
      addElement,
      updateElement,
      removeElement,
      selectElement,
      getSelectedElement,
      getAllElements,
      moveElement,
      rotateElement,
      resizeElement,
      updateZIndex,
      reorderElement,
      exportJSON,
      importJSON,
      clear,
      copyElement,
      duplicateElement,
      pasteElement,
      clearHistory,
      loadElements,
    ]
  );

  return {
    state,
    api,
    // Additional helpers
    setCanvasSize,
    setMode,
    undo,
    redo,
    canUndo: state.history.past.length > 0,
    canRedo: state.history.future.length > 0,
  };
};
