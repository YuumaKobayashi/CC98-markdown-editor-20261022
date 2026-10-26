import * as React from "react";
import { mergeClassNames } from "@foundation/lib/class-names";
import styles from "./Spinner.module.scss";
export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> { size?: "small" | "default" | "large"; label?: string; }
export function Spinner({ size = "default", label = "加载中", className, ...props }: SpinnerProps) {
  return <span {...props} role="status" aria-label={label} className={mergeClassNames(styles.spinner, styles[size], className)}><span className={styles.dots} aria-hidden="true"><i /><i /><i /><i /></span></span>;
}
