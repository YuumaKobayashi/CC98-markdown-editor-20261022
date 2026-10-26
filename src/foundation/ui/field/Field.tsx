import * as React from "react";

import { mergeClassNames } from "@foundation/lib/class-names";

import styles from "./Field.module.scss";

export interface FieldClassNames {
  root?: string;
  label?: string;
  requiredMark?: string;
  control?: string;
  description?: string;
  error?: string;
}

export interface FieldProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  label: React.ReactNode;
  controlId?: string;
  required?: boolean;
  error?: React.ReactNode;
  errorId: string;
  description?: React.ReactNode;
  descriptionId?: string;
  classNames?: FieldClassNames;
  children: React.ReactNode;
}

export function Field({
  label,
  controlId,
  required = false,
  error,
  errorId,
  description,
  descriptionId,
  classNames,
  className,
  children,
  ...props
}: FieldProps) {
  const content = (
    <>
      {children}
      {description != null ? (
        <div className={classNames?.description} id={descriptionId}>
          {description}
        </div>
      ) : null}
      {error != null ? (
        <div
          className={mergeClassNames(styles.error, classNames?.error)}
          id={errorId}
          role="alert"
        >
          {error}
        </div>
      ) : null}
    </>
  );

  return (
    <div
      {...props}
      className={mergeClassNames(styles.root, classNames?.root, className)}
      data-invalid={error != null ? "" : props["data-invalid"]}
    >
      <label
        className={mergeClassNames(styles.label, classNames?.label)}
        htmlFor={controlId}
      >
        {required ? (
          <span
            className={mergeClassNames(
              styles.requiredMark,
              classNames?.requiredMark,
            )}
            aria-hidden="true"
          >
            *
          </span>
        ) : null}
        {label}
      </label>
      {classNames?.control !== undefined ? (
        <div className={classNames.control}>{content}</div>
      ) : (
        content
      )}
    </div>
  );
}
