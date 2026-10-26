import * as React from "react";
import { Checkbox } from "./Checkbox";
import styles from "./Checkbox.module.scss";

export type CheckboxValue = string | number;
export type CheckboxOption = CheckboxValue | { label: React.ReactNode; value: CheckboxValue; disabled?: boolean };
export interface CheckboxGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  options: CheckboxOption[];
  value?: CheckboxValue[];
  defaultValue?: CheckboxValue[];
  disabled?: boolean;
  onChange?: (values: CheckboxValue[]) => void;
}
export function CheckboxGroup({ options, value, defaultValue = [], disabled, onChange, className, ...props }: CheckboxGroupProps) {
  const [internal, setInternal] = React.useState(defaultValue);
  const selected = value ?? internal;
  const change = (optionValue: CheckboxValue, checked: boolean) => {
    const next = checked ? [...selected, optionValue] : selected.filter((item) => item !== optionValue);
    if (value === undefined) setInternal(next);
    onChange?.(next);
  };
  return <div {...props} className={`${styles.group}${className ? ` ${className}` : ""}`}>{options.map((raw) => {
    const option = typeof raw === "object" ? raw : { label: raw, value: raw };
    return <Checkbox key={option.value} checked={selected.includes(option.value)} disabled={disabled || option.disabled} onChange={(event) => change(option.value, event.target.checked)}>{option.label}</Checkbox>;
  })}</div>;
}
