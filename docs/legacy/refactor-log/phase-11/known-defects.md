# P11 已知问题与保留项

## `P11-BOARD-001`：大字报继续保留首次 props 派生状态

- `isFollow` 和 `content` 只在组件首次挂载时初始化，后续同一实例的 props 变化不会重置它们；
- TextArea 继续使用 `defaultValue`，提交后仍依赖上层刷新服务端展示值；
- P11 使用惰性 state initializer 保留该行为，不引入同步 effect 或请求语义修复。

## `P11-MODERATION-001`：查看 IP 弹窗依赖父组件卸载关闭

- `visible` 初始化为 `true` 后不在组件内部更新；
- 确认和取消都调用 `changeStatus`，由父组件清空 `IPData` 并卸载弹窗；
- 列表中 post fragment 的既有 key 警告风险也保持不变。

## `P11-FOCUS-001`：Focus 页签样式继续由直接 DOM 操作维护

- 组件挂载时直接增删三个固定 id 的 class；
- 原实现没有卸载清理，其他页签依靠各自挂载逻辑覆盖样式；
- P11 只用 `useLayoutEffect` 映射时机，不重构 Router 或页签状态所有权。

## `P11-MESSAGE-001`：消息设置继续使用 jQuery 和非受控 radio

- 挂载时通过 id 修改 `checked` attribute，保存时通过全局 radio selector 读取值；
- `noticeSetting` 继续使用旧 `str-`/`obj-` storage 编码和相同默认对象；
- P11 不把它改为 React 受控表单，也不改变 Topic 回帖跳转消费者。

## 延期范围

- Router/Redux、带订阅或 timer cleanup 的组件留给 P14/P15；
- `shared/ui`、AntD peer 收口留给 P12；
- 消息、收藏和写操作的服务端状态迁移留给 P17–P19；
- 无跟踪消费者的 class 留给 P21 引用清理。
