import * as React from "react";

import { mergeClassNames } from "@foundation/lib/class-names";

import { RadioInput, type RadioInputProps } from "./RadioInput";
import {
  useRadioGroupContext,
  type RadioValue,
} from "./RadioGroup";
import styles from "./Radio.module.scss";

export interface RadioProps<Value extends RadioValue = RadioValue>
  extends Omit<RadioInputProps<Value>, "className"> {
  label?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

function RadioInner<Value extends RadioValue>(
  { label, children, className, disabled, ...inputProps }: RadioProps<Value>,
  ref: React.ForwardedRef<HTMLInputElement>,
) {
  const group = useRadioGroupContext();
  const isDisabled = group.disabled || disabled;

  return (
    <label
      className={mergeClassNames(
        styles.root,
        isDisabled && styles.disabled,
        className,
      )}
    >
      <span className={styles.control}>
        <RadioInput
          {...inputProps}
          ref={ref}
          value={inputProps.value}
          disabled={disabled}
          className={styles.input}
        />
        <span className={styles.indicator} aria-hidden="true" />
      </span>
      {label != null ? <span className={styles.label}>{label}</span> : null}
      {children}
    </label>
  );
}

export const Radio = React.forwardRef(RadioInner) as <
  Value extends RadioValue,
>(
  props: RadioProps<Value> & React.RefAttributes<HTMLInputElement>,
) => React.ReactElement;
