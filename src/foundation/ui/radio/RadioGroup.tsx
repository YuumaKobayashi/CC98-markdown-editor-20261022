import * as React from "react";

import { mergeClassNames } from "@foundation/lib/class-names";

import styles from "./Radio.module.scss";

export type RadioValue = string | number;

interface RadioGroupContextValue {
  name: string;
  value: RadioValue;
  disabled: boolean;
  onValueChange: (value: RadioValue) => void;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(
  null,
);

export interface RadioGroupProps<Value extends RadioValue>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue"> {
  name: string;
  value: Value;
  disabled?: boolean;
  onValueChange: (value: NoInfer<Value>) => void;
}

export function RadioGroup<Value extends RadioValue>({
  name,
  value,
  disabled = false,
  onValueChange,
  className,
  children,
  ...props
}: RadioGroupProps<Value>) {
  const contextValue = React.useMemo<RadioGroupContextValue>(
    () => ({
      name,
      value,
      disabled,
      onValueChange: (nextValue) => onValueChange(nextValue as Value),
    }),
    [disabled, name, onValueChange, value],
  );

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div
        {...props}
        role="radiogroup"
        aria-disabled={disabled ? true : props["aria-disabled"]}
        className={mergeClassNames(styles.group, className)}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

export function useRadioGroupContext(): RadioGroupContextValue {
  const context = React.useContext(RadioGroupContext);
  if (!context) {
    throw new Error("RadioInput must be rendered inside RadioGroup.");
  }
  return context;
}
