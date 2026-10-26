import * as React from "react";
import { getShortTopic } from "@modules/post/api/service";
import { type PostInfo } from "@modules/post/model/dto";
import type { TopicInfo } from "@modules/topic/model/dto";
import { Spinner as Spin } from "@foundation/ui/spinner";
import { Link } from "react-router";

import { UbbCodeOptions } from "@modules/ubb/engine/Core";
import { UbbContainer } from "@modules/ubb/UbbContainer";

import styles from "./BoardTopicPreviewCard.module.scss";

interface BoardTopicPreviewCardProps {
  data: TopicInfo;
}

export function BoardTopicPreviewCard({
  data,
}: BoardTopicPreviewCardProps) {
  const [posts, setPosts] = React.useState<any>([]);

  React.useEffect(() => {
    const loadPosts = async () => {
      const nextPosts = await getShortTopic(data.id);
      setPosts(nextPosts);
    };

    void loadPosts();
  }, []);

  return posts.length === 0 ? (
    <Spin size="large" />
  ) : (
    <div className={styles["board-postItem-cards"]}>
      {posts.map((item: PostInfo) => (
        <BoardTopicPreviewPost key={item.id} item={item} />
      ))}
    </div>
  );
}

function BoardTopicPreviewPost({ item }: { item: PostInfo }) {
  return (
    <div className={styles["board-postItem-card-body"]}>
      <div className={styles["board-postItem-card-information"]}>
        <div>{item.floor}L</div>
        <Link to={`/user/id/${item.userId}`}>
          <div className={styles["board-postItem-card-username"]}>
            {item.userName}
          </div>
        </Link>
      </div>
      <div className={styles["board-postItem-card-content"]}>
        <UbbContainer
          code={item.content}
          options={{ ...new UbbCodeOptions(), allowToolbox: false }}
        />
      </div>
    </div>
  );
}
