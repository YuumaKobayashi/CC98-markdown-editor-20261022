import * as React from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { mergeClassNames } from "@foundation/lib/class-names";
import { CloseOutlined } from "@foundation/ui/icon";

import { acquireBodyScrollLock } from "./dialog-scroll-lock";
import styles from "./Dialog.module.scss";

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

export interface DialogClassNames {
  /** 弹窗视口容器的附加类名。 */
  viewport?: string;
  /** 弹窗内容外壳的附加类名。 */
  content?: string;
  /** 标题栏的附加类名。 */
  header?: string;
  /** 标题文本的附加类名。 */
  title?: string;
  /** 右上角关闭按钮的附加类名。 */
  close?: string;
  /** 底部操作栏的附加类名。 */
  footer?: string;
  /** 取消按钮的附加类名。 */
  cancel?: string;
  /** 确认按钮的附加类名。 */
  confirm?: string;
}

export interface DialogProps {
  /** 是否显示弹窗，由调用方控制。 */
  open: boolean;
  /** 弹窗标题。 */
  title: React.ReactNode;
  /** 弹窗主体内容。 */
  children: React.ReactNode;
  /** 用户请求打开或关闭弹窗时触发。 */
  onOpenChange: (open: boolean) => void;
  /** 点击确认按钮时触发；未提供时确认按钮将直接关闭弹窗。 */
  onConfirm?: () => void | Promise<void>;
  /** 确认按钮文案，默认为“确 定”。 */
  confirmText?: React.ReactNode;
  /** 取消按钮文案；未提供时不显示取消按钮。 */
  cancelText?: React.ReactNode;
  /** 是否禁用确认按钮。 */
  confirmDisabled?: boolean;
  /** 是否处于提交状态；启用时禁止确认及用户主动关闭弹窗。 */
  confirmLoading?: boolean;
  /** 自定义底部内容；提供后将替换默认操作按钮。 */
  footer?: React.ReactNode;
  /** 右上角关闭按钮的无障碍名称，默认为“关闭”。 */
  closeLabel?: string;
  /** 是否禁用右上角关闭按钮。 */
  closeDisabled?: boolean;
  /** 是否允许点击遮罩关闭弹窗，默认为 true。 */
  maskClosable?: boolean;
  /** 是否在关闭后保留弹窗 DOM 及其内部状态。 */
  preserveOnClose?: boolean;
  /** 弹窗宽度；数字按 px 处理，也可传入带单位的字符串。 */
  width?: number | string;
  /** 弹窗窗口的附加类名。 */
  className?: string;
  /** 弹窗主体区域的附加类名。 */
  bodyClassName?: string;
  /** 各结构区域的附加类名。 */
  classNames?: DialogClassNames;
  /** 弹窗窗口的内联样式。 */
  style?: React.CSSProperties;
}

/**
 * 受控弹窗组件：由调用方管理打开状态和确认操作，内部负责焦点管理、
 * 背景滚动锁、提交期间的关闭拦截，以及关闭后的内容挂载策略。
 */
