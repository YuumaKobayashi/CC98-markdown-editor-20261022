/**
 * [md]…[/md] 区域扫描：UBB 文本里嵌入的 Markdown 块定位。
 *
 * 与渲染端 MdTagHandler 同一配对语义——每个 [md] 在其后第一个 [/md] 处
 * 闭合（Markdown 内容里的字面 "[md]" 文本不做特殊处理，与渲染管线
 * 一致：改了内容里的标签文本本来就会改变渲染分块）。
 */

export interface MdRegion {
  /** 开标签 "[md]" 起止偏移（不含内容）。 */
  openStart: number;
  openEnd: number;
  /** 两标签之间的 Markdown 内容起止偏移。 */
  contentStart: number;
  contentEnd: number;
  /** 闭标签 "[/md]" 起止偏移。 */
  closeStart: number;
  closeEnd: number;
}

const MD_TOKEN = /\[md\]|\[\/md\]/gi;

/** 按出现顺序扫描全部已闭合的 [md]…[/md] 区域。 */
export function findMdRegions(value: string): MdRegion[] {
  const openStack: number[] = [];
  const regions: MdRegion[] = [];
  MD_TOKEN.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = MD_TOKEN.exec(value))) {
    if (match[0].length === 4) {
      // "[md]"
      openStack.push(match.index);
    } else if (openStack.length > 0) {
      const openStart = openStack.pop() as number;
      const closeStart = match.index;
      regions.push({
        openStart,
        openEnd: openStart + 4,
        contentStart: openStart + 4,
        contentEnd: closeStart,
        closeStart,
        closeEnd: closeStart + 5,
      });
    }
  }
  regions.sort((a, b) => a.openStart - b.openStart);
  return regions;
}

/** 偏移落在哪个区域里（不含标签本身），没有则返回 -1。 */
export function findMdRegionAt(regions: MdRegion[], offset: number): number {
  for (let i = regions.length - 1; i >= 0; i--) {
    const region = regions[i];
    // 开区间：光标贴着 "[" 之前或 "]" 之后都算块外——自动切换靠它驱动，
    // 「完成返回」把光标放在 closeEnd，闭区间会立刻重新打开（死循环）。
    if (offset > region.openStart && offset < region.closeEnd) return i;
  }
  return -1;
}
