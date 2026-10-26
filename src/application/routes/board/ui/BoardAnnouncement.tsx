import * as React from "react";
import { unstable_batchedUpdates } from "react-dom";
import { Accordion } from "@foundation/ui/accordion";
import { Button } from "@foundation/ui/button";
import { Divider } from "@foundation/ui/divider";
import { Tag } from "@foundation/ui/tag";
import {
  editBigPaper,
  isMaster,
} from "@modules/board/api/service";
import { type BoardInfo } from "@modules/board/model/types";
import {
  followBoard,
  isFollowThisBoard,
  unfollowBoard,
} from "@modules/follow/api/service";
import { UbbCodeOptions } from "@modules/ubb/engine/Core";
import { UbbContainer } from "@modules/ubb/UbbContainer";
import { BoardAnnouncementEditorDialog } from "./BoardAnnouncementEditorDialog";
import styles from "./BoardAnnouncement.module.scss";

interface BoardAnnouncementProps {
  data: BoardInfo;
  isFirstPage: boolean;
}

export function BoardAnnouncement(
  props: BoardAnnouncementProps,
): React.ReactElement {
  const { data, isFirstPage } = props;
  const [isFollow, setIsFollow] = React.useState(() =>
    isFollowThisBoard(data.id),
  );
  const [loading, setLoading] = React.useState(false);
  const [editVisible, setEditVisible] = React.useState(false);

  const onError = (event) => {
    event.preventDefault();
    event.target.src = "/static/images/_CC98.png";
  };

  const generateMasters = (item) => {
    const name = item.toString();
    const userName = encodeURIComponent(item.toString());
    const webUrl = `/user/name/${userName}`;
    return (
      <div key={name} className={styles.masterItem}>
        <a href={webUrl}>{name}</a>
      </div>
    );
  };

  const follow = async () => {
    setLoading(true);
    await followBoard(data.id);
    unstable_batchedUpdates(() => {
      setIsFollow(true);
      setLoading(false);
    });
  };

  const unfollow = async () => {
    setLoading(true);
    await unfollowBoard(data.id);
    unstable_batchedUpdates(() => {
      setIsFollow(false);
      setLoading(false);
    });
  };

  const url = `/static/images/_${data.name}.png`;
  const boardMaster = isMaster(data.boardMasters);
  const shortHand = (
    <div className={styles.summary}>
      <div>
        <img className={styles["board-avatar"]} onError={onError} src={url} />
      </div>

      <div className={styles["board-head-name"]}>{data.name}</div>

      <Divider type="vertical" />

      <div className={styles.description}>
        <div>版面简介：{data.description}</div>
        <div className={styles.masters}>
          版主：{data.boardMasters.map(generateMasters)}
        </div>
      </div>

      <div className={styles.actions}>
        <div className={styles.metrics}>
          <div className={styles.metricRow}>
            <Tag
              className={`${styles.metricTag} ${styles.metricLabel}`}
              color="grey"
            >
              今日贴数
            </Tag>
            <Tag
              className={`${styles.metricTag} ${styles.metricValue}`}
            >
              {data.todayCount}
            </Tag>
          </div>
          <div className={styles.metricRow}>
            <Tag
              className={`${styles.metricTag} ${styles.metricLabel}`}
              color="grey"
            >
              总主题数
            </Tag>
            <Tag
              className={`${styles.metricTag} ${styles.metricValue}`}
            >
              {data.topicCount}
            </Tag>
          </div>
        </div>
        <Button
          loading={loading}
          onClick={isFollow ? unfollow : follow}
        >
          <span>{isFollow ? "取 关" : "关 注"}</span>
        </Button>
        {boardMaster && (
          <Button
            className={styles.editButton}
            onClick={() => setEditVisible(true)}
          >
            <span>编 辑</span>
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className={styles.announcementRoot}>
      <BoardAnnouncementEditorDialog
        open={editVisible}
        onOpenChange={setEditVisible}
        initialContent={data.bigPaper}
        save={(nextContent) =>
          editBigPaper(data.id.toString(), nextContent)
        }
      />
      <Accordion
        className={styles["board-bigpaper"]}
        bordered={false}
        showIndicator={false}
        defaultExpandedIds={isFirstPage ? ["1"] : []}
        items={[{
          id: "1",
          heading: shortHand,
          interactiveHeading: true,
          toggleLabel: "展开或收起版面公告",
          className: styles.accordionItem,
          panelClassName: styles.boardBigPaperPanel,
          contentClassName: styles.boardBigPaperContent,
          content: data.bigPaper ? (
            <>
              <Divider />
              <UbbContainer
                code={data.bigPaper}
                options={{ ...new UbbCodeOptions(), allowToolbox: false }}
              />
            </>
          ) : null,
        }]}
      />
    </div>
  );
}
