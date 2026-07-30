export const MESSAGE_PAGE_SIZE = 10;

export function parseMessagePage(value: string | undefined): number {
  if (!value || !/^\d+$/.test(value)) return 1;

  const page = Number.parseInt(value, 10);
  return page > 0 ? page : 1;
}

export function getMessagePageCount(totalCount: number): number {
  return Math.floor((totalCount - 0.5) / MESSAGE_PAGE_SIZE) + 1;
}

export function getMessagePageOffset(page: number): number {
  return (page - 1) * MESSAGE_PAGE_SIZE;
}
