/**
 * Snap Guides Component
 *
 * Renders visual guide lines when elements are being snapped.
 */

import React from "react";
import { Line } from "react-konva";
import { SnapGuide } from "../utils/snapping";

export interface SnapGuidesProps {
  /** Vertical guides to display */
  verticalGuides: SnapGuide[];
  /** Horizontal guides to display */
  horizontalGuides: SnapGuide[];
  /** Canvas size */
  canvasSize: { width: number; height: number };
}

/**
 * Snap guides renderer
 */
export const SnapGuides: React.FC<SnapGuidesProps> = ({
  verticalGuides,
  horizontalGuides,
  canvasSize,
}) => {
  return (
    <>
      {/* Vertical guides */}
      {verticalGuides.map((guide, index) => (
        <Line
          key={`v-${index}`}
          points={[guide.position, 0, guide.position, canvasSize.height]}
          stroke={guide.type === "center" ? "#ff00ff" : "#00ff00"}
          strokeWidth={1}
          dash={guide.type === "center" ? [4, 4] : undefined}
          listening={false}
        />
      ))}

      {/* Horizontal guides */}
      {horizontalGuides.map((guide, index) => (
        <Line
          key={`h-${index}`}
          points={[0, guide.position, canvasSize.width, guide.position]}
          stroke={guide.type === "center" ? "#ff00ff" : "#00ff00"}
          strokeWidth={1}
          dash={guide.type === "center" ? [4, 4] : undefined}
          listening={false}
        />
      ))}
    </>
  );
};
