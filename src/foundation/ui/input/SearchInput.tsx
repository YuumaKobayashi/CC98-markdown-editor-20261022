import * as React from "react";
import { Button } from "../button";
import { Input, type InputProps } from "./Input";
import styles from "./Input.module.scss";

export interface SearchInputProps extends Omit<InputProps, "onSearch"> {
  onSearch?: (value: string) => void;
  searchLabel?: React.ReactNode;
}
export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  { onSearch, searchLabel = "搜 索", onKeyDown, className, style, ...props }, ref
) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const setRef = (node: HTMLInputElement | null) => { inputRef.current = node; if (typeof ref === "function") ref(node); else if (ref) ref.current = node; };
  const search = () => onSearch?.(inputRef.current?.value ?? "");
  return <span className={`${styles.search}${className ? ` ${className}` : ""}`} style={style}><Input {...props} ref={setRef} onKeyDown={(event) => { onKeyDown?.(event); if (event.key === "Enter" && !event.defaultPrevented) search(); }} /><Button type="primary" onClick={search}>{searchLabel}</Button></span>;
});
