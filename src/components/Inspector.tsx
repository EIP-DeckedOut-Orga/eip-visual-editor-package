/**
 * Inspector Component
 *
 * Schema-driven property panel for editing selected element properties.
 * Dynamically renders fields based on the element's inspectorSchema.
 */

import React from "react";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Button } from "@/ui/button";
import { Slider } from "@/ui/slider";
import { Separator } from "@/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Textarea } from "@/ui/textarea";
import {
  EditorElement,
  InspectorFieldSchema,
  ElementRenderer,
  EditorAPI,
  EditorMode,
} from "../types";
import { Checkbox } from "@/ui/checkbox";

export interface InspectorProps {
  /** Currently selected element */
  selectedElement: EditorElement | null;

  /** Element renderer for the selected element */
  elementRenderer: ElementRenderer | null;

  /** Editor API for updating elements */
  api: EditorAPI;

  /** Editor mode (for custom placeholder and context) */
  mode?: EditorMode;

  /** Canvas size (passed to placeholder component) */
  canvasSize?: { width: number; height: number };

  /** Function to set canvas size */
  setCanvasSize?: (width: number, height: number) => void;

  /** Optional custom style */
  style?: React.CSSProperties;

  /** Optional className */
  className?: string;
}

/**
 * Inspector component that renders property fields based on element schema
 */
