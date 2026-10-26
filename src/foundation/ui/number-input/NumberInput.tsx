import * as React from "react";
import { NumberField as BaseNumberField } from "@base-ui/react/number-field";
import { mergeClassNames } from "@foundation/lib/class-names";

import styles from "./NumberInput.module.scss";

export type NumberInputStatus = "error" | "warning";

export interface NumberInputClassNames {
  root?: string;
  input?: string;
  increment?: string;
  decrement?: string;
}

export interface NumberInputProps {
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number | "any";
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  form?: string;
  status?: NumberInputStatus;
  ariaLabel?: string;
  ariaInvalid?: boolean;
  ariaDescribedBy?: string;
  autoFocus?: boolean;
  className?: string;
  classNames?: NumberInputClassNames;
}

export const NumberInput = React.forwardRef<
  HTMLInputElement,
  NumberInputProps
>(function NumberInput(
  {
    value,
    defaultValue,
    onValueChange,
    min,
    max,
    step,
    disabled,
    readOnly,
    required,
    name,
    id,
    form,
    status,
    ariaLabel,
    ariaInvalid,
    ariaDescribedBy,
    autoFocus,
    className,
    classNames,
  },
  ref,
) {
  return (
    <BaseNumberField.Root
      className={mergeClassNames(styles.root, className, classNames?.root)}
      value={value}
      defaultValue={defaultValue ?? undefined}
      onValueChange={(nextValue) => onValueChange?.(nextValue)}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      name={name}
      id={id}
      form={form}
      format={{ useGrouping: false, maximumFractionDigits: 20 }}
      data-status={status}
    >
      <BaseNumberField.Group className={styles.group}>
        <BaseNumberField.Input
          ref={ref}
          className={mergeClassNames(styles.input, classNames?.input)}
          aria-label={ariaLabel}
          aria-invalid={ariaInvalid || status === "error" || undefined}
          aria-describedby={ariaDescribedBy}
          autoFocus={autoFocus}
        />
        <BaseNumberField.Increment
          className={mergeClassNames(styles.stepper, styles.increment, classNames?.increment)}
          aria-label="增加"
        >
          <span className={styles.upArrow} aria-hidden="true" />
        </BaseNumberField.Increment>
        <BaseNumberField.Decrement
          className={mergeClassNames(styles.stepper, styles.decrement, classNames?.decrement)}
          aria-label="减少"
        >
          <span className={styles.downArrow} aria-hidden="true" />
        </BaseNumberField.Decrement>
      </BaseNumberField.Group>
    </BaseNumberField.Root>
  );
});
