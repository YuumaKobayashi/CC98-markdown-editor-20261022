import type { ChangeUserInfo, UserInfo } from "@modules/user";

/**
 * 个人资料设置页使用的可编辑数据。
 *
 * `ChangeUserInfo` 包含修改 API 接收的字段；这里额外保存拆分后的生日和
 * 用户可选头衔，方便表单分别展示和修改。这些额外字段不是修改 API 的必需字段。
 */
export interface EditableUserInfo extends ChangeUserInfo {
  /** 出生年份：0 表示未填写，9999 表示保密。 */
  birthdayYear: number;
  /** 出生月份。 */
  birthdayMonth: number;
  /** 出生日期。 */
  birthdayDay: number;
  /** 当前用户可以选择的头衔 ID。 */
  userTitleIds: number[];
}

/**
 * 将获取用户信息 API 返回的 `UserInfo` 转换成设置表单使用的数据结构。
 *
 * 获取 API 与修改 API 的字段命名不同，因此需要在这里集中完成字段映射，
 * 同时把生日拆成年、月、日供表单编辑；提交时再重新合并为 `Birthday`。
 *
 * @param userInfo store 中保存的当前用户信息
 * @param useDisplayTitleFallback 是否在头衔 ID 为空时回退为 0。首次创建表单时
 * 使用回退值；重置表单时保留原值，以延续旧组件的行为
 */
export const createEditableUserInfo = (
  userInfo: UserInfo,
  useDisplayTitleFallback: boolean
): EditableUserInfo => ({
  // UserInfo 使用小驼峰字段，修改 API 使用首字母大写字段。
  EmailAddress: userInfo.emailAddress,
  Gender: userInfo.gender,
  Introduction: userInfo.introduction,
  QQ: userInfo.qq,
  SignatureCode: userInfo.signatureCode,
  Birthday: userInfo.birthday,
  // 没有填写生日时，三个表单字段都使用 0。
  birthdayYear: userInfo.birthday
    ? Number.parseInt(userInfo.birthday.slice(0, 4))
    : 0,
  birthdayMonth: userInfo.birthday
    ? Number.parseInt(userInfo.birthday.slice(5, 7))
    : 0,
  birthdayDay: userInfo.birthday
    ? Number.parseInt(userInfo.birthday.slice(8, 10))
    : 0,
  DisplayTitleId: useDisplayTitleFallback
    ? userInfo.displayTitleId || 0
    : userInfo.displayTitleId,
  userTitleIds: userInfo.userTitleIds || [],
});
