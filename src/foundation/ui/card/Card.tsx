import * as React from "react";
import { mergeClassNames } from "@foundation/lib/class-names";
import styles from "./Card.module.scss";
export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> { size?: "default" | "small"; title?: React.ReactNode; extra?: React.ReactNode; bordered?: boolean; }
export function Card({ size = "default", title, extra, bordered = true, className, children, ...props }: CardProps) {
  return <div {...props} className={mergeClassNames(styles.card, styles[size], !bordered && styles.borderless, className)}>
    {(title != null || extra != null) && <div className={styles.head}><div className={styles.title}>{title}</div><div>{extra}</div></div>}
    <div className={styles.body}>{children}</div>
  </div>;
}
