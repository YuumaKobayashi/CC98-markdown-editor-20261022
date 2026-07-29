import * as React from "react";
import { Link } from "react-router";

type PaginationLinkProps = {
  text: string;
  url: string;
  active?: boolean;
};

export type PagerProps = {
  page: number;
  url: string;
  totalPage: number;
};

function PaginationLink({ text, url, active }: PaginationLinkProps) {
  return (
    <li className="page-item">
      <Link className={`page-link${active ? " active" : ""}`} to={url}>
        {text}
      </Link>
    </li>
  );
}

//TODO: 修复多了选数量的部分
export function Pager({ page: currentPage, url, totalPage }: PagerProps) {
  const [nextPage, setNextPage] = React.useState(currentPage);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const candidatePage = Number.parseInt(event.target.value, 10);

    if (
      Number.isNaN(candidatePage) ||
      candidatePage < 1 ||
      candidatePage > totalPage
    ) {
      return;
    }

    setNextPage(candidatePage);
  };

  const pageLength = 3;
  const pageList: number[] = [];

  let left = Math.max(1, currentPage - pageLength);
  let right = Math.min(totalPage, currentPage + pageLength);

  if (right - left !== pageLength * 2) {
    const leftLength = pageLength * 2 - (right - currentPage);
    const rightLength = pageLength * 2 - (currentPage - left);

    left = Math.max(1, currentPage - leftLength);
    right = Math.min(totalPage, currentPage + rightLength);
  }

  for (let page = left; page <= right; page += 1) {
    pageList.push(page);
  }

  const showFirst = pageList[0] !== 1;
  const showLast = pageList[pageList.length - 1] !== totalPage;
  const showPrevious = left !== 1;
  const showNext = right !== totalPage;
  const showGoto = totalPage > 20;

  return (
    <div className="pagination">
      <ul className="page-nav">
        {showFirst && <PaginationLink text="1" url={`${url}1#1`} />}

        {showPrevious && (
          <PaginationLink text="&lsaquo;" url={`${url}${currentPage - 1}#1`} />
        )}

        {pageList.map((page) => (
          <PaginationLink
            key={page}
            text={`${page}`}
            url={`${url}${page}#1`}
            active={currentPage === page}
          />
        ))}

        {showNext && (
          <PaginationLink text="&rsaquo;" url={`${url}${currentPage + 1}#1`} />
        )}

        {showLast && (
          <PaginationLink text={`${totalPage}`} url={`${url}${totalPage}#1`} />
        )}
      </ul>

      {showGoto && (
        <div className="page-goto">
          <div>
            <input onChange={handleInput} placeholder="跳转到" />
          </div>
          <div>
            <Link to={`${url}${nextPage}#1`}> Go </Link>
          </div>
        </div>
      )}
    </div>
  );
}
