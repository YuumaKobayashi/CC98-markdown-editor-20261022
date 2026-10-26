import * as React from "react";
import { Link, useNavigate } from "react-router";
import { mergeClassNames } from "@foundation/lib/class-names";
import { LeftOutlined, RightOutlined } from "@foundation/ui/icon";

import styles from "./Pagination.module.scss";

export interface PaginationProps extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void | Promise<void>;
  getPageHref?: (page: number) => string;
  quickJump?: boolean;
  simple?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  mode?: "standard" | "legacy-links";
}

function clampPage(page: number, totalPages: number) {
  return Math.min(Math.max(page, 1), totalPages);
}

function getPageWindow(currentPage: number, totalPages: number) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);
  if (currentPage <= 3) return [1, 2, 3, 4, 5, "next-gap" as const, totalPages];
  if (currentPage >= totalPages - 2) return [1, "previous-gap" as const, ...Array.from({ length: 5 }, (_, index) => totalPages - 4 + index)];
  return [1, "previous-gap" as const, ...Array.from({ length: 5 }, (_, index) => currentPage - 2 + index), "next-gap" as const, totalPages];
}

function getLegacyPageWindow(currentPage: number, totalPages: number) {
  const pageRadius = 3;
  let left = Math.max(1, currentPage - pageRadius);
  let right = Math.min(totalPages, currentPage + pageRadius);

  if (right - left !== pageRadius * 2) {
    const leftLength = pageRadius * 2 - (right - currentPage);
    const rightLength = pageRadius * 2 - (currentPage - left);
    left = Math.max(1, currentPage - leftLength);
    right = Math.min(totalPages, currentPage + rightLength);
  }

  return Array.from({ length: right - left + 1 }, (_, index) => left + index);
}

export function Pagination({
  currentPage: requestedPage,
  totalPages: requestedTotalPages,
  onPageChange,
  getPageHref,
  quickJump = false,
  simple = false,
  disabled = false,
  ariaLabel = "分页",
  mode = "standard",
  className,
  ...props
}: PaginationProps) {
  const navigate = useNavigate();
  const totalPages = simple ? Math.max(0, Math.floor(requestedTotalPages) || 0) : Math.max(1, Math.floor(requestedTotalPages) || 1);
  const currentPage = totalPages === 0 ? 0 : clampPage(Math.floor(requestedPage) || 1, totalPages);
  const [jumpValue, setJumpValue] = React.useState("");
  const [simpleValue, setSimpleValue] = React.useState(`${currentPage}`);
  const [legacyTargetPage, setLegacyTargetPage] = React.useState(currentPage);

  React.useEffect(() => setSimpleValue(`${currentPage}`), [currentPage]);
  React.useEffect(() => setLegacyTargetPage(currentPage), [currentPage]);

  if (mode === "legacy-links") {
    const legacyPages = getLegacyPageWindow(currentPage, totalPages);
    const left = legacyPages[0];
    const right = legacyPages[legacyPages.length - 1];
    const pageLink = (page: number, label: React.ReactNode, active = false) => (
      <li key={`${label}-${page}`} className={styles.legacyItem}>
        <Link className={mergeClassNames(styles.legacyLink, active && styles.legacyCurrent)} to={getPageHref?.(page) ?? "#"} aria-current={active ? "page" : undefined}>
          {label}
        </Link>
      </li>
    );

    return (
      <nav {...props} className={mergeClassNames(styles.legacyPagination, className)} aria-label={ariaLabel}>
        <ul className={styles.legacyPages}>
          {left !== 1 && pageLink(1, 1)}
          {left !== 1 && pageLink(currentPage - 1, "‹")}
          {legacyPages.map((page) => pageLink(page, page, page === currentPage))}
          {right !== totalPages && pageLink(currentPage + 1, "›")}
          {right !== totalPages && pageLink(totalPages, totalPages)}
        </ul>
        {totalPages > 20 && (
          <div className={styles.legacyGoto}>
            <div>
              <input placeholder="跳转到" aria-label="页码" inputMode="numeric" onChange={(event) => {
                const candidate = Number.parseInt(event.target.value, 10);
                if (!Number.isNaN(candidate) && candidate >= 1 && candidate <= totalPages) setLegacyTargetPage(candidate);
              }} />
            </div>
            <div><Link to={getPageHref?.(legacyTargetPage) ?? "#"}>Go</Link></div>
          </div>
        )}
      </nav>
    );
  }

  const goToPage = (page: number) => {
    if (disabled) return;
    const nextPage = clampPage(page, totalPages);
    if (nextPage === currentPage) return;
    if (onPageChange) void onPageChange(nextPage);
    else if (getPageHref) void navigate(getPageHref(nextPage));
  };

  const renderControl = (page: number, label: React.ReactNode, controlLabel: string, unavailable = false, active = false, navigation = false) => {
    unavailable = disabled || unavailable;
    const controlClass = mergeClassNames(styles.control, navigation ? styles.navigation : styles.pageNumber, active && styles.current);
    if (getPageHref && !unavailable) {
      return <Link className={controlClass} to={getPageHref(page)} aria-label={controlLabel} aria-current={active ? "page" : undefined} onClick={(event) => { if (active) event.preventDefault(); }}>{label}</Link>;
    }
    return (
      <button className={controlClass} type="button" disabled={unavailable} aria-current={active ? "page" : undefined} aria-label={controlLabel} onClick={() => goToPage(page)}>
        {label}
      </button>
    );
  };

  const previousDisabled = disabled || currentPage <= 1;
  const nextDisabled = disabled || currentPage >= totalPages;

  return (
    <nav {...props} className={mergeClassNames(styles.pagination, simple && styles.simple, className)} aria-label={ariaLabel}>
      <ul className={styles.pages}>
        <li>{renderControl(currentPage - 1, <LeftOutlined />, "上一页", previousDisabled, false, true)}</li>
        {simple ? (
          <li className={styles.simpleStatus}>
            <input aria-label="当前页" value={simpleValue} disabled={disabled} inputMode="numeric" onChange={(event) => setSimpleValue(event.target.value)} onKeyDown={(event) => {
              if (event.key !== "Enter") return;
              const candidate = Number.parseInt(simpleValue, 10);
              if (!Number.isNaN(candidate) && candidate >= 1 && candidate <= totalPages) goToPage(candidate);
            }} />
            <span aria-hidden="true">/</span>
            <span>{totalPages}</span>
          </li>
        ) : getPageWindow(currentPage, totalPages).map((entry) =>
          typeof entry === "number" ? (
            <li key={entry}>{renderControl(entry, entry, `第 ${entry} 页`, false, entry === currentPage)}</li>
          ) : (
            <li key={entry}><span className={styles.gap} aria-hidden="true">•••</span></li>
          ),
        )}
        <li>{renderControl(currentPage + 1, <RightOutlined />, "下一页", nextDisabled, false, true)}</li>
      </ul>
      {quickJump && !simple && (
        <form className={styles.quickJump} onSubmit={(event) => {
          event.preventDefault();
          const candidate = Number.parseInt(jumpValue, 10);
          if (Number.isNaN(candidate) || candidate < 1 || candidate > totalPages) return;
          goToPage(candidate);
        }}>
          <label>跳至<input value={jumpValue} disabled={disabled} inputMode="numeric" aria-label="页码" onChange={(event) => setJumpValue(event.target.value)} />页</label>
        </form>
      )}
    </nav>
  );
}
