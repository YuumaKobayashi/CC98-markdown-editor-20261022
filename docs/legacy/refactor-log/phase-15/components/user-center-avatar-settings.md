# UserCenterAvatarSettings

- 旧位置：`Components/UserCenter/ConfigAvatar.tsx` / `UserCenterConfigAvatar`。
- 新位置：`src/pages/user-center/settings/ui/UserCenterAvatarSettings.tsx` / `UserCenterAvatarSettings`。
- 之前：class state 与实例字段共同管理 FileReader、Canvas、裁剪区和九个原生 mouse listener。
- 现在：具名函数以 state/refs 保存同一数据，普通 effect 集中注册 selector、resize、cover 和 window listener 并配对 cleanup。
- 保持不变：六个默认头像、本地图片类型/160px 限制、800px 缩放、100–500px 裁剪、JPEG 压缩率、两段头像 API、DOM/CSS 与提示。
- 延期：仅鼠标操作；FileReader/`toBlob` 不取消；文件、Canvas/context、Blob 异常路径缺少完整空值保护。
- 兼容：旧文件保留 default 与 `UserCenterConfigAvatar`。
- 人工检查：默认/本地头像、移动/缩放/边界、上传、连续选择、成功/失败与卸载。