export const Inspector: React.FC<InspectorProps> = ({
  selectedElement,
  elementRenderer,
  api,
  mode,
  canvasSize,
  setCanvasSize,
  style,
  className,
}) => {
  // Local state for input values during editing
  const [editingValues, setEditingValues] = React.useState<Record<string, string>>({});

  // Debounce timer refs for color changes
  const debounceTimers = React.useRef<Record<string, NodeJS.Timeout>>({});

  // Cleanup debounce timers on unmount
  React.useEffect(() => {
    return () => {
      Object.values(debounceTimers.current).forEach((timer) => clearTimeout(timer));
    };
  }, []);

  // No selection or no renderer - show custom placeholder or default empty state
  if (!selectedElement || !elementRenderer) {
    // If mode has custom inspector placeholder, render it
    if (mode?.inspectorPlaceholder) {
      const PlaceholderComponent = mode.inspectorPlaceholder;
      return (
        <div className={`w-full bg-card h-full ${className}`} style={style}>
          <div className="flex h-10 sticky top-0 items-center justify-between px-3 py-2 border-b bg-popover">
            <h3 className="text-sm font-semibold">Inspector</h3>
          </div>
          <PlaceholderComponent
            api={api}
            canvasSize={canvasSize}
            setCanvasSize={setCanvasSize}
            {...(mode.context || {})}
          />
        </div>
      );
    }

    // Default empty state
    return (
      <div className={`w-full bg-card h-full ${className}`} style={style}>
        <div className="flex h-10 items-center justify-between px-3 py-2 border-b bg-popover">
          <h3 className="text-sm font-semibold">Inspector</h3>
        </div>
        <p className="p-4 text-sm text-muted-foreground">
          No element selected. Click on an element to edit its properties.
        </p>
      </div>
    );
  }

  const schema = elementRenderer.inspectorSchema || [];

  // Handler for updating element properties
  const handlePropChange = (propName: string, value: any) => {
    api.updateElement(selectedElement.id, {
      props: {
        ...selectedElement.props,
        [propName]: value,
      },
    });
  };

  // Debounced handler for color changes (300ms delay)
  const handleColorChange = (propName: string, value: string) => {
    // Clear existing timer for this property
    if (debounceTimers.current[propName]) {
      clearTimeout(debounceTimers.current[propName]);
    }

    // Update local state immediately for responsive UI
    setEditingValues((prev) => ({ ...prev, [propName]: value }));

    // Set new timer to update the actual element
    debounceTimers.current[propName] = setTimeout(() => {
      handlePropChange(propName, value);
      // Clear editing state after update
      setEditingValues((prev) => {
        const newState = { ...prev };
        delete newState[propName];
        return newState;
      });
      delete debounceTimers.current[propName];
    }, 300); // 300ms debounce delay
  };

  // Handler for position/size/rotation/opacity changes
  const handleTransformChange = (field: string, value: number) => {
    // Round to 2 decimal places for cleaner values
    const roundedValue = Math.round(value * 100) / 100;

    if (field === "x" || field === "y") {
      api.updateElement(selectedElement.id, {
        position: {
          ...selectedElement.position,
          [field]: roundedValue,
        },
      });
    } else if (field === "width" || field === "height") {
      api.updateElement(selectedElement.id, {
        size: {
          ...selectedElement.size,
          [field]: roundedValue,
        },
      });
    } else if (field === "rotation") {
      // When rotating via input, rotate around the element's center
      // Step 1: Calculate the current visual center (accounting for current rotation)
      const width = selectedElement.size.width;
      const height = selectedElement.size.height;
      const oldRotRad = (selectedElement.rotation * Math.PI) / 180;

      // The visual center with current rotation
      const centerOffsetX = width / 2;
      const centerOffsetY = height / 2;
      const rotatedCenterX =
        selectedElement.position.x +
        centerOffsetX * Math.cos(oldRotRad) -
        centerOffsetY * Math.sin(oldRotRad);
      const rotatedCenterY =
        selectedElement.position.y +
        centerOffsetX * Math.sin(oldRotRad) +
        centerOffsetY * Math.cos(oldRotRad);

      // Step 2: Calculate new position that keeps this center fixed with new rotation
      const newRotRad = (roundedValue * Math.PI) / 180;
      const newX =
        rotatedCenterX -
        (centerOffsetX * Math.cos(newRotRad) - centerOffsetY * Math.sin(newRotRad));
      const newY =
        rotatedCenterY -
        (centerOffsetX * Math.sin(newRotRad) + centerOffsetY * Math.cos(newRotRad));

      api.updateElement(selectedElement.id, {
        position: {
          x: Math.round(newX * 100) / 100,
          y: Math.round(newY * 100) / 100,
        },
        rotation: roundedValue,
      });
    } else if (field === "opacity") {
      // Clamp opacity between 0 and 1
      const clampedValue = Math.max(0, Math.min(1, roundedValue));
      api.updateElement(selectedElement.id, {
        opacity: clampedValue,
      });
    }
  };

  // Get display value for a transform field (with 2 decimal places)
  const getDisplayValue = (field: string): string => {
    // If currently editing, use the editing value
    if (editingValues[field] !== undefined) {
      return editingValues[field];
    }

    // Otherwise, format the actual value to 2 decimals
    let value: number;
    if (field === "x") value = selectedElement.position.x;
    else if (field === "y") value = selectedElement.position.y;
    else if (field === "width") value = selectedElement.size.width;
    else if (field === "height") value = selectedElement.size.height;
    else if (field === "rotation") value = selectedElement.rotation;
    else if (field === "opacity") value = selectedElement.opacity;
    else return "0";

    return value.toFixed(2);
  };

  // Handle input change (while typing)
  const handleInputChange = (field: string, value: string) => {
    setEditingValues((prev) => ({ ...prev, [field]: value }));
  };

  // Handle input blur (when user finishes editing)
  const handleInputBlur = (field: string) => {
    const value = editingValues[field];
    if (value !== undefined) {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        handleTransformChange(field, numValue);
      }
      // Clear editing state
      setEditingValues((prev) => {
        const newState = { ...prev };
        delete newState[field];
        return newState;
      });
    }
  };

  return (
    <div className={`h-full bg-card overflow-y-auto ${className}`} style={style}>
      {/* Header */}
      <div className="flex h-10 sticky top-0 items-center justify-between px-3 py-2 border-b bg-popover">
        <h3 className="text-sm font-semibold">Inspector</h3>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">
          {elementRenderer.displayName || selectedElement.type}
        </h3>

        <p className="text-xs text-muted-foreground mb-4">ID: {selectedElement.id}</p>

        <Separator className="my-4" />

        {/* Display Name (always visible) */}
        <div className="mb-4">
          <Label htmlFor="display-name" className="text-xs">
            Display Name
          </Label>
          <Input
            id="display-name"
            type="text"
            value={selectedElement.displayName || ""}
            onChange={(e) => {
              api.updateElement(selectedElement.id, {
                displayName: e.target.value,
              });
            }}
            placeholder={elementRenderer.displayName || selectedElement.type}
            className="h-8 mt-1"
          />
        </div>

        <Separator className="my-4" />

        {/* Transform Properties (always visible) */}
        <h4 className="text-sm font-medium mb-3">Transform</h4>

        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <div className="flex flex-col gap-2 items-start">
              <Label htmlFor="x-position" className="text-xs">
                X
              </Label>
              <Input
                id="x-position"
                type="number"
                step={0.5}
                value={getDisplayValue("x")}
                onChange={(e) => handleInputChange("x", e.target.value)}
                onBlur={() => handleInputBlur("x")}
                className="h-8"
              />
            </div>
            <div className="flex flex-col gap-2 items-start">
              <Label htmlFor="y-position" className="text-xs">
                Y
              </Label>
              <Input
                id="y-position"
                type="number"
                step={0.5}
                value={getDisplayValue("y")}
                onChange={(e) => handleInputChange("y", e.target.value)}
                onBlur={() => handleInputBlur("y")}
                className="h-8"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex flex-col gap-2 items-start">
              <Label htmlFor="width" className="text-xs">
                Width
              </Label>
              <Input
                id="width"
                type="number"
                step={0.5}
                value={getDisplayValue("width")}
                onChange={(e) => handleInputChange("width", e.target.value)}
                onBlur={() => handleInputBlur("width")}
                className="h-8"
              />
            </div>
            <div className="flex h-8 gap-2">
              <div className="flex flex-col gap-2 items-start">
                <Label htmlFor="height" className="text-xs">
                  Height
                </Label>
                <Input
                  id="height"
                  type="number"
                  step={0.5}
                  value={getDisplayValue("height")}
                  onChange={(e) => handleInputChange("height", e.target.value)}
                  onBlur={() => handleInputBlur("height")}
                  className="h-8"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex flex-col gap-2 items-start flex-1">
              <Label htmlFor="rotation" className="text-xs">
                Rotation
              </Label>
              <Input
                id="rotation"
                type="number"
                step={1}
                value={getDisplayValue("rotation")}
                onChange={(e) => handleInputChange("rotation", e.target.value)}
                onBlur={() => handleInputBlur("rotation")}
                className="h-8 flex-1"
              />
            </div>
            <div className="flex flex-col gap-2 items-start flex-1">
              <Label htmlFor="opacity" className="text-xs">
                Opacity
              </Label>
              <Input
                id="opacity"
                type="number"
                step={0.01}
                min={0}
                max={1}
                value={getDisplayValue("opacity")}
                onChange={(e) => handleInputChange("opacity", e.target.value)}
                onBlur={() => handleInputBlur("opacity")}
                className="h-8 flex-1"
              />
            </div>
          </div>

          <Separator className="my-4" />

          {/* Element-specific Properties */}
          {schema.length > 0 && (
            <>
              <h4 className="text-sm font-medium mb-3">Properties</h4>
              <div className="space-y-3">
                {schema.map((field) =>
                  renderField(
                    field,
                    selectedElement.props,
                    editingValues,
                    handlePropChange,
                    handleColorChange,
                    mode
                  )
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Render a single inspector field based on its type
 */
export function renderField(
  field: InspectorFieldSchema,
  props: any,
  editingValues: Record<string, string>,
  onChange: (name: string, value: any) => void,
  onColorChange: (name: string, value: string) => void,
  mode?: EditorMode
): React.ReactNode {
  // Use editing value if available, otherwise use actual prop value
  const value = editingValues[field.name] ?? props[field.name] ?? field.defaultValue;

  switch (field.type) {
    case "custom":
      // Custom renderer support
      if (!field.customRenderer) {
        console.error(`Custom field "${field.name}" has no customRenderer defined`);
        return null;
      }

      const CustomComponent = field.customRenderer;
      return (
        <div key={field.name}>
          <CustomComponent
            value={value}
            onChange={(newValue) => onChange(field.name, newValue)}
            field={field}
            elementProps={props}
            mode={mode}
          />
        </div>
      );

    case "string":
      const isMultiline = field.name === "content" || field.name === "text";
      return (
        <div key={field.name}>
          <Label htmlFor={field.name} className="text-xs">
            {field.label}
          </Label>
          {isMultiline ? (
            <Textarea
              id={field.name}
              value={value || ""}
              onChange={(e) => onChange(field.name, e.target.value)}
              className="mt-1"
              rows={3}
            />
          ) : (
            <Input
              id={field.name}
              value={value || ""}
              onChange={(e) => onChange(field.name, e.target.value)}
              className="h-8 mt-1"
            />
          )}
          {field.description && (
            <p className="text-xs text-muted-foreground mt-1">{field.description}</p>
          )}
        </div>
      );

    case "number":
      return (
        <div key={field.name}>
          <Label htmlFor={field.name} className="text-xs">
            {field.label}
          </Label>
          <Input
            id={field.name}
            type="number"
            value={value ?? 0}
            onChange={(e) => onChange(field.name, parseFloat(Number(e.target.value).toFixed(2)))}
            min={field.min}
            max={field.max}
            step={field.step || 1}
            className="h-8 mt-1"
          />
          {field.description && (
            <p className="text-xs text-muted-foreground mt-1">{field.description}</p>
          )}
        </div>
      );

    case "color":
      return (
        <div key={field.name}>
          <Label htmlFor={field.name} className="text-xs">
            {field.label}
          </Label>
          <Input
            id={field.name}
            type="color"
            value={value || "#000000"}
            onChange={(e) => onColorChange(field.name, e.target.value)}
            className="h-10 mt-1"
          />
          {field.description && (
            <p className="text-xs text-muted-foreground mt-1">{field.description}</p>
          )}
        </div>
      );

    case "select":
      return (
        <div key={field.name}>
          <Label htmlFor={field.name} className="text-xs">
            {field.label}
          </Label>
          <Select
            value={value || field.defaultValue || ""}
            onValueChange={(newValue) => onChange(field.name, newValue)}
          >
            <SelectTrigger className="h-8 mt-1">
              <SelectValue placeholder={field.label} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {field.description && (
            <p className="text-xs text-muted-foreground mt-1">{field.description}</p>
          )}
        </div>
      );

    case "boolean":
      return (
        <div key={field.name} className="flex items-start space-x-2">
          <Checkbox
            id={field.name}
            checked={Boolean(value) as boolean}
            onCheckedChange={(checked) => onChange(field.name, checked)}
            className="mt-1"
          />
          <div>
            <Label htmlFor={field.name} className="text-xs font-medium cursor-pointer">
              {field.label}
            </Label>
            {field.description && (
              <p className="text-xs text-muted-foreground">{field.description}</p>
            )}
          </div>
        </div>
      );

    case "slider":
      return (
        <div key={field.name}>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs">{field.label}</Label>
            <span className="text-xs text-muted-foreground">{value}</span>
          </div>
          <Slider
            value={[Number(value ?? field.defaultValue ?? 0)]}
            onValueChange={([newValue]) => onChange(field.name, newValue)}
            min={field.min || 0}
            max={field.max || 100}
            step={field.step || 1}
            className="mt-1"
          />
          {field.description && (
            <p className="text-xs text-muted-foreground mt-1">{field.description}</p>
          )}
        </div>
      );

    case "image":
      return (
        <div key={field.name}>
          <Label htmlFor={field.name} className="text-xs">
            {field.label}
          </Label>
          <Input
            id={field.name}
            value={value || ""}
            onChange={(e) => onChange(field.name, e.target.value)}
            className="h-8 mt-1"
            placeholder="Image URL or path"
          />
          {field.description && (
            <p className="text-xs text-muted-foreground mt-1">{field.description}</p>
          )}
        </div>
      );

    default:
      return null;
  }
}

export default Inspector;
