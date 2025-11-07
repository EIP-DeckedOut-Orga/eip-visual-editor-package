import React, { createContext, useContext, useEffect, useRef, useState } from "react";

// Types for shortcut definitions
export interface ShortcutDefinition {
  key: string;
  description: string;
  action: () => void;
  category?: string;
  enabled?: boolean;
  preventDefault?: boolean;
}

export interface ShortcutGroup {
  [key: string]: ShortcutDefinition;
}

export interface ShortcutManagerContextType {
  registerShortcuts: (shortcuts: ShortcutGroup) => void;
  unregisterShortcuts: (keys: string[]) => void;
  getActiveShortcuts: () => ShortcutGroup;
  isShortcutEnabled: (key: string) => boolean;
  enableShortcut: (key: string) => void;
  disableShortcut: (key: string) => void;
}

// Context for shortcut management
const ShortcutManagerContext = createContext<ShortcutManagerContextType | undefined>(undefined);

// Hook to use shortcut manager
export const useShortcuts = () => {
  const context = useContext(ShortcutManagerContext);
  if (!context) {
    throw new Error("useShortcuts must be used within a ShortcutManager");
  }
  return context;
};

// Utility functions for key handling
const normalizeKey = (key: string): string => {
  return key
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/\+/g, "+")
    .split("+")
    .sort((a, b) => {
      // Order: ctrl, alt, shift, meta, then the actual key
      const order = ["ctrl", "alt", "shift", "meta"];
      const aIndex = order.indexOf(a);
      const bIndex = order.indexOf(b);

      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return a.localeCompare(b);
    })
    .join("+");
};

const getKeyFromEvent = (event: KeyboardEvent): string => {
  const parts: string[] = [];

  if (event.ctrlKey) parts.push("ctrl");
  if (event.altKey) parts.push("alt");
  if (event.shiftKey) parts.push("shift");
  if (event.metaKey) parts.push("meta");

  // Handle special keys
  let key = event.key.toLowerCase();
  if (key === " ") key = "space";
  if (key === "escape") key = "esc";
  if (key === "delete") key = "del";
  if (key === "arrowup") key = "up";
  if (key === "arrowdown") key = "down";
  if (key === "arrowleft") key = "left";
  if (key === "arrowright") key = "right";

  parts.push(key);

  return normalizeKey(parts.join("+"));
};

const isValidShortcut = (key: string): boolean => {
  const normalized = normalizeKey(key);
  // Prevent single modifier keys
  if (["ctrl", "alt", "shift", "meta"].includes(normalized)) {
    return false;
  }
  return true;
};

// Main ShortcutManager component
interface ShortcutManagerProps {
  children: React.ReactNode;
  globalShortcuts?: ShortcutGroup;
  disabled?: boolean;
  onShortcutExecuted?: (key: string, shortcut: ShortcutDefinition) => void;
}

