import * as React from "react";
import { mergeClassNames } from "@foundation/lib/class-names";
import styles from "./Input.module.scss";

export type InputSize = "small" | "middle" | "large";
export type InputStatus = "error" | "warning";
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: InputSize;
  status?: InputStatus;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { size = "middle", status, className, ...props }, ref
) {
  return <input {...props} ref={ref} className={mergeClassNames(styles.input, styles[size], status && styles[status], className)} />;
});
