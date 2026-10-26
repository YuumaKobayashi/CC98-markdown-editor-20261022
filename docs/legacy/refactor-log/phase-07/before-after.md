# P07 前后对照

## Utility 形态

- 前：`Utility.tsx` 约 4,000 行，同时包含 JSX、HTTP、storage、主题、DOM、领域请求和 Store dispatch。
- 后：根 `Utility.ts` 只做迁移期 re-export；实现分布在 17 个 entity/feature owner 模块和 shared 基础模块中。
- 前：118 个文件直接 import Utility barrel，另有少量旧子路径消费者。
- 后：遗留消费者继续通过 facade/shim 编译，新 `src` 实现只 import owner 模块。

## 三个已确认环

1. `Store → Reducers/UserInfo → Utility → Store`
   - `UserInfo` reducer 直接使用 auth、web-storage 和 user-cache；
   - Utility service 通过 `legacy-utility-effects` 端口请求应用副作用；
   - 只有 `src/app/legacy/register-utility-effects.ts` 组合 Store/actions/history。
2. `Board → Utility → Board`
   - Utility 不再 import Board；
   - 零调用的 `convertHotTopic` 不再进入 facade，Board 保持渲染 owner。
3. `Theme → Utility → Theme`
   - theme list/day-night registry 迁入 `shared/theme/registry`；
   - Theme 组件和 theme runtime 分别直接依赖 shared 模块，Utility 不再 import Theme。

## 副作用兼容

- 全局错误码仍在原分支触发，只把 `store.dispatch(throwError(...))` 改为端口调用；
- token 刷新失败仍按原顺序清 storage、dispatch logoff、导航 `/logon`；
- `refreshUserInfo` 仍 dispatch 完整 userInfo 并写回同一 storage key；
- `readAll` 和标题闪烁仍读取同一 message state，并通过 app adapter 清零原计数；
- API URL、请求方法、body、返回结构和 catch 行为未主动调整。
