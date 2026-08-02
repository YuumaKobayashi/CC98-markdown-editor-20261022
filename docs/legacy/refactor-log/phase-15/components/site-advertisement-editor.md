# SiteAdvertisementEditor

- 旧位置：`Components/SiteManage/Advertisement.tsx` anonymous default class。
- 新 owner：`pages/site-manage/advertisement` 具名函数。
- 状态：栏目、分页、列表和提示使用 hooks；单元格改为不可变数组更新。
- 修复：快速切换栏目时忽略旧结果；新增 ID 使用当前最大值加一，空列表也可新增。
- 行为：栏目 URL、字段可见条件、POST/PUT、分页与文案保持不变；旧路径保留 default re-export。

人工重点：四类栏目切换、分页编辑、新增、保存、可见性和空列表新增。
