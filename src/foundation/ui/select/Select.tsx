import * as React from "react";
import { Select as BaseSelect } from "@base-ui/react/select";
import { mergeClassNames } from "@foundation/lib/class-names";

import styles from "./Select.module.scss";

export type SelectValue = string | number;

export interface SelectOption<Value extends SelectValue> {
  value: Value;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface SelectClassNames {
  trigger?: string;
  positioner?: string;
  popup?: string;
  item?: string;
}

export interface SelectProps<Value extends SelectValue> {
  options: ReadonlyArray<SelectOption<Value>>;
  value?: Value | null;
  defaultValue?: Value | null;
  onValueChange?: (value: Value | null) => void;
  placeholder?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
  ariaInvalid?: boolean;
  ariaDescribedBy?: string;
  name?: string;
  classNames?: SelectClassNames;
  highlightFirstItemOnOpen?: boolean;
}

function getTypeaheadLabel(label: React.ReactNode) {
  return typeof label === "string" || typeof label === "number"
    ? String(label)
    : undefined;
}

export function Select<Value extends SelectValue>({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder,
  disabled,
  className,
  ariaLabel,
  ariaInvalid,
  ariaDescribedBy,
  name,
  classNames,
  highlightFirstItemOnOpen = false,
}: SelectProps<Value>) {
  const rootRef = React.useRef<HTMLSpanElement>(null);
  const itemRefs = React.useRef<Array<HTMLElement | null>>([]);
  const currentValueRef = React.useRef<Value | null>(
    value ?? defaultValue ?? null
  );
  const isControlled = value !== undefined;

  if (isControlled) currentValueRef.current = value;

  const handleValueChange = (nextValue: Value | null) => {
    if (!isControlled) currentValueRef.current = nextValue;
    onValueChange?.(nextValue);
  };

  return (
    <span
      ref={rootRef}
      className={mergeClassNames(styles.root, className)}
      data-disabled={disabled ? "" : undefined}
    >
      <BaseSelect.Root<Value>
        items={options}
        value={value}
        defaultValue={defaultValue}
        onValueChange={handleValueChange}
        onOpenChangeComplete={(open) => {
          if (!open || !highlightFirstItemOnOpen || currentValueRef.current !== null) {
            return;
          }
          const firstEnabledIndex = options.findIndex((option) => !option.disabled);
          if (firstEnabledIndex !== -1) itemRefs.current[firstEnabledIndex]?.focus();
        }}
        disabled={disabled}
        name={name}
        modal={false}
      >
        <BaseSelect.Trigger
          className={mergeClassNames(styles.trigger, classNames?.trigger)}
          aria-label={ariaLabel}
          aria-invalid={ariaInvalid || undefined}
          aria-describedby={ariaDescribedBy}
        >
          <BaseSelect.Value className={styles.value} placeholder={placeholder} />
          <BaseSelect.Icon className={styles.icon}>
            <svg
              className={styles.arrow}
              viewBox="64 64 896 896"
              focusable="false"
              aria-hidden="true"
            >
              <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z" />
            </svg>
          </BaseSelect.Icon>
        </BaseSelect.Trigger>
        <BaseSelect.Portal>
          <BaseSelect.Positioner
            className={mergeClassNames(
              styles.positioner,
              classNames?.positioner
            )}
            anchor={rootRef}
            side="bottom"
            align="start"
            sideOffset={4}
            alignItemWithTrigger={false}
          >
            <BaseSelect.Popup
              className={mergeClassNames(styles.popup, classNames?.popup)}
            >
              <BaseSelect.List>
                {options.map((option, index) => (
                  <BaseSelect.Item
                    key={`${typeof option.value}:${option.value}`}
                    ref={(node) => {
                      itemRefs.current[index] = node;
                    }}
                    className={mergeClassNames(styles.item, classNames?.item)}
                    value={option.value}
                    disabled={option.disabled}
                    label={getTypeaheadLabel(option.label)}
                  >
                    <BaseSelect.ItemText className={styles.itemText}>
                      {option.label}
                    </BaseSelect.ItemText>
                  </BaseSelect.Item>
                ))}
              </BaseSelect.List>
            </BaseSelect.Popup>
          </BaseSelect.Positioner>
        </BaseSelect.Portal>
      </BaseSelect.Root>
    </span>
  );
}