export const ShortcutManager: React.FC<ShortcutManagerProps> = ({
  children,
  globalShortcuts = {},
  disabled = false,
  onShortcutExecuted,
}) => {
  const [activeShortcuts, setActiveShortcuts] = useState<ShortcutGroup>({});
  const shortcutsRef = useRef<ShortcutGroup>({});

  // Initialize with global shortcuts
  useEffect(() => {
    const normalizedGlobal: ShortcutGroup = {};
    Object.entries(globalShortcuts).forEach(([key, shortcut]) => {
      const normalizedKey = normalizeKey(key);
      if (isValidShortcut(normalizedKey)) {
        normalizedGlobal[normalizedKey] = { ...shortcut, enabled: shortcut.enabled ?? true };
      }
    });

    setActiveShortcuts(normalizedGlobal);
    shortcutsRef.current = normalizedGlobal;
  }, [globalShortcuts]);

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (disabled) return;

      // Skip if typing in input fields (unless specifically allowed)
      const target = event.target as Element;
      const isTyping = target.matches('input, textarea, [contenteditable="true"]');

      const eventKey = getKeyFromEvent(event);
      const shortcut = shortcutsRef.current[eventKey];

      if (shortcut && shortcut.enabled !== false) {
        // Allow shortcuts in input fields only if preventDefault is false
        if (isTyping && shortcut.preventDefault !== false) {
          return;
        }

        if (shortcut.preventDefault !== false) {
          event.preventDefault();
          event.stopPropagation();
        }

        try {
          shortcut.action();
          onShortcutExecuted?.(eventKey, shortcut);
        } catch (error) {
          console.error(`Error executing shortcut "${eventKey}":`, error);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [disabled, onShortcutExecuted]);

  // Context methods
  const registerShortcuts = (shortcuts: ShortcutGroup) => {
    const normalized: ShortcutGroup = {};

    Object.entries(shortcuts).forEach(([key, shortcut]) => {
      const normalizedKey = normalizeKey(key);
      if (isValidShortcut(normalizedKey)) {
        normalized[normalizedKey] = { ...shortcut, enabled: shortcut.enabled ?? true };
      } else {
        console.warn(`Invalid shortcut key: "${key}"`);
      }
    });

    setActiveShortcuts((prev) => {
      const updated = { ...prev, ...normalized };
      shortcutsRef.current = updated;
      return updated;
    });
  };

  const unregisterShortcuts = (keys: string[]) => {
    const normalizedKeys = keys.map((key) => normalizeKey(key));

    setActiveShortcuts((prev) => {
      const updated = { ...prev };
      normalizedKeys.forEach((key) => {
        delete updated[key];
      });
      shortcutsRef.current = updated;
      return updated;
    });
  };

  const getActiveShortcuts = () => activeShortcuts;

  const isShortcutEnabled = (key: string): boolean => {
    const normalizedKey = normalizeKey(key);
    return activeShortcuts[normalizedKey]?.enabled !== false;
  };

  const enableShortcut = (key: string) => {
    const normalizedKey = normalizeKey(key);
    setActiveShortcuts((prev) => {
      if (prev[normalizedKey]) {
        const updated = {
          ...prev,
          [normalizedKey]: { ...prev[normalizedKey], enabled: true },
        };
        shortcutsRef.current = updated;
        return updated;
      }
      return prev;
    });
  };

  const disableShortcut = (key: string) => {
    const normalizedKey = normalizeKey(key);
    setActiveShortcuts((prev) => {
      if (prev[normalizedKey]) {
        const updated = {
          ...prev,
          [normalizedKey]: { ...prev[normalizedKey], enabled: false },
        };
        shortcutsRef.current = updated;
        return updated;
      }
      return prev;
    });
  };

  const contextValue: ShortcutManagerContextType = {
    registerShortcuts,
    unregisterShortcuts,
    getActiveShortcuts,
    isShortcutEnabled,
    enableShortcut,
    disableShortcut,
  };

  return (
    <ShortcutManagerContext.Provider value={contextValue}>
      {children}
    </ShortcutManagerContext.Provider>
  );
};

// Hook for easy shortcut registration in components
export const usePageShortcuts = (
  shortcuts: ShortcutGroup,
  dependencies: React.DependencyList = []
) => {
  const { registerShortcuts, unregisterShortcuts } = useShortcuts();

  useEffect(() => {
    const keys = Object.keys(shortcuts);
    registerShortcuts(shortcuts);

    return () => {
      unregisterShortcuts(keys);
    };
  }, dependencies);
};

// Utility functions for external use
export const formatShortcutKey = (key: string): string => {
  return normalizeKey(key)
    .split("+")
    .map((part) => {
      switch (part) {
        case "ctrl":
          return "Ctrl";
        case "alt":
          return "Alt";
        case "shift":
          return "Shift";
        case "meta":
          return "Cmd";
        case "space":
          return "Space";
        case "esc":
          return "Esc";
        case "del":
          return "Delete";
        case "up":
          return "↑";
        case "down":
          return "↓";
        case "left":
          return "←";
        case "right":
          return "→";
        default:
          return part.charAt(0).toUpperCase() + part.slice(1);
      }
    })
    .join(" + ");
};

export const validateShortcutKey = (key: string): boolean => {
  try {
    const normalized = normalizeKey(key);
    return isValidShortcut(normalized);
  } catch {
    return false;
  }
};

export { normalizeKey, getKeyFromEvent, isValidShortcut };
