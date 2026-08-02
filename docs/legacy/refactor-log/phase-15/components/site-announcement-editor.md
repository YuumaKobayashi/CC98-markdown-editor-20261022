# SiteAnnouncementEditor

- 旧位置：`Components/SiteManage/Announcement.tsx` default class。
- 新 owner：`pages/site-manage/announcement` 具名函数。
- 生命周期：mount `useEffect` 加载公告；cleanup 清理提示 timer 并阻止卸载后更新。
- 行为：公告 PUT、首页缓存 PUT、提示文案、TextArea、UBB 预览和 DOM 保持不变。
- 兼容：旧路径保留 default re-export。

人工重点：加载、编辑预览、两种成功/失败提示和快速离页。
