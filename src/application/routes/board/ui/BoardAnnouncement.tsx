import * as React from "react";
import { unstable_batchedUpdates } from "react-dom";
import { Button, Collapse, Divider, Input, Modal, Tag } from "antd";
import { IBoard } from "@cc98/api";
import { isMaster } from "@modules/board";
import {
  followBoard,
  isFollowThisBoard,
  unfollowBoard,
} from "@modules/follow";
import { UbbContainer } from "@legacy/Components/UbbContainer";
import { UbbCodeOptions } from "@legacy/Ubb/UbbCodeExtension";
import styles from "./BoardAnnouncement.module.scss";
import { editBigPaper } from "../api/service";

const Panel = Collapse.Panel;
const TextArea = Input.TextArea;

interface BoardAnnouncementProps {
  data: IBoard;
  isFirstPage: boolean;
}

const customPanelStyle = {
  background: "#f7f7f7",
  borderRadius: 4,
  marginBottom: 24,
  border: 0,
  overflow: "hidden",
  width: "100%",
};

export function BoardAnnouncement(
  props: BoardAnnouncementProps,
): React.ReactElement {
  const { data, isFirstPage } = props;
  const [isFollow, setIsFollow] = React.useState(() =>
    isFollowThisBoard(data.id),
  );
  const [loading, setLoading] = React.useState(false);
  const [editVisible, setEditVisible] = React.useState(false);
  const [content, setContent] = React.useState(() => data.bigPaper);

  const onError = (event) => {
    event.preventDefault();
    event.target.src = "/static/images/_CC98.png";
  };

  const generateMasters = (item) => {
    const name = item.toString();
    const userName = encodeURIComponent(item.toString());
    const webUrl = `/user/name/${userName}`;
    return (
      <div style={{ marginRight: "10px", fontSize: "0.75rem" }}>
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

  const submitBigPaper = async () => {
    await editBigPaper(data.id.toString(), content);
    setEditVisible(false);
  };

  const url = `/static/images/_${data.name}.png`;
  const boardMaster = isMaster(data.boardMasters);
  const shortHand = (
    <div className="cc98-row" style={{ height: "4rem" }}>
      <div>
        <img className={styles["board-avatar"]} onError={onError} src={url} />
      </div>

      <div className={styles["board-head-name"]}>{data.name}</div>

      <Divider type="vertical" />

      <div
        className="cc98-column"
        style={{ marginLeft: "1rem", marginRight: "1rem" }}
      >
        <div>版面简介：{data.description}</div>
        <div className="cc98-row" style={{ flexWrap: "wrap" }}>
          版主：{data.boardMasters.map(generateMasters)}
        </div>
      </div>

      <div
        className="cc98-row"
        style={{
          marginRight: "1rem",
          flexGrow: 2,
          justifyContent: "flex-end",
          height: "100%",
        }}
      >
        <div
          className="cc98-column"
          style={{
            marginLeft: "1rem",
            marginRight: "1rem",
            height: "100%",
            justifyContent: "space-around",
          }}
        >
          <div className="cc98-row">
            <Tag
              color="grey"
              style={{
                width: "5rem",
                textAlign: "center",
                marginRight: 0,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              }}
            >
              今日贴数
            </Tag>
            <Tag
              className={styles.boardHeadInformation}
              style={{
                width: "5rem",
                textAlign: "center",
                marginRight: 0,
                borderLeft: 0,
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
              }}
            >
              {data.todayCount}
            </Tag>
          </div>
          <div className="cc98-row">
            <Tag
              color="grey"
              style={{
                width: "5rem",
                textAlign: "center",
                marginRight: 0,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              }}
            >
              总主题数
            </Tag>
            <Tag
              className={styles.boardHeadInformation}
              style={{
                width: "5rem",
                textAlign: "center",
                marginRight: 0,
                borderLeft: 0,
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
              }}
            >
              {data.topicCount}
            </Tag>
          </div>
        </div>
        <Button
          loading={loading}
          onClick={isFollow ? unfollow : follow}
        >
          {isFollow ? "取关" : "关注"}
        </Button>
        {boardMaster && (
          <Button
            style={{ marginLeft: "0.5rem" }}
            onClick={() => setEditVisible(true)}
          >
            编辑
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ width: "100%" }}>
      <Modal
        title="编辑大字报"
        open={editVisible}
        onOk={submitBigPaper}
        onCancel={() => setEditVisible(false)}
        width={"50rem"}
      >
        支持UBB代码
        <TextArea
          rows={6}
          defaultValue={data.bigPaper}
          onChange={(event) => setContent(event.target.value)}
        />
        <UbbContainer
          code={content}
          options={{ ...new UbbCodeOptions(), allowToolbox: false }}
        />
      </Modal>
      <Collapse
        className={styles["board-bigpaper"]}
        bordered={false}
        defaultActiveKey={isFirstPage ? ["1"] : []}
      >
        <Panel
          key="1"
          showArrow={false}
          header={shortHand}
          style={customPanelStyle}
        >
          {data.bigPaper && (
            <>
              <Divider />
              <UbbContainer
                code={data.bigPaper}
                options={{ ...new UbbCodeOptions(), allowToolbox: false }}
              />
            </>
          )}
        </Panel>
      </Collapse>
    </div>
  );
}
