import * as React from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";

import { mergeClassNames } from "@foundation/lib/class-names";
import { QuestionCircleOutlined } from "@foundation/ui/icon";

import { acquireBodyScrollLock } from "./dialog-scroll-lock";
import styles from "./ConfirmDialog.module.scss";

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

export interface ConfirmDialogProps {
  open: boolean;
  title: React.ReactNode;
  children: React.ReactNode;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  confirmText?: React.ReactNode;
  cancelText?: React.ReactNode;
  confirmLoading?: boolean;
  confirmDisabled?: boolean;
}

export function ConfirmDialog({
  open,
  title,
  children,
  onOpenChange,
  onConfirm,
  confirmText = "确 定",
  cancelText = "取 消",
  confirmLoading = false,
  confirmDisabled = false,
}: ConfirmDialogProps) {
  const confirmRef = React.useRef<HTMLButtonElement>(null);
  const releaseScrollLockRef = React.useRef<(() => void) | null>(null);
  const isConfirmDisabled = confirmDisabled || confirmLoading;
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && confirmLoading) return;
    onOpenChange(nextOpen);
  };
  const releaseScrollLock = React.useCallback(() => {
    releaseScrollLockRef.current?.();
    releaseScrollLockRef.current = null;
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (
      open &&
      typeof document !== "undefined" &&
      releaseScrollLockRef.current === null
    ) {
      releaseScrollLockRef.current = acquireBodyScrollLock(document);
    }
  }, [open]);

  useIsomorphicLayoutEffect(
    () => () => releaseScrollLock(),
    [releaseScrollLock],
  );

  return (
    <BaseDialog.Root
      open={open}
      onOpenChange={handleOpenChange}
      onOpenChangeComplete={(nextOpen) => {
        if (!nextOpen) releaseScrollLock();
      }}
      disablePointerDismissal
      modal="trap-focus"
    >
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className={styles.backdrop} />
        <BaseDialog.Viewport className={styles.viewport}>
          <BaseDialog.Popup
            className={styles.popup}
            aria-modal="true"
            initialFocus={confirmRef}
          >
            <div className={styles.body}>
              <div className={styles.message}>
                <QuestionCircleOutlined
                  className={styles.icon}
                  aria-hidden="true"
                />
                <BaseDialog.Title className={styles.title}>
                  {title}
                </BaseDialog.Title>
                <BaseDialog.Description
                  className={styles.description}
                  render={<div />}
                >
                  {children}
                </BaseDialog.Description>
              </div>
              <div className={styles.actions}>
                <BaseDialog.Close
                  className={styles.button}
                  type="button"
                  disabled={confirmLoading}
                >
                  {cancelText}
                </BaseDialog.Close>
                <button
                  ref={confirmRef}
                  className={mergeClassNames(styles.button, styles.confirm)}
                  type="button"
                  disabled={isConfirmDisabled}
                  aria-busy={confirmLoading || undefined}
                  data-loading={confirmLoading || undefined}
                  onClick={() => {
                    void onConfirm();
                  }}
                >
                  {confirmLoading && (
                    <span className={styles.spinner} aria-hidden="true" />
                  )}
                  {confirmText}
                </button>
              </div>
            </div>
          </BaseDialog.Popup>
        </BaseDialog.Viewport>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}
