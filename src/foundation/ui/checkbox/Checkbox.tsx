import * as React from "react";
import styles from "./Checkbox.module.scss";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  indeterminate?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { children, className, indeterminate = false, ...props }, forwardedRef
) {
  const ownRef = React.useRef<HTMLInputElement | null>(null);
  React.useEffect(() => { if (ownRef.current) ownRef.current.indeterminate = indeterminate; }, [indeterminate]);
  const setRef = (node: HTMLInputElement | null) => { ownRef.current = node; if (typeof forwardedRef === "function") forwardedRef(node); else if (forwardedRef) forwardedRef.current = node; };
  return (
    <label className={`${styles.label}${props.disabled ? ` ${styles.disabled}` : ""}${className ? ` ${className}` : ""}`}>
      <span className={styles.control}>
        <input {...props} ref={setRef} type="checkbox" className={styles.input} />
        <span className={styles.box} aria-hidden="true" />
      </span>
      {children != null && <span className={styles.text}>{children}</span>}
    </label>
  );
});
