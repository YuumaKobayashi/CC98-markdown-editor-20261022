import * as React from "react";
import { mergeClassNames } from "@foundation/lib/class-names";
import styles from "./Input.module.scss";
import type { InputStatus } from "./Input";

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { status?: InputStatus; }
export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { status, className, ...props }, ref
) {
  return <textarea {...props} ref={ref} className={mergeClassNames(styles.input, styles.textarea, status && styles[status], className)} />;
});
