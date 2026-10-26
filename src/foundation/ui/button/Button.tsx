import * as React from "react";

import { mergeClassNames } from "@foundation/lib/class-names";

import styles from "./Button.module.scss";

export type ButtonVariant = "default" | "primary" | "dashed" | "text" | "link";
export type ButtonSize = "small" | "middle" | "large";

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  type?: ButtonVariant;
  htmlType?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  size?: ButtonSize;
  loading?: boolean;
  danger?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      type = "default",
      htmlType = "button",
      size = "middle",
      loading = false,
      danger = false,
      disabled,
      onClick,
      className,
      children,
      ...props
    },
    ref
  ) {
    const classes = mergeClassNames(
      styles.button,
      styles[type],
      styles[size],
      danger && styles.danger,
      loading && styles.loading,
      className,
    );

    return (
      <button
        {...props}
        ref={ref}
        type={htmlType}
        className={classes}
        disabled={disabled}
        aria-disabled={loading || undefined}
        aria-busy={loading || undefined}
        onClick={(event) => {
          if (loading) {
            event.preventDefault();
            return;
          }
          onClick?.(event);
        }}
      >
        {loading && <span className={styles.spinner} aria-hidden="true" />}
        {children}
      </button>
    );
  }
);
