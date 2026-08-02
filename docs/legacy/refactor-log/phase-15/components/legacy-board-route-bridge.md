# Legacy Board Route Bridge

- 旧位置：`Components/Board/Board.tsx` 文件内 `RouteComponent` class。
- 新 owner：不新增业务 owner；兼容 facade 转导根 `Components/RouteComponent`。
- 运行入口：Router 直接加载 `LegacyBoardPage`，不再使用该 bridge。
- 行为：旧导入方仍可取得同名符号；根 bridge 的兼容合同不改。

人工重点：确认剩余 legacy 调用方编译及旧导出形状。
