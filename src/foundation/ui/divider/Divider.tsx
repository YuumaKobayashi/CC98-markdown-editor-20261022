import * as React from "react";
import { mergeClassNames } from "@foundation/lib/class-names";
import styles from "./Divider.module.scss";
export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> { type?: "horizontal" | "vertical"; dashed?: boolean; }
export function Divider({ type = "horizontal", dashed, className, ...props }: DividerProps) { return <div {...props} role="separator" aria-orientation={type} className={mergeClassNames(styles.divider, styles[type], dashed && styles.dashed, className)} />; }
