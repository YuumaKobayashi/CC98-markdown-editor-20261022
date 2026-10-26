import * as React from "react";

import { mergeClassNames } from "@foundation/lib/class-names";
import { EmptyImage } from "@foundation/ui/empty";
import { Pagination } from "@foundation/ui/pagination";
import { Spinner } from "@foundation/ui/spinner";

import styles from "./List.module.scss";

export interface ListLocale {
  emptyText?: React.ReactNode;
}

export interface ListLoadingConfig {
  indicator?: React.ReactNode;
}

export interface ListPaginationConfig {
  current?: number;
  defaultCurrent?: number;
  pageSize?: number;
  total?: number;
  simple?: boolean;
  position?: "top" | "bottom" | "both";
  disabled?: boolean;
  hideOnSinglePage?: boolean;
  showQuickJumper?: boolean;
  onChange?: (page: number, pageSize: number) => void | Promise<void>;
}

export interface ListProps<Item = unknown>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  dataSource?: readonly Item[];
  renderItem?: (item: Item, index: number) => React.ReactNode;
  pagination?: false | ListPaginationConfig;
  loading?: boolean | ListLoadingConfig;
  locale?: ListLocale;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

function toPositiveInteger(value: number | undefined, fallback: number) {
  const integer = Math.floor(value ?? fallback);
  return Number.isFinite(integer) && integer > 0 ? integer : fallback;
}

function ListRoot<Item = unknown>({
  dataSource,
  renderItem,
  pagination = false,
  loading = false,
  locale,
  header,
  footer,
  className,
  ...props
}: ListProps<Item>) {
  // -------------------- 分页基础数据 --------------------
  // pagination=false 表示不显示分页器；传入对象时读取具体分页配置。
  const paginationConfig = pagination || undefined;
  // pageSize 默认每页 10 条，非法数字会退回默认值。
  const pageSize = toPositiveInteger(paginationConfig?.pageSize, 10);
  // 服务端分页优先使用 total；本地分页不传 total 时使用数据长度。
  const totalItems = Math.max(
    0,
    Math.floor(paginationConfig?.total ?? dataSource?.length ?? 0),
  );
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // -------------------- 当前页状态 --------------------
  // 传 current 时页码由外部控制，否则使用组件内部页码。
  const [internalPage, setInternalPage] = React.useState(() =>
    toPositiveInteger(paginationConfig?.defaultCurrent, 1),
  );
  const requestedPage = toPositiveInteger(
    paginationConfig?.current ?? internalPage,
    1,
  );
  const currentPage = Math.min(requestedPage, totalPages);

  // 数据减少时，当前页可能超过新的总页数，需要同步修正内部页码。
  React.useEffect(() => {
    if (paginationConfig?.current === undefined && internalPage !== currentPage) {
      setInternalPage(currentPage);
    }
  }, [currentPage, internalPage, paginationConfig?.current]);

  // -------------------- 当前页列表数据 --------------------
  const source = dataSource ?? [];
  const pageStart = (currentPage - 1) * pageSize;

  // 完整的本地数据需要切片；服务端分页通常只传入当前页，不应再次切片。
  const visibleSource =
    paginationConfig && source.length > pageSize
      ? source.slice(pageStart, pageStart + pageSize)
      : source;

  // renderItem 负责把每一条原始数据转换成 List.Item。
  const content = visibleSource.map((item, index) => renderItem?.(item, index));

  // -------------------- 空状态与加载状态 --------------------
  const showEmpty = visibleSource.length === 0;

  // loading=true 使用默认 Spinner；loading.indicator 可以替换加载图标。
  const loadingIndicator = loading
    ? typeof loading === "object"
      ? loading.indicator ?? <Spinner />
      : <Spinner />
    : null;

  // -------------------- 分页器 --------------------
  const paginationPosition = paginationConfig?.position ?? "bottom";
  const showPagination =
    paginationConfig !== undefined &&
    !(paginationConfig.hideOnSinglePage && totalItems <= pageSize);

  // 将 List 的 AntD 风格分页配置转换成本地 Pagination 的接口。
  const paginationNode = showPagination ? (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      simple={paginationConfig.simple}
      quickJump={paginationConfig.showQuickJumper}
      disabled={paginationConfig.disabled}
      onPageChange={async (page) => {
        if (paginationConfig.current === undefined) setInternalPage(page);
        await paginationConfig.onChange?.(page, pageSize);
      }}
    />
  ) : null;

  // -------------------- 最终页面结构 --------------------
  // 顺序：header -> 顶部分页 -> 列表/空状态 -> loading -> footer -> 底部分页。
  return (
    <div
      {...props}
      className={mergeClassNames(styles.list, className)}
      aria-busy={loading ? true : props["aria-busy"]}
    >
      {header != null && <div className={styles.header}>{header}</div>}
      {paginationNode != null &&
        (paginationPosition === "top" || paginationPosition === "both") && (
          <div
            className={mergeClassNames(
              styles.pagination,
              styles.paginationTop,
            )}
          >
            {paginationNode}
          </div>
        )}
      {showEmpty ? (
        <div className={styles.emptyWrap}>
          <div className={styles.empty}>
            <div className={styles.emptyImage}>
              <EmptyImage />
            </div>
            <div className={styles.emptyDescription}>
              {locale?.emptyText ?? "暂无数据"}
            </div>
          </div>
        </div>
      ) : (
        <ul className={styles.items}>{content}</ul>
      )}
      {loadingIndicator != null && (
        <div className={styles.loading}>{loadingIndicator}</div>
      )}
      {footer != null && <div className={styles.footer}>{footer}</div>}
      {paginationNode != null &&
        (paginationPosition === "bottom" || paginationPosition === "both") && (
          <div
            className={mergeClassNames(
              styles.pagination,
              styles.paginationBottom,
            )}
          >
            {paginationNode}
          </div>
        )}
    </div>
  );
}

export interface ListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  actions?: readonly React.ReactNode[];
  extra?: React.ReactNode;
}

function ListItem({
  actions,
  extra,
  className,
  children,
  ...props
}: ListItemProps) {
  // actions 常由条件表达式生成，先移除其中的空项。
  const visibleActions = actions?.filter(
    (action) => action !== null && action !== undefined,
  );

  return (
    <li {...props} className={mergeClassNames(styles.item, className)}>
      {children}
      {visibleActions != null && visibleActions.length > 0 && (
        <ul className={styles.itemActions}>
          {visibleActions.map((action, index) => (
            <li key={index}>{action}</li>
          ))}
        </ul>
      )}
      {extra != null && <div className={styles.itemExtra}>{extra}</div>}
    </li>
  );
}

export interface ListItemMetaProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  avatar?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
}

function ListItemMeta({
  avatar,
  title,
  description,
  className,
  ...props
}: ListItemMetaProps) {
  return (
    <div {...props} className={mergeClassNames(styles.meta, className)}>
      {avatar != null && <div className={styles.metaAvatar}>{avatar}</div>}
      <div className={styles.metaContent}>
        {title != null && <div className={styles.title}>{title}</div>}
        {description != null && (
          <div className={styles.description}>{description}</div>
        )}
      </div>
    </div>
  );
}

// 对外暴露 AntD 风格的 List.Item 和 List.Item.Meta 复合组件写法。
export const List = Object.assign(ListRoot, {
  Item: Object.assign(ListItem, { Meta: ListItemMeta }),
});
