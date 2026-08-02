# P14 公开路由映射

> 路径大小写匹配沿用 Router 默认行为；`/*` 用于明确承接旧 Router 4 非 `exact` route 的前缀语义。

## 根级 route

| 路径 | 页面/行为 |
| --- | --- |
| `/` | MainPage |
| `/topic/hot-monthly`、`hot-weekly`、`hot-history` | 热门主题页 |
| `/topic/:topicid/:page?` | Topic |
| `/topic/:topicId/postid/:postId/:page?` | Topic trace |
| `/list/:boardId/:type?/:page?/*` | legacy Board list owner |
| `/boardlist` | BoardList |
| `/usercenter/*` | UserCenter layout 与子 route |
| `/message/*` | Message layout 与子 route |
| `/focus/*` | Focus layout 与子 route |
| `/newtopics/*`、`/recommendedtopics/*` | 新主题/精选主题 |
| `/user/:method/:id/*` | 用户页与管理子 route |
| `/logon`、`/signin/*` | 登录/注册 |
| `/search/*`、`/searchBoard/*` | 搜索 |
| `/sitemanage/*` | 站点管理 |
| `/editor/:mode/:id?/*` | 编辑器 |
| `/board/:id/:page?/*` | Pages/Board owner |
| `/error/401/*` | UnauthorizedBoard |
| `/index/*` | Index |
| `*` | PageNotFound |

## 嵌套 route

- UserCenter：默认页、followings、fans、topics、history、posts、favorites、config、custom boards、transfer wealth、theme；旧 fallback redirect 保持 `/myposts/ishot/0` 与 `/myfavorites/order/0/group/0`。
- Message：默认 response，以及 response、attme、system、message、setting。
- Focus：默认 board，以及 board、user、favorite。
- User：默认详情，以及 manage。

## 代表匹配审计

`matchRoutes` 已覆盖根页、热门主题、普通 Topic、post trace、`/list/81`、`/boardList`、UserCenter 默认页与分页、Message 默认页与分页、Focus、User 详情与 manage、editor、两类 Board URL、searchBoard 和未知路径。参数 `topicid/topicId/postId/page/boardId/id` 及 legacy Board 尾部 splat 均按声明得到匹配。
