# UserFavoriteBoardCard

- 旧位置：`Components/UserCenter/MyFavoritesBoard.tsx` 匿名 class。
- 新 owner：`src/pages/user-center/custom-boards/ui/UserFavoriteBoardCard.tsx` 具名函数。
- state：三项按钮状态合并为单一局部对象，成功/失败转换保持原文案。
- API：继续请求 `/me/custom-board/:boardId`，PUT 关注、DELETE 取关，200 视为成功。
- 行为：版面链接、图片路径、版主/主题数、DOM/CSS 和按钮切换不变。
- 兼容：旧路径 default re-export 新 owner。

人工重点：真实 API 下的关注、取关、失败重试及快速离页。
