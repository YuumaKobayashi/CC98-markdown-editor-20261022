import * as React from "react";

import { mergeClassNames } from "@foundation/lib/class-names";
import { Pagination } from "@foundation/ui/pagination";

import styles from "./DataTable.module.scss";

export interface DataTableColumn<Row> {
  key: React.Key;
  header: React.ReactNode;
  width?: number | string;
  minWidth?: number | string;
  align?: "left" | "center" | "right";
  render: (row: Row, sourceIndex: number) => React.ReactNode;
}

export interface DataTableProps<Row> {
  rows: readonly Row[];
  columns: readonly DataTableColumn<Row>[];
  getRowKey: (row: Row, sourceIndex: number) => React.Key;
  currentPage: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  emptyText?: React.ReactNode;
  loadingText?: React.ReactNode;
  loading?: boolean;
  bordered?: boolean;
  className?: string;
  ariaLabel?: string;
}

const toCssLength = (value: number | string | undefined) =>
  typeof value === "number"
    ? Number.isFinite(value)
      ? `${value}px`
      : undefined
    : value;

const getColumnStyle = (width: number | string | undefined) => ({
  "--data-table-column-width": toCssLength(width),
}) as React.CSSProperties;

const getCellStyle = (minWidth: number | string | undefined) => ({
  "--data-table-cell-min-width": toCssLength(minWidth),
}) as React.CSSProperties;

const getAlignmentClassName = (
  align: DataTableColumn<unknown>["align"]
) => {
  switch (align) {
    case "center":
      return styles.alignCenter;
    case "right":
      return styles.alignRight;
    case "left":
    default:
      return styles.alignLeft;
  }
};

export function DataTable<Row>({
  rows,
  columns,
  getRowKey,
  currentPage: requestedPage,
  pageSize: requestedPageSize = 10,
  onPageChange,
  emptyText = "暂无数据",
  loadingText = "加载中...",
  loading = false,
  bordered = false,
  className,
  ariaLabel,
}: DataTableProps<Row>) {
  const pageSize = Math.max(1, Math.floor(requestedPageSize) || 1);
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(
    Math.max(1, Math.floor(requestedPage) || 1),
    totalPages
  );
  const pageStart = (currentPage - 1) * pageSize;
  const visibleRows = rows.slice(pageStart, pageStart + pageSize);
  const minimumTableWidth = columns.reduce(
    (total, column) =>
      total +
      (typeof column.width === "number" && Number.isFinite(column.width)
        ? Math.max(0, column.width)
        : typeof column.minWidth === "number" &&
            Number.isFinite(column.minWidth)
          ? Math.max(0, column.minWidth)
          : 100),
    0
  );
  const tableStyle = {
    "--data-table-min-width": `${minimumTableWidth}px`,
  } as React.CSSProperties;
  const rootClassName = mergeClassNames(
    styles.root,
    bordered && styles.bordered,
    className,
  );

  return (
    <div
      className={rootClassName}
      data-data-table-current-page={currentPage}
      data-data-table-row-count={rows.length}
      data-data-table-visible-row-count={visibleRows.length}
      data-data-table-loading={loading ? "true" : "false"}
      data-data-table-min-width={minimumTableWidth}
    >
      <div className={styles.scrollContainer}>
        <table
          className={styles.table}
          style={tableStyle}
          aria-label={ariaLabel}
          aria-busy={loading}
        >
          <colgroup>
            {columns.map((column) => (
              <col
                key={column.key}
                className={styles.column}
                style={getColumnStyle(column.width)}
              />
            ))}
          </colgroup>
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`${styles.cell} ${getAlignmentClassName(
                    column.align
                  )}`}
                  style={getCellStyle(column.minWidth)}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, visibleIndex) => {
              const sourceIndex = pageStart + visibleIndex;
              return (
                <tr key={getRowKey(row, sourceIndex)}>
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`${styles.cell} ${getAlignmentClassName(
                        column.align
                      )}`}
                      style={getCellStyle(column.minWidth)}
                    >
                      {column.render(row, sourceIndex)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {visibleRows.length === 0 ? (
        <div className={styles.emptyPlaceholder} role="status">
          <div className={styles.emptyState}>
            <span className={styles.emptyImage} aria-hidden="true" />
            <span>{loading ? loadingText : emptyText}</span>
          </div>
        </div>
      ) : null}
      {rows.length > 0 ? (
        <Pagination
          className={styles.pagination}
          currentPage={currentPage}
          totalPages={totalPages}
          disabled={loading}
          onPageChange={onPageChange}
        />
      ) : null}
    </div>
  );
}
