import * as React from "react";
import { Link } from "react-router";

export type UserCenterPagerProps = {
  currentPage: number;
  totalPage: number;
  href: string;
  hasTotal: boolean;
  keyword?: string;
};

export function UserCenterPager({
  currentPage,
  totalPage,
  href,
  hasTotal,
  keyword,
}: UserCenterPagerProps) {
  const currentStyle: React.CSSProperties = {
    backgroundColor: "#ccc",
    cursor: "default",
  };

  const getTargetUrl = (page: number) =>
    `${href}${page}${keyword ? `?keyword=${keyword}` : ""}`;

  const renderPage = (page: number) => (
    <li key={`${href}${page}`}>
      <Link to={getTargetUrl(page)}>
        <button
          type="button"
          disabled={page === currentPage}
          style={page === currentPage ? currentStyle : {}}
        >
          {page}
        </button>
      </Link>
    </li>
  );

  let pageNumbers: number[] = [];
  const elements: React.ReactNode[] = [];

  if (totalPage <= 7) {
    for (let page = 1; page <= totalPage; page += 1) {
      pageNumbers.push(page);
    }
    elements.push(...pageNumbers.map(renderPage));
  } else if (currentPage - 1 <= 3) {
    for (let page = 1; page <= 7; page += 1) {
      pageNumbers.push(page);
    }
    elements.push(...pageNumbers.map(renderPage));
    elements.push(
      <li key="after">
        <button disabled>···</button>
      </li>,
      <li key={`${href}${totalPage}`}>
        <Link to={getTargetUrl(totalPage)}>
          <button type="button">{totalPage}</button>
        </Link>
      </li>,
    );
  } else if (totalPage - currentPage <= 3) {
    for (let page = totalPage - 6; page <= totalPage; page += 1) {
      pageNumbers.push(page);
    }
    elements.push(
      <li key={`${href}1`}>
        <Link to={getTargetUrl(1)}>
          <button type="button">1</button>
        </Link>
      </li>,
      <li key="before">
        <button disabled>···</button>
      </li>,
      ...pageNumbers.map(renderPage),
    );
  } else {
    for (let page = currentPage - 3; page <= currentPage + 3; page += 1) {
      pageNumbers.push(page);
    }
    elements.push(
      <li key={`${href}1`}>
        <Link to={getTargetUrl(1)}>
          <button type="button">1</button>
        </Link>
      </li>,
      <li key="before">
        <button disabled>···</button>
      </li>,
      ...pageNumbers.map(renderPage),
      <li key="after">
        <button disabled>···</button>
      </li>,
      <li key={`${href}${totalPage}`}>
        <Link to={getTargetUrl(totalPage)}>
          <button type="button">{totalPage}</button>
        </Link>
      </li>,
    );
  }

  if (!hasTotal && currentPage !== totalPage) {
    elements.push(
      <li key="after">
        <button disabled>···</button>
      </li>,
    );
  }

  return (
    <div id="userCenterPageCount">
      <ul>{elements}</ul>
    </div>
  );
}
