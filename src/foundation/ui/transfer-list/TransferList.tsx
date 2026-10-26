import * as React from "react";

import { mergeClassNames } from "@foundation/lib/class-names";
import { Checkbox } from "@foundation/ui/checkbox";
import { EmptyImage } from "@foundation/ui/empty";

import styles from "./TransferList.module.scss";

export interface TransferListProps<Item, Key extends React.Key>
  extends Omit<
    React.HTMLAttributes<HTMLElement>,
    "children" | "title" | "onChange"
  > {
  items: readonly Item[];
  getItemKey: (item: Item, index: number) => Key;
  renderItem: (item: Item, index: number) => React.ReactNode;
  selectedKeys: readonly Key[];
  onSelectedKeysChange: (keys: Key[]) => void;
  title: React.ReactNode;
  empty?: React.ReactNode;
  ariaLabel: string;
  disabled?: boolean;
}

export function TransferList<Item, Key extends React.Key>({
  items,
  getItemKey,
  renderItem,
  selectedKeys,
  onSelectedKeysChange,
  title,
  empty = "暂无数据",
  ariaLabel,
  disabled = false,
  className,
  ...props
}: TransferListProps<Item, Key>) {
  const itemKeys = items.map(getItemKey);
  const allSelected =
    itemKeys.length > 0 && selectedKeys.length === itemKeys.length;
  const partiallySelected = selectedKeys.length > 0 && !allSelected;

  const toggleKey = (key: Key, checked: boolean) => {
    onSelectedKeysChange(
      checked
        ? [...selectedKeys, key]
        : selectedKeys.filter((selectedKey) => selectedKey !== key),
    );
  };

  return (
    <section
      {...props}
      className={mergeClassNames(styles.transferList, className)}
      data-transfer-list
      aria-disabled={disabled ? true : props["aria-disabled"]}
    >
      <header className={styles.listHeader}>
        <Checkbox
          className={styles.headerCheckbox}
          checked={allSelected}
          indeterminate={partiallySelected}
          disabled={disabled || itemKeys.length === 0}
          aria-label={ariaLabel}
          onChange={(event) =>
            onSelectedKeysChange(event.currentTarget.checked ? itemKeys : [])
          }
        />
        <span className={styles.listCount}>
          {selectedKeys.length > 0
            ? `${selectedKeys.length}/${items.length} 项`
            : `${items.length} 项`}
        </span>
        <span className={styles.listTitle}>{title}</span>
      </header>
      <div className={styles.listContent}>
        {items.length === 0 ? (
          <div className={styles.notFound}>
            <div className={styles.empty}>
              <div className={styles.emptyImage}>
                <EmptyImage variant="simple" />
              </div>
              <p className={styles.emptyDescription}>{empty}</p>
            </div>
          </div>
        ) : (
          <ul className={styles.topicList}>
            {items.map((item, index) => {
              const key = itemKeys[index];
              return (
                <li key={key} className={styles.topicItem}>
                  <Checkbox
                    className={styles.topicCheckbox}
                    checked={selectedKeys.includes(key)}
                    disabled={disabled}
                    onChange={(event) =>
                      toggleKey(key, event.currentTarget.checked)
                    }
                  >
                    {renderItem(item, index)}
                  </Checkbox>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
