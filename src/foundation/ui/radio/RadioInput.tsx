import * as React from "react";

import {
  useRadioGroupContext,
  type RadioValue,
} from "./RadioGroup";

export interface RadioInputProps<Value extends RadioValue = RadioValue>
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    | "type"
    | "name"
    | "value"
    | "checked"
    | "defaultChecked"
    | "onChange"
  > {
  value: Value;
}

function RadioInputInner<Value extends RadioValue>(
  { value, disabled, ...props }: RadioInputProps<Value>,
  ref: React.ForwardedRef<HTMLInputElement>,
) {
  const group = useRadioGroupContext();
  const isDisabled = group.disabled || disabled;

  return (
    <input
      {...props}
      ref={ref}
      type="radio"
      name={group.name}
      value={value}
      checked={group.value === value}
      disabled={isDisabled}
      onChange={(event) => {
        if (event.currentTarget.checked) group.onValueChange(value);
      }}
    />
  );
}

export const RadioInput = React.forwardRef(RadioInputInner) as <
  Value extends RadioValue,
>(
  props: RadioInputProps<Value> & React.RefAttributes<HTMLInputElement>,
) => React.ReactElement;
