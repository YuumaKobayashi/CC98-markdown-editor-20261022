import * as React from "react";
import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { mergeClassNames } from "@foundation/lib/class-names";

import styles from "./TagsInput.module.scss";

export type TagsInputStatus = "error" | "warning";

export interface TagsInputClassNames {
  root?: string;
  control?: string;
  chips?: string;
  chip?: string;
  chipRemove?: string;
  input?: string;
  positioner?: string;
  popup?: string;
  item?: string;
}

export interface TagsInputProps {
  value?: readonly string[];
  defaultValue?: readonly string[];
  onValueChange?: (value: string[]) => void;
  options: readonly string[];
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  form?: string;
  placeholder?: string;
  status?: TagsInputStatus;
  ariaLabel?: string;
  ariaInvalid?: boolean;
  ariaDescribedBy?: string;
  autoFocus?: boolean;
  defaultOpen?: boolean;
  className?: string;
  classNames?: TagsInputClassNames;
}

type PreventableKeyboardEvent = React.KeyboardEvent<HTMLInputElement> & {
  preventBaseUIHandler?: () => void;
};

function uniqueValues(values: readonly string[]) {
  return values.filter((value, index) => values.indexOf(value) === index);
}

export const TagsInput = React.forwardRef<HTMLInputElement, TagsInputProps>(
  function TagsInput(
    {
      value,
      defaultValue = [],
      onValueChange,
      options,
      disabled,
      readOnly,
      required,
      name,
      id,
      form,
      placeholder,
      status,
      ariaLabel,
      ariaInvalid,
      ariaDescribedBy,
      autoFocus,
      defaultOpen,
      className,
      classNames,
    },
    ref,
  ) {
    const isControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = React.useState<string[]>(
      () => uniqueValues(defaultValue),
    );
    const [inputValue, setInputValue] = React.useState("");
    const selectedValue = uniqueValues(
      isControlled ? value : uncontrolledValue,
    );
    const trimmedInput = inputValue.trim();
    const ignoreInput =
      inputValue.length > 0 &&
      (trimmedInput.length === 0 || selectedValue.includes(trimmedInput));
    const availableOptions = uniqueValues([...options, ...selectedValue]);
    const items =
      trimmedInput &&
      !selectedValue.includes(trimmedInput) &&
      !availableOptions.includes(trimmedInput)
        ? [trimmedInput, ...availableOptions]
        : availableOptions;

    const handleValueChange = (nextValue: string[]) => {
      const normalizedValue = uniqueValues(nextValue);
      if (!isControlled) setUncontrolledValue(normalizedValue);
      setInputValue("");
      onValueChange?.(normalizedValue);
    };

    const handleInputKeyDown = (event: PreventableKeyboardEvent) => {
      if (
        event.key !== "Enter" ||
        disabled ||
        readOnly ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.metaKey ||
        event.nativeEvent.isComposing ||
        event.which === 229
      ) {
        return;
      }

      const activeDescendantId =
        event.currentTarget.getAttribute("aria-activedescendant");
      const activeOption = activeDescendantId
        ? event.currentTarget.ownerDocument.getElementById(activeDescendantId)
        : null;
      const highlightedValue = activeOption?.getAttribute(
        "data-tags-input-value",
      );
      const highlightedCandidate =
        activeOption?.getAttribute("role") === "option" &&
        highlightedValue !== null &&
        items.includes(highlightedValue)
          ? highlightedValue
          : null;
      const query = event.currentTarget.value.trim();
      const candidate = highlightedCandidate ?? query;

      event.preventDefault();
      event.preventBaseUIHandler?.();

      if (
        !candidate ||
        (highlightedCandidate === null && selectedValue.includes(candidate))
      ) {
        setInputValue("");
        return;
      }

      handleValueChange(
        highlightedCandidate !== null && selectedValue.includes(candidate)
          ? selectedValue.filter((item) => item !== candidate)
          : [...selectedValue, candidate],
      );
    };

    return (
      <div
        className={mergeClassNames(styles.root, className, classNames?.root)}
        data-disabled={disabled ? "" : undefined}
        data-readonly={readOnly ? "" : undefined}
        data-status={status}
      >
        <BaseCombobox.Root<string, true>
          items={items}
          multiple
          value={selectedValue}
          onValueChange={handleValueChange}
          inputValue={inputValue}
          onInputValueChange={setInputValue}
          filter={(item, query) =>
            !ignoreInput &&
            item.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())
          }
          autoHighlight={trimmedInput.length > 0 && !ignoreInput}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          name={name}
          id={id}
          form={form}
          defaultOpen={defaultOpen}
          modal={false}
        >
          <BaseCombobox.InputGroup
            className={mergeClassNames(styles.control, classNames?.control)}
          >
            <BaseCombobox.Chips
              className={mergeClassNames(styles.chips, classNames?.chips)}
            >
              <BaseCombobox.Value>
                {(currentValue: string[]) => (
                  <>
                    {currentValue.map((item) => (
                      <BaseCombobox.Chip
                        key={item}
                        className={mergeClassNames(
                          styles.chip,
                          classNames?.chip,
                        )}
                        aria-label={item}
                      >
                        <span className={styles.chipText}>{item}</span>
                        {!disabled && !readOnly && (
                          <BaseCombobox.ChipRemove
                            className={mergeClassNames(
                              styles.chipRemove,
                              classNames?.chipRemove,
                            )}
                            aria-label={`移除 ${item}`}
                          >
                            <span aria-hidden="true">x</span>
                          </BaseCombobox.ChipRemove>
                        )}
                      </BaseCombobox.Chip>
                    ))}
                    <BaseCombobox.Input
                      ref={ref}
                      id={id}
                      className={mergeClassNames(
                        styles.input,
                        classNames?.input,
                      )}
                      placeholder={
                        currentValue.length === 0 && placeholder
                          ? placeholder
                          : undefined
                      }
                      aria-label={ariaLabel}
                      aria-invalid={
                        ariaInvalid || status === "error" || undefined
                      }
                      aria-describedby={ariaDescribedBy}
                      autoFocus={autoFocus}
                      onKeyDown={handleInputKeyDown}
                    />
                  </>
                )}
              </BaseCombobox.Value>
            </BaseCombobox.Chips>
          </BaseCombobox.InputGroup>
          <BaseCombobox.Portal>
            <BaseCombobox.Positioner
              className={mergeClassNames(
                styles.positioner,
                classNames?.positioner,
              )}
              side="bottom"
              align="start"
              sideOffset={4}
            >
              <BaseCombobox.Popup
                className={mergeClassNames(styles.popup, classNames?.popup)}
              >
                <BaseCombobox.List>
                  {(item: string, index: number) => (
                    <BaseCombobox.Item
                      key={item}
                      className={mergeClassNames(
                        styles.item,
                        classNames?.item,
                      )}
                      value={item}
                      index={index}
                      data-tags-input-value={item}
                    >
                      {item}
                      <BaseCombobox.ItemIndicator
                        className={styles.itemIndicator}
                      >
                        <span aria-hidden="true">✓</span>
                      </BaseCombobox.ItemIndicator>
                    </BaseCombobox.Item>
                  )}
                </BaseCombobox.List>
              </BaseCombobox.Popup>
            </BaseCombobox.Positioner>
          </BaseCombobox.Portal>
        </BaseCombobox.Root>
      </div>
    );
  },
);
