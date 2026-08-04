import * as React from "react";

import { deleteRecentUserContent } from "@modules/moderation/api/service";
import styles from "./DeleteRecentUserContent.module.scss";

interface DeleteRecentUserContentProps {
  /**
   * 用户ID
   */
  id: number;
}

/**
 * 只有管理员能看到
 * 用来删除用户的最近X日内的主题和帖子
 */
export function DeleteRecentUserContent({
  id,
}: DeleteRecentUserContentProps) {
  const [days, setDays] = React.useState(0);
  const [info, setInfo] = React.useState("");

  /**
   * isPost为true 时删除主题
   * isPost为false时删除帖子
   */
  const handleSubmit = async (isPost: boolean) => {
    try {
      const item = isPost ? "post" : "topic";
      if (days < 1 || days > 365) {
        throw new Error("请检查日期");
      }

      const response = await deleteRecentUserContent(id, item, days);
      const deletedCount = await response.json();
      setInfo(`删掉了${deletedCount}条${item}`);
    } catch (error) {
      setInfo(error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <div>
      <h2>删除用户最近主题与回帖</h2>
      <div className={styles["user-manager"]}>
        <p>天数：</p>
        <input
          type="number"
          onChange={(event) =>
            setDays(Number.parseInt(event.target.value))
          }
          value={days}
        />
        <button type="button" onClick={() => void handleSubmit(false)}>
          删主题
        </button>
        <button type="button" onClick={() => void handleSubmit(true)}>
          删回复
        </button>
      </div>
      <p className={styles["user-manage-return"]}>{info}</p>
    </div>
  );
}
