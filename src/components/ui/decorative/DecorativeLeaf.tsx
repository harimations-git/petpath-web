import type { CSSProperties } from "react";
import leafImage from "../../../assets/leaf.png";
import "./DecorativeLeaf.css";

type DecorativeLeafProps = {
  width?: number;
  height?: number;
  top?: CSSProperties["top"];
  bottom?: CSSProperties["bottom"];
  left?: CSSProperties["left"];
  right?: CSSProperties["right"];
  rotate?: number;
  flipX?: boolean;
  flipY?: boolean;
  opacity?: number;
  zIndex?: number;
  src?: string;
  style?: CSSProperties;
};

export default function DecorativeLeaf({
  width = 130,
  height = 130,
  top,
  bottom,
  left,
  right,
  rotate = 0,
  flipX = false,
  flipY = false,
  opacity = 1,
  zIndex = 0,
  src = leafImage,
  style,
}: DecorativeLeafProps) {
  const scaleX = flipX ? -1 : 1;
  const scaleY = flipY ? -1 : 1;

  return (
    <img
      src={src}
      alt=""
      className="decorative-leaf"
      style={{
        width,
        height,
        top,
        bottom,
        left,
        right,
        opacity,
        zIndex,
        transform: `rotate(${rotate}deg) scale(${scaleX}, ${scaleY})`,
        ...style,
      }}
    />
  );
}