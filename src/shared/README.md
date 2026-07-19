# shared

无业务 owner 的 API 基础设施、运行时配置、存储适配、主题、纯函数和通用视觉能力。

`shared` 不得 import Store、Router、业务组件、entities 或 features。P06 只定义 `shared/ui` 边界；P12 的 AntD 图标按调用点直接使用官方组件，没有为图标建立 shared adapter。
