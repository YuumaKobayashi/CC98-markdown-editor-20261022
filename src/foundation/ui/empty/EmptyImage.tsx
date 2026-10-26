import * as React from "react";

export interface EmptyImageProps
  extends Omit<React.SVGAttributes<SVGSVGElement>, "children"> {
  variant?: "default" | "simple";
}

const DEFAULT_CONTENT = (
  <>
    <path
      d="M55 12.76 44.85 1.26C44.37.47 43.66 0 42.91 0H21.09c-.75 0-1.46.47-1.94 1.26L9 12.76V22h46v-9.24Z"
      fill="#fafafa"
    />
    <path
      d="M41.61 15.93c0-1.6 1.01-2.93 2.23-2.93H55v18.14C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.26 9 31.14V13h11.16c1.22 0 2.23 1.32 2.23 2.93v.02c0 1.6 1.01 2.91 2.23 2.91h14.75c1.22 0 2.24-1.31 2.24-2.91v-.02Z"
      fill="#fff"
    />
  </>
);

const SIMPLE_CONTENT = (
  <>
    <path
      d="M55 12.76 44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"
      fill="#fafafa"
    />
    <path
      d="M41.613 15.931c0-1.605-1.023-2.93-2.285-2.931H24.672c-1.262 0-2.285 1.326-2.285 2.931V16H9v18h46V16H41.613v-.069z"
      fill="#fff"
    />
  </>
);

export function EmptyImage({ variant = "default", ...props }: EmptyImageProps) {
  return (
    <svg
      width="64"
      height="41"
      viewBox="0 0 64 41"
      aria-hidden="true"
      {...props}
    >
      <g transform="translate(0 1)" fill="none" fillRule="evenodd">
        <ellipse fill="#f5f5f5" cx="32" cy="33" rx="32" ry="7" />
        <g fillRule="nonzero" stroke="#d9d9d9">
          {variant === "simple" ? SIMPLE_CONTENT : DEFAULT_CONTENT}
        </g>
      </g>
    </svg>
  );
}
