import * as React from "react";
import { Link } from "react-router";

import { UserAreaLoading } from "@application/layouts/user-area";
import { getBoardName } from "@modules/board/api/service";
import { getToken } from "@modules/session/api/session";
import { cc98Fetch } from "@foundation/api/http";
import styles from "./UserRecentPostsManager.module.scss";

interface UserRecentPostsManagerProps {
  /**
   * 用户id
   */
  id: number;
}

interface ManagedPost {
  /**
   * 版面ID
   */
  boardId: number;
  /**
   * 回复内容
   */
  content: string;
  /**
   * 回复楼层
   */
  floor: number;
  /**
   * IP地址
   */
  ip: string;
  /**
   * 回复时间
   */
  time: string;
  /**
   * 主题id
   */
  topicId: number;
  /**
   * 版面名
   */
  boardName: string;
}

interface ManagedPostResponse {
  postInfos: Omit<ManagedPost, "boardName">[];
  count: number;
}

/**
 * 显示用户X日内所有帖子的组件
 */
export function UserRecentPostsManager({
  id,
}: UserRecentPostsManagerProps) {
  const [days, setDays] = React.useState(1);
  const [info, setInfo] = React.useState("");
  const [count, setCount] = React.useState(0);
  const [from, setFrom] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [posts, setPosts] = React.useState<ManagedPost[]>([]);
  const [gotoPage, setGotoPage] = React.useState(1);
  const requestIdRef = React.useRef(0);

  const handleSubmit = async (targetFrom: number) => {
    const currentRequestId = ++requestIdRef.current;
    setIsLoading(true);

    try {
      const token = await getToken();
      const headers = new Headers();
      headers.append("Authorization", token);
      const response = await cc98Fetch(
        `/User/${id}/post?days=${days}&from=${targetFrom}&size=10`,
        { headers }
      );
      const data = (await response.json()) as ManagedPostResponse;
      const loadedPosts = await Promise.all(
        data.postInfos.map(async (item) => ({
          ...item,
          boardName: await getBoardName(item.boardId),
        }))
      );
      if (currentRequestId !== requestIdRef.current) return;

      setPosts(loadedPosts);
      setCount(data.count);
      setInfo(loadedPosts.length === 0 ? "啥也没有" : "");
      setFrom(targetFrom);
      setGotoPage(targetFrom / 10 + 1);
    } catch (error) {
      if (currentRequestId !== requestIdRef.current) return;
      setInfo(error instanceof Error ? error.message : String(error));
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  };

  const handleGotoPageChange = (value: string) => {
    let page = Number.parseInt(value);
    const maxPage = Math.floor((count + 9) / 10);
    if (page < 1) {
      page = 1;
    } else if (page > maxPage) {
      page = maxPage;
    }
    setGotoPage(page);
  };

  return (
    <div>
      <h2>查看用户最近发言</h2>
      <div className={styles["user-manager"]}>
        <p>天数：</p>
        <input
          type="number"
          onChange={(event) =>
            setDays(Number.parseInt(event.target.value))
          }
          value={days}
        />
        <button type="button" onClick={() => void handleSubmit(0)}>
          查看
        </button>
        <button
          type="button"
          disabled={from === 0}
          onClick={() => void handleSubmit(from - 10)}
        >
          上一页
        </button>
        <button
          type="button"
          disabled={from + posts.length === count}
          onClick={() => void handleSubmit(from + 10)}
        >
          下一页
        </button>
        <p>页数：</p>
        <input
          type="number"
          onChange={(event) => handleGotoPageChange(event.target.value)}
          value={gotoPage}
        />
        <button
          type="button"
          disabled={posts.length === 0}
          onClick={() => void handleSubmit((gotoPage - 1) * 10)}
        >
          跳转
        </button>
      </div>
      <div className={styles["user-manage-return"]}>
        <p>{info}</p>
      </div>
      {!isLoading ? (
        <div>
          {posts.map((item) => (
            <div
              className={styles["user-manage-post"]}
              key={`${item.topicId}-${item.floor}-${item.time}`}
            >
              <p className={styles["user-manage-post-date"]}>
                {item.time.slice(0, 19).replace("T", " ")}
              </p>
              {item.floor === -1 ? (
                <p
                  className={styles["user-manage-post-content"]}
                  title={item.content.slice(0, 1000)}
                >
                  {item.content}
                </p>
              ) : (
                <Link
                  className={styles["user-manage-post-content"]}
                  to={`/topic/${item.topicId}/${
                    Math.floor((item.floor - 1) / 10) + 1
                  }#${item.floor % 10 === 0 ? 10 : item.floor % 10}`}
                  title={item.content.slice(0, 1000)}
                  target="_blank"
                >
                  {item.content}
                </Link>
              )}
              <Link
                className={styles["user-manage-post-board"]}
                to={`/board/${item.boardId}`}
                target="_blank"
              >
                {item.boardName}
              </Link>
              <p className={styles["user-manage-post-floor"]}>
                {item.floor === -1 ? "已删除" : item.floor}
              </p>
              <p className={styles["user-manage-post-ip"]}>{item.ip}</p>
            </div>
          ))}
          {posts.length > 0 ? (
            <p style={{ textAlign: "right" }}>
              总共有{count}条帖子，当前显示第{Math.floor(from / 10) + 1}
              页，共{Math.floor(count / 10) + 1}页
            </p>
          ) : null}
        </div>
      ) : (
        <UserAreaLoading />
      )}
    </div>
  );
}
