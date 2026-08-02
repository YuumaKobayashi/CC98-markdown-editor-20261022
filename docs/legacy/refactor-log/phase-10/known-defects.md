# P10 已知问题与保留项

## `P10-PURITY-001`：`MessagePerson` 在 render 中修改 props

- `MessagePerson` 会在 `lastContent` 为空时写回 `data.lastContent`；
- P10 不把该行为伪装成纯展示，也不顺手修复，因此未迁移该组件；
- 需要独立缺陷批准后才能消除写 props 行为并重新归类。

## `P10-MESSAGE-001`：回复通知保留旧 UBB 字符串

- `MessageResponsebox` 在已读、无 boardId 分支生成的 title 含既有额外 `}`；
- P10 为保持可观察输出逐字保留，不在函数化阶段修复。

## `P10-HOME-001`：首页 props 与空值语义保持宽松

- `MainPageTopicComponent.fetchUrl` 继续存在但未使用，未知 style 仍沿用无返回值语义；
- 两个公告组件对空字符串分别返回空 `div` 与 `null`，没有合并；
- `target="_blank"`、固定图片 URL 和当前 key 选择保持不变。

## 延期候选

- `HotTopicComponent` 在 render 中读取 storage，不属于 P10；
- `Link`/`withRouter`、breadcrumb 和 `MainPageCountComponent` 留给 P14/P15；
- `NoticeMessage`、`MessageBar` 留给 P12 `shared/ui`；
- `Breadcrumb`、`FindIP`、`TopicReplyUserBar`、`RecommendedBoardComponent` 没有跟踪消费者，留给 P21；
- Footer/App/页面组合器、state/lifecycle 组件和冻结 UBB 均保持原位。

## 兼容与构建保留项

- 消息/公告组件仍依赖冻结的 legacy UBB renderer，消息日期仍直接使用 Moment；
- 旧路径 facade 留待 P21，在此之前不得解释为旧目录已清空；
- 正式构建的 Sass、Spectrum 和 chunk 警告不是 P10 新增问题。
