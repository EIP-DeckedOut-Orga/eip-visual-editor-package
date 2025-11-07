/**
 * Canvas Component
 *
 * Renders the main canvas with elements, background, and snap guides.
 * Handles element rendering and stage interactions.
 */

import React, { useCallback, useRef, useState } from "react";
import { Stage, Layer, Rect, Image as KonvaImage } from "react-konva";
import { SnapGuides } from "./SnapGuides";
import { CentralizedTransformer } from "./CentralizedTransformer";
import { EditorElement, EditorMode, ElementRenderer } from "../types";
import { SnapGuide, getSnappingPosition } from "../utils/snapping";
import { ElementRegistry } from "../core/ElementRegistry";

export interface CanvasProps {
  /** Canvas size */
  canvasSize: { width: number; height: number };

  /** All elements to render */
  elements: EditorElement[];

  /** Currently selected element ID */
  selectedElementId: string | null;

  /** Element registry for looking up renderers */
  registry: ElementRegistry;

  /** Editor mode configuration */
  mode?: EditorMode;

  /** Whether the editor is in readonly mode */
  readonly?: boolean;

  /** Whether to enable snap guides */
  enableSnapGuides?: boolean;

  /** Whether to enable pan and zoom controls */
  enablePanZoom?: boolean;

  /** Optional background image URL - replaces solid background color when provided */
  backgroundImageUrl?: string;

  /** Whether to hide all elements on the canvas */
  hideElements?: boolean;

  /** Callback when an element is selected */
  onSelectElement: (id: string | null) => void;

  /** Callback when an element is transformed */
  onTransformElement: (id: string, updates: Partial<EditorElement>) => void;

  /** Optional custom style */
  style?: React.CSSProperties;

  /** Optional className */
  className?: string;
}

/**
 * Canvas component - renders the Konva stage with all elements
 */
