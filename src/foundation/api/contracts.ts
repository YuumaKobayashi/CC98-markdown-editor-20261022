/**
 * 主后端用于返回分页集合的通用 wire 包装。
 */
export interface ResultWithCount<T> {
  data: T[] | null;
  count: number;
  from: number;
  size: number;
  extra: string | null;
  errorCode: number;
}
