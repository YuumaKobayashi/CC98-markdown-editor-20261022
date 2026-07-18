
export function getListTotalPage(totalTopicCount) {
  return (totalTopicCount - (totalTopicCount % 20)) / 20 + 1;
}

export function getTotalPageof10(replyCount) {
  const totalFloor = replyCount + 1;
  return totalFloor % 10 === 0
    ? totalFloor / 10
    : (totalFloor - (totalFloor % 10)) / 10 + 1;
}

export function getTagLayer(tagId: number, tags) {
  for (let item of tags) {
    for (let tag of item.tags) {
      if (tag.id == tagId) return item.layer;
    }
  }
  return false;
}