export const Canvas: React.FC<CanvasProps> = ({
  canvasSize,
  elements,
  selectedElementId,
  registry,
  mode,
  readonly = false,
  enableSnapGuides = true,
  enablePanZoom = true,
  backgroundImageUrl,
  hideElements = false,
  onSelectElement,
  onTransformElement,
  style,
  className = "",
}) => {
  const stageRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [snapGuides, setSnapGuides] = useState<{
    vertical: SnapGuide[];
    horizontal: SnapGuide[];
  }>({ vertical: [], horizontal: [] });

  // Pan and zoom state
  const [stageScale, setStageScale] = useState(1);
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });
  const isPanning = useRef(false);

  // Container size for dynamic stage sizing
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });

  // Background image state
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);

  // Transformer update trigger - incremented when we need to force transformer re-attachment
  const [transformerUpdateTrigger, setTransformerUpdateTrigger] = useState(0);

  // Load background image when URL changes
  React.useEffect(() => {
    if (!backgroundImageUrl) {
      setBackgroundImage(null);
      return;
    }

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setBackgroundImage(img);
    };
    img.onerror = (err) => {
      console.error("Failed to load canvas background image:", err);
      setBackgroundImage(null);
    };
    img.src = backgroundImageUrl;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [backgroundImageUrl]);

  // Update container size on mount and resize
  React.useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({
          width: rect.width,
          height: rect.height,
        });
      }
    };

    updateSize();

    // Add resize observer to track container size changes
    const resizeObserver = new ResizeObserver(updateSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Calculate dynamic stage size that fits the container while showing the full canvas
  const stageSize = React.useMemo(() => {
    // Use container size, ensuring stage is at least as large as the container
    const width = Math.max(containerSize.width, canvasSize.width);
    const height = Math.max(containerSize.height, canvasSize.height);

    return { width, height };
  }, [containerSize, canvasSize]);

  // Calculate layer offset to center the canvas in the stage
  const layerOffset = React.useMemo(() => {
    return {
      x: Math.max(0, (stageSize.width - canvasSize.width) / 2),
      y: Math.max(0, (stageSize.height - canvasSize.height) / 2),
    };
  }, [stageSize, canvasSize]);

  // Handle click on canvas background (deselect)
  const handleStageClick = useCallback(
    (e: any) => {
      // Clicked on stage - deselect
      if (e.target === e.target.getStage()) {
        onSelectElement(null);
      }
    },
    [onSelectElement]
  );

  const onClearSnapGuides = useCallback(() => {
    setSnapGuides({ vertical: [], horizontal: [] });
  }, []);

  // Callback to force transformer re-attachment (e.g., when images load)
  const onTransformerUpdate = useCallback(() => {
    setTransformerUpdateTrigger((prev) => prev + 1);
  }, []);

  // Handle zoom (mouse wheel)
  const handleWheel = useCallback(
    (e: any) => {
      if (!enablePanZoom) return;

      e.evt.preventDefault();

      const stage = stageRef.current;
      if (!stage) return;

      const oldScale = stage.scaleX();
      const pointer = stage.getPointerPosition();

      // Calculate mouse position relative to stage
      const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      };

      // Zoom factor
      const scaleBy = 1.05;
      const direction = e.evt.deltaY > 0 ? -1 : 1;

      // Calculate new scale with limits
      let newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
      newScale = Math.max(0.1, Math.min(5, newScale)); // Limit zoom between 0.1x and 5x

      // Calculate new position to zoom towards mouse
      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };

      setStageScale(newScale);
      setStagePosition(newPos);
    },
    [enablePanZoom]
  );

  // Handle pan start (middle mouse button or space + drag)
  const handleMouseDown = useCallback(
    (e: any) => {
      if (!enablePanZoom) return;

      // Middle mouse button or space + left click
      if (e.evt.button === 1 || (e.evt.button === 0 && e.evt.shiftKey)) {
        e.evt.preventDefault();
        isPanning.current = true;
      }
    },
    [enablePanZoom]
  );

  // Handle pan move
  const handleMouseMove = useCallback(
    (e: any) => {
      if (!enablePanZoom || !isPanning.current) return;

      e.evt.preventDefault();

      const stage = stageRef.current;
      if (!stage) return;

      const newPos = {
        x: stagePosition.x + e.evt.movementX,
        y: stagePosition.y + e.evt.movementY,
      };

      setStagePosition(newPos);
    },
    [enablePanZoom, stagePosition]
  );

  // Handle pan end
  const handleMouseUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  // Update stage transform
  React.useEffect(() => {
    const stage = stageRef.current;
    if (stage) {
      stage.scale({ x: stageScale, y: stageScale });
      stage.position(stagePosition);
      stage.batchDraw();
    }
  }, [stageScale, stagePosition]);

  // Render element using registry
  const renderElement = useCallback(
    (element: EditorElement) => {
      const isSelected = selectedElementId === element.id;

      // Get the renderer from registry
      const renderer = registry.get(element.type);
      if (!renderer) {
        console.warn(`No renderer found for element type: ${element.type}`);
        return null;
      }

      // Get the renderer component
      const RendererComponent = renderer.renderComponent;
      if (!RendererComponent) {
        console.warn(`No renderComponent found for element type: ${element.type}`);
        return null;
      }

      // Common props for all renderers
      const commonProps = {
        element,
        isSelected,
        onSelect: () => !readonly && onSelectElement(element.id),
        onTransform: (updates: Partial<EditorElement>) =>
          !readonly && onTransformElement(element.id, updates),
        // Snapping callbacks
        allElements: elements,
        canvasSize,
        onSnapGuides: enableSnapGuides ? setSnapGuides : undefined,
        onClearSnapGuides: enableSnapGuides ? onClearSnapGuides : undefined,
        // Pass element ID for centralized transformer lookup
        elementId: element.id,
        // Disable individual transformers (centralized transformer will handle it)
        disableTransformer: true,
        // Callback to notify when node structure changes (e.g., image loads)
        onNodeUpdate: onTransformerUpdate,
        // Pass mode context to renderers (e.g., cardData for TemplatedText)
        ...(mode?.context || {}),
      };

      return <RendererComponent key={element.id} {...commonProps} />;
    },
    [
      selectedElementId,
      registry,
      readonly,
      onSelectElement,
      onTransformElement,
      elements,
      canvasSize,
      enableSnapGuides,
      onClearSnapGuides,
      onTransformerUpdate,
      mode,
    ]
  );

  // Sort elements by z-index
  const sortedElements = [...elements].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div
      className={`flex flex-1 overflow-hidden items-center justify-center ${className}`}
      style={style}
    >
      <div
        ref={containerRef}
        className="flex relative w-full h-full items-center justify-center overflow-hidden"
      >
        {/* Zoom indicator */}
        {enablePanZoom && stageScale !== 1 && (
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 10,
              background: "rgba(0, 0, 0, 0.7)",
              color: "white",
              padding: "4px 12px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: 500,
              pointerEvents: "none",
            }}
          >
            {Math.round(stageScale * 100)}%
          </div>
        )}

        <Stage
          className="w-full h-full"
          ref={stageRef}
          width={stageSize.width}
          height={stageSize.height}
          onClick={handleStageClick}
          onTap={handleStageClick}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            cursor: isPanning.current ? "grabbing" : "default",
          }}
        >
          <Layer x={layerOffset.x} y={layerOffset.y} listening={true}>
            {/* Canvas background - shows the actual canvas bounds */}
            {backgroundImage ? (
              <KonvaImage
                x={0}
                y={0}
                width={canvasSize.width}
                height={canvasSize.height}
                image={backgroundImage}
                listening={false}
              />
            ) : (
              <Rect
                x={0}
                y={0}
                width={canvasSize.width}
                height={canvasSize.height}
                fill={mode?.backgroundColor || "#ffffff"}
                listening={false}
              />
            )}

            {/* Elements can now render outside canvas bounds */}
            {!hideElements && sortedElements.map(renderElement)}

            {/* Snap guides */}
            {enableSnapGuides && (
              <SnapGuides
                verticalGuides={snapGuides.vertical}
                horizontalGuides={snapGuides.horizontal}
                canvasSize={canvasSize}
              />
            )}

            {/* Centralized Transformer */}
            <CentralizedTransformer
              selectedElementId={selectedElementId}
              stageRef={stageRef}
              isLocked={readonly}
              updateTrigger={transformerUpdateTrigger}
              onTransform={(elementId, updates) => {
                // During transform, calculate snap guides based on the new size/position
                if (!enableSnapGuides) return;

                const element = elements.find((el) => el.id === elementId);
                if (!element) return;

                // Create a temporary element with the updated properties for snapping calculation
                const tempElement = {
                  ...element,
                  position: updates.position || element.position,
                  size: updates.size || element.size,
                  rotation: updates.rotation ?? element.rotation,
                };

                // Calculate snapping based on the temporary element
                const snapResult = getSnappingPosition(
                  tempElement,
                  tempElement.position.x,
                  tempElement.position.y,
                  elements.filter((el) => el.id !== elementId),
                  {
                    threshold: 5,
                    snapToElements: true,
                    snapToCanvas: true,
                    canvasSize,
                  }
                );

                // Update snap guides (but don't apply position changes during resize)
                setSnapGuides({
                  vertical: snapResult.verticalGuides,
                  horizontal: snapResult.horizontalGuides,
                });
              }}
              onTransformEnd={(elementId, updates) => {
                onTransformElement(elementId, updates);
                // Clear snap guides after transform ends
                setSnapGuides({ vertical: [], horizontal: [] });
              }}
            />
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default Canvas;
