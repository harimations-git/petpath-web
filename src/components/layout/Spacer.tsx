import type { CSSProperties } from "react";

type SpacerProps = {
  height?: CSSProperties["height"];
  width?: CSSProperties["width"];
  className?: string;
  style?: CSSProperties;
};

export default function Spacer({
  height = 16,
  width = 0,
  className = "",
  style,
}: SpacerProps) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        height,
        width,
        flexShrink: 0,
        ...style,
      }}
    />
  );
}