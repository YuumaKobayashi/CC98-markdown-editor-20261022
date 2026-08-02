import * as React from "react";

import { getToken } from "@modules/session";
import { ForumUserOperationType, UserState } from "@modules/user";
import { cc98Fetch } from "@foundation/api/http";
import styles from "./UserPunishmentForm.module.scss";

interface ForumUserOperation {
  /**
   * 1=锁定，2=屏蔽，3=tp
   */
  PunishmentType?: UserState.Locked | UserState.Shielded | UserState.StopPost;
  /**
   * 0=取消，1=执行
   */
  OperationType?: ForumUserOperationType;
  /**
   * -1表示永久，其余7<Days<1000
   */
  Days?: number;
  /**
   * 理由
   */
  Reason?: string;
}

interface UserPunishmentFormProps {
  /**
   * 用户的ID
   */
  id: number;
}

/**
 * 对用户进行TP、禁言等操作的组件
 */
export function UserPunishmentForm({ id }: UserPunishmentFormProps) {
  const [operation, setOperation] = React.useState<ForumUserOperation>({});
  const [info, setInfo] = React.useState("");

  const handleOperationChange = (
    key: keyof ForumUserOperation,
    value: string | number
  ) => {
    setOperation((previousOperation) => ({
      ...previousOperation,
      [key]: value,
    }));
  };

  /**
   * 提交时调用的函数
   * @param isCancel 表示是否为取消操作
   */
  const handleSubmit = async (isCancel: boolean) => {
    const { Days, PunishmentType, Reason } = operation;
    try {
      if (!Reason) {
        throw new Error("请填写理由");
      }
      if (
        !isCancel &&
        PunishmentType === UserState.StopPost &&
        (Days < -1 || Days > 1000 || (Days < 7 && Days > -1))
      ) {
        throw new Error("不合法的TP天数");
      }

      const token = await getToken();
      const headers = new Headers();
      headers.append("Authorization", token);
      headers.append("Content-Type", "application/json");
      const response = await cc98Fetch(`/user/${id}/operation`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          ...operation,
          OperationType: isCancel
            ? ForumUserOperationType.Cancel
            : ForumUserOperationType.Do,
        }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }
      setInfo("操作成功");
    } catch (error) {
      setInfo(error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <div>
      <h2>TP</h2>
      <div className={styles["user-manager"]}>
        <p>OperationType: </p>
        <select
          value={operation.PunishmentType || UserState.Normal}
          onChange={(event) =>
            handleOperationChange(
              "PunishmentType",
              Number.parseInt(event.target.value)
            )
          }
        >
          <option value={UserState.Normal} disabled>
            未选择
          </option>
          <option value={UserState.Locked}>锁定</option>
          <option value={UserState.Shielded}>屏蔽</option>
          <option value={UserState.StopPost}>TP</option>
        </select>
        <p>Reason: </p>
        <input
          type="text"
          onChange={(event) =>
            handleOperationChange("Reason", event.target.value)
          }
          value={operation.Reason ?? ""}
        />
        <p>Days: </p>
        <input
          type="number"
          onChange={(event) =>
            handleOperationChange(
              "Days",
              Number.parseInt(event.target.value)
            )
          }
          value={operation.Days ?? ""}
        />
        <button type="button" onClick={() => void handleSubmit(false)}>
          提交
        </button>
        <button type="button" onClick={() => void handleSubmit(true)}>
          解除
        </button>
      </div>
      <p className={styles["user-manage-return"]}>{info}</p>
    </div>
  );
}
