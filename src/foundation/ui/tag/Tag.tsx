import * as React from "react";
import { mergeClassNames } from "@foundation/lib/class-names";
import styles from "./Tag.module.scss";
export type TagColor = "blue" | "cyan" | "green" | "magenta" | "red" | "orange" | "gold" | "purple";
export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> { color?: TagColor | string; }
const presetColors = new Set(["blue", "cyan", "green", "magenta", "red", "orange", "gold", "purple"]);
export function Tag({ color, className, style, ...props }: TagProps) {
  const preset = color && presetColors.has(color) ? color : undefined;
  const custom = color && !preset ? color : undefined;
  const customStyle = custom
    ? ({ "--tag-custom-color": custom, ...style } as React.CSSProperties)
    : style;
  return <span {...props} className={mergeClassNames(styles.tag, preset && styles[preset], custom && styles.custom, className)} style={customStyle} />;
}
