# P12 人工确认

> 当前状态：实现、机械门禁及依赖与日志收口均已按用户逐批审批创建本地提交；浏览器人工验收仍待执行；不 push、不开始 P13

## 待确认内容

- 接受 AntD 4.24.16、Moment 保留与 `ConfigProvider` 边界；
- 接受 6 个 class 表单的 FormInstance 机械迁移；
- 接受调用点直接使用 `@ant-design/icons` 官方组件，不建立图标包装层；
- 接受 Markdown editor adapter、工具栏顺序、上传合同与两份旧 command 删除；
- 接受 BizCharts adapter 与 `react-lazyload` 同名直接升级，不修改冻结 UBB；
- 接受 React Bootstrap 删除，同时继续保留 Bootstrap、Bootstrap Icons 与 Font Awesome 4 固定资源；
- 接受 `P12-NPM-001` 的 npm 可选 watcher 展示和既有构建警告记录；
- 完成 `manual-checklist.md` 的浏览器、主题、权限和交互验收。

## 门禁状态

- [x] P12 实现与机械验证已完成；
- [x] 用户已逐批审核并授权已完成的本地代码提交；
- [ ] 用户已完成人工页面与交互验收；
- [x] 用户已批准最后的依赖与日志收口提交；
- [ ] 用户已授权进入 P13。

依赖与日志批次已获用户明确批准并创建本地提交；在人工验收与进入 P13 得到明确授权前，不 push、不进入 P13。P11 未完成的人工浏览器验收不因 P12 机械门禁而自动通过。
