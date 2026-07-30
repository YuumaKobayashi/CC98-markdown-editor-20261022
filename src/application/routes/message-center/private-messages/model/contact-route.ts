export interface PrivateMessageContactRoute {
  urlId: RegExpMatchArray | null;
  urlName: RegExpMatchArray | null;
}

export function parsePrivateMessageContactRoute(
  href: string
): PrivateMessageContactRoute {
  //看url中是否携带id信息，如果有的话就作为第一个联系人
  let urlId = href.match(/id=(\d+)/);
  //看url中是否携带name信息，如果有的话就作为第一个联系人
  let urlName = urlId ? null : href.match(/name=(\S+)/);
  return { urlId, urlName };
}
