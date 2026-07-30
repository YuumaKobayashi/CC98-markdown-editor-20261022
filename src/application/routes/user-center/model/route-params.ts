export const parseUserCenterPage = (page: string | undefined): number => {
  const parsedPage = Number.parseInt(page ?? "", 10);
  return Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
};

export const parseUserCenterIsHot = (isHot: string | undefined): 0 | 1 =>
  isHot === "1" ? 1 : 0;
