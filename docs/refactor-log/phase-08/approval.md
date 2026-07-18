# P08 人工确认

> 当前状态：实现与全部有界机械门禁完成；等待人工验收，不提交、不 push、不开始 P09

## 待确认内容

- 接受 TypeScript 5.9.3 和 `~5.9.3` minor 锁定；
- 接受 `src/**` 使用 ES2022/Bundler/automatic JSX，legacy 使用 ES2015/Node10/classic JSX；
- 接受最终 Vite bundle target 继续为 ES2015；
- 接受 `skipLibCheck`、跨配置 import 图和旧声明错误作为 P23 前的显式兼容项；
- 接受构建转换模块增至 2,344，但 9,449 个产物文件和 29 个主题保持；
- 接受真实页面、UBB 展示/编辑和 API 行为仍需人工环境复核。

## 提交门禁

未经人工确认不创建提交、不 push、不开始 P09。建议确认后拆为：

1. `build(p08): establish TypeScript 5.9 config boundaries`
2. `docs(p08): record TypeScript transition evidence`

## 确认记录

- [ ] 人工已审阅代码和 P08 文档；
- [ ] 人工已完成或接受未完成的运行路径检查；
- [ ] 人工授权创建上述 P08 提交。
