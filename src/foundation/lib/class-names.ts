export type ClassName = string | false | null | undefined;

export function mergeClassNames(...classNames: ClassName[]) {
  return classNames.filter(Boolean).join(" ");
}