export function Dialog({
  open,
  title,
  children,
  onOpenChange,
  onConfirm,
  confirmText = "确 定",
  cancelText,
  confirmDisabled = false,
  confirmLoading = false,
  footer,
  closeLabel = "关闭",
  closeDisabled = false,
  maskClosable = true,
  preserveOnClose = false,
  width = 520,
  className,
  bodyClassName,
  classNames,
  style,
}: DialogProps) {
  // 弹窗打开后将焦点移入窗口，避免键盘焦点停留在背景页面。
  const popupRef = React.useRef<HTMLDivElement>(null);
  // 保存滚动锁的清理函数，使其可以延后到退出动画结束时执行。
  const releaseScrollLockRef = React.useRef<(() => void) | null>(null);
  // 记录弹窗是否至少打开过一次，按需支持关闭后保留内部 DOM 和状态。
  const [hasOpened, setHasOpened] = React.useState(open);
  // 提交期间确认按钮也必须禁用，防止重复提交。
  const isConfirmDisabled = confirmDisabled || confirmLoading;
  // 与 antd Modal 一致：提交期间忽略 Esc、遮罩和关闭按钮发出的关闭请求。
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && confirmLoading) return;
    onOpenChange(nextOpen);
  };
  const releaseScrollLock = React.useCallback(() => {
    releaseScrollLockRef.current?.();
    releaseScrollLockRef.current = null;
  }, []);
  // 通过 CSS 变量把数字宽度统一转换为 px，同时保留 rem、vw 等字符串单位。
  const popupStyle = {
    ...style,
    "--dialog-width": typeof width === "number" ? `${width}px` : width,
  } as React.CSSProperties;

  // 弹窗打开时锁定背景滚动，退出动画结束后再释放，避免动画期间页面跳动。
  useIsomorphicLayoutEffect(() => {
    if (
      open &&
      typeof document !== "undefined" &&
      releaseScrollLockRef.current === null
    ) {
      releaseScrollLockRef.current = acquireBodyScrollLock(document);
    }
  }, [open]);

  // 组件可能在退出动画完成前卸载，此时仍需兜底释放滚动锁。
  useIsomorphicLayoutEffect(
    () => () => releaseScrollLock(),
    [releaseScrollLock],
  );

  // preserveOnClose 只在首次打开后生效，避免从未展示的内容提前挂载。
  useIsomorphicLayoutEffect(() => {
    if (open) setHasOpened(true);
  }, [open]);

  const dialogFooter =
    footer !== undefined ? (
      footer
    ) : (
      <>
        {cancelText !== undefined && (
          <BaseDialog.Close
            className={mergeClassNames(styles.cancel, classNames?.cancel)}
            type="button"
            disabled={confirmLoading}
          >
            {cancelText}
          </BaseDialog.Close>
        )}
        {onConfirm === undefined ? (
          <BaseDialog.Close
            className={mergeClassNames(styles.confirm, classNames?.confirm)}
            type="button"
            disabled={isConfirmDisabled}
            aria-busy={confirmLoading || undefined}
          >
            {confirmText}
          </BaseDialog.Close>
        ) : (
          <button
            className={mergeClassNames(styles.confirm, classNames?.confirm)}
            type="button"
            disabled={isConfirmDisabled}
            aria-busy={confirmLoading || undefined}
            onClick={() => onConfirm()}
          >
            {confirmText}
          </button>
        )}
      </>
    );

  /*
   * 弹窗结构：
   * Root：管理受控开关、焦点和关闭事件。
   * └─ Portal：将弹窗渲染到页面顶层，避免受父级布局和层叠上下文影响。
   *    ├─ Backdrop：页面遮罩。
   *    └─ Viewport：覆盖视口并承载弹窗滚动。
   *       └─ Popup：实际的弹窗窗口。
   *          └─ Content：标题栏、关闭按钮、正文和底部操作栏。
   */
  return (
    <BaseDialog.Root
      open={open}
      onOpenChange={handleOpenChange}
      onOpenChangeComplete={(nextOpen) => {
        if (!nextOpen) releaseScrollLock();
      }}
      disablePointerDismissal={!maskClosable || confirmLoading}
      modal="trap-focus"
    >
      <BaseDialog.Portal keepMounted={preserveOnClose && hasOpened}>
        <BaseDialog.Backdrop className={styles.backdrop} />
        <BaseDialog.Viewport
          className={mergeClassNames(styles.viewport, classNames?.viewport)}
        >
          <BaseDialog.Popup
            ref={popupRef}
            className={mergeClassNames(styles.popup, className)}
            style={popupStyle}
            aria-modal="true"
            initialFocus={popupRef}
          >
            <div
              className={mergeClassNames(styles.content, classNames?.content)}
            >
              <div
                className={mergeClassNames(styles.header, classNames?.header)}
              >
                <BaseDialog.Title
                  className={mergeClassNames(styles.title, classNames?.title)}
                >
                  {title}
                </BaseDialog.Title>
              </div>
              <BaseDialog.Close
                className={mergeClassNames(styles.close, classNames?.close)}
                aria-label={closeLabel}
                type="button"
                disabled={closeDisabled || confirmLoading}
              >
                <CloseOutlined className={styles.closeIcon} />
              </BaseDialog.Close>
              <div className={mergeClassNames(styles.body, bodyClassName)}>
                {children}
              </div>
              <div
                className={mergeClassNames(styles.footer, classNames?.footer)}
                data-owned-dialog-footer
              >
                {dialogFooter}
              </div>
            </div>
          </BaseDialog.Popup>
        </BaseDialog.Viewport>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}
