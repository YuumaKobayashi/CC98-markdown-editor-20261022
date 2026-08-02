# Z1 类型债务清单

Z1 不根据字段名猜测未知 wire shape；以下均保持原 `any`，没有新增断言、非空断言或错误窄化。

| 原路径 / symbol.field | 当前 owner | 活动消费者 | 未知原因 | 待核对证据与移除条件 |
| --- | --- | --- | --- | --- |
| `IConfig.d.ts / IConfig.recommendationFunction` | `modules/site-content` | 当前无直接类型消费者 | 原合同仅声明 `any[]` | 取得对应配置 API schema、真实响应样本及全部消费者后定义元素 DTO |
| `ITopic.d.ts / ITopic.highlightInfo` | `modules/topic` | Board Topic 列表类型消费者 | 高亮结构未在旧声明说明 | 对照 Board Topic API 样本、渲染与编辑消费者后收窄 |
| `IPost.d.ts / IPost.allowedViewers` | `modules/post` | Board Topic Preview 类型消费者 | 允许查看者 wire shape 未知 | 对照 Post API schema、权限场景和全部消费者后收窄 |
| `IPost.d.ts / IPost.awardInfo` | `modules/post` | Board Topic Preview 类型消费者 | 与 `awards` 的关系未说明 | 对照帖子/评分 API 样本和 Topic Award 消费者后收窄 |
| `IPost.d.ts / IPost.lastUpdateAuthor` | `modules/post` | Board Topic Preview 类型消费者 | 匿名、删除和未更新场景的空值协议未知 | 覆盖对应 API 场景并确认 nullability 后收窄 |
| `IPost.d.ts / IPost.lastUpdateTime` | `modules/post` | Board Topic Preview 类型消费者 | 日期表示和空值协议未知 | 取得真实 wire sample 并核对时间消费者后收窄 |

## 合同冲突（未用 `any` 掩盖）

- 旧 `ISignIn.lastSignInTime` 声明为 `string`，活动 `DailySigninPage` 私有 `SigninInfo` 声明为 `number`。Z1 保留旧公共合同但不强加给 `getSigninInfo()` 返回值；待真实 `/me/signin` 响应样本和页面计算语义确认后另立批次统一。
