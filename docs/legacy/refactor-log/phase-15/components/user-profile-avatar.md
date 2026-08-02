# UserProfileAvatar

- 旧位置：`Components/UserCenter/ExactAvatar.tsx` 的匿名 class。
- 新 owner：`src/entities/user/profile-avatar` 的具名函数。
- 副作用：依赖展示头衔的普通 effect 加载头衔与头像框配置，cleanup 忽略旧结果。
- 展示：头像、全部头像框映射、用户头衔与版主头衔合同保持不变。
- 修复：用户切换时重新计算头像框；用户头衔使用稳定 id key。
- 复用：公共资料页与用户中心主页都通过 entity 窄入口消费。

人工重点：各类头像框尺寸位置、头衔过滤、版主与站务主管链接。
