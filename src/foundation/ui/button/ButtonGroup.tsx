import * as React from "react";

import styles from "./Button.module.scss";

export type ButtonGroupProps = React.HTMLAttributes<HTMLDivElement>;

export function ButtonGroup({ className, ...props }: ButtonGroupProps) {
  return (
    <div
      {...props}
      role={props.role ?? "group"}
      className={`${styles.group}${className ? ` ${className}` : ""}`}
    />
  );
}
