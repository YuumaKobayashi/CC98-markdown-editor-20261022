import * as React from "react";
import { Link } from "react-router";

import { isMaster } from "@modules/board";
import {
  followBoard,
  isFollowThisBoard,
  unfollowBoard,
} from "@modules/follow";
import { UbbContainer } from "@legacy/Components/UbbContainer";

import { editBigPaper } from "../../api/service";

interface LegacyBoardHeaderProps {
  boardId: any;
  boardInfo: any;
}

export function LegacyBoardHeader({
  boardId,
  boardInfo,
}: LegacyBoardHeaderProps) {
  const [isFollow, setIsFollow] = React.useState(() =>
    isFollowThisBoard(boardId)
  );
  const [isExtend, setIsExtend] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [currentDescription, setCurrentDescription] = React.useState(
    boardInfo.bigPaper
  );
  const [info, setInfo] = React.useState("");

  const follow = async () => {
    await followBoard(boardId);
    setIsFollow(true);
  };

  const unfollow = async () => {
    await unfollowBoard(boardId);
    setIsFollow(false);
  };

  const renderMaster = (item) => {
    const name = item.toString();
    const userName = encodeURIComponent(name);
    return (
      <div style={{ marginRight: "10px", fontSize: "0.75rem" }}>
        <a
          style={{ color: isExtend ? "#fff" : "#000" }}
          href={`/user/name/${userName}`}
        >
          {name}
        </a>
      </div>
    );
  };

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.preventDefault();
    event.currentTarget.src = "/static/images/_CC98.png";
  };

  const changeBigPaper = async () => {
    try {
      const response = await editBigPaper(boardId, currentDescription);
      if (response.status === 200) {
        setInfo("修改成功");
      } else {
        throw new Error();
      }
    } catch (error: any) {
      setInfo(`修改失败 ${error.message}`);
    }
  };

  const boardUrl = `/board/${boardId}`;
  const imageUrl = `/static/images/_${boardInfo.name}.png`;
  const canManage = isMaster(boardInfo.boardMasters);
  const boardName = (
    <div
      className="row"
      style={{
        width: "100%",
        ...(boardInfo && boardInfo.name.length > 8
          ? { fontSize: "14px" }
          : {}),
      }}
    >
      {boardInfo.name}
    </div>
  );

  if (!isExtend) {
    return (
      <div
        className="row"
        style={{
          width: "100%",
          overflow: "hidden",
          maxHeight: "6rem",
          transition: "max-height 1s",
        }}
      >
        <Link to={boardUrl}>
          <div className="boardMessage">
            <div className="row" style={{ height: "4rem", marginTop: "1.25rem" }}>
              <img
                style={{ marginLeft: "1.25rem" }}
                onError={handleImageError}
                src={imageUrl}
              />
              <div className="boardMessageDetails">
                {boardName}
                <div
                  className="row"
                  style={{ width: "100%", alignItems: "center" }}
                >
                  <div style={{ fontSize: "0.75rem", width: "4.5rem" }}>
                    {boardInfo.todayCount}/{boardInfo.topicCount}
                  </div>
                  <div
                    className="boardFollow"
                    onClick={isFollow ? unfollow : follow}
                  >
                    {isFollow ? "取关" : "关注"}{" "}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
        <div className="bigPaper" style={{ display: "block" }}>
          {boardInfo.bigPaper ? (
            <button
              className="fa fa-angle-double-down"
              style={{
                float: "right",
                backgroundColor: "#fff",
                cursor: "pointer",
                border: "none",
              }}
              type="button"
              onClick={() => setIsExtend(true)}
            >
              展开
            </button>
          ) : canManage ? (
            <button
              style={{ float: "right" }}
              type="button"
              onClick={() => {
                setIsEditing(true);
                setIsExtend(true);
              }}
            >
              编辑
            </button>
          ) : null}
          <div>
            <div>版面简介：{boardInfo.description}</div>
          </div>
          <div>
            <div
              style={{
                display: "flex",
                marginTop: ".5rem",
                fontSize: "0.75rem",
              }}
            >
              版主：{boardInfo.boardMasters.map(renderMaster)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="row"
      style={{
        width: "100%",
        overflow: "hidden",
        maxHeight: "50rem",
        transition: "max-height 1.5s",
      }}
    >
      <div className="boardMessage">
        <div className="row" style={{ height: "4rem", marginTop: "1.25rem" }}>
          <img
            style={{ marginLeft: "1.25rem" }}
            onError={handleImageError}
            src={imageUrl}
          />
          <div className="boardMessageDetails">
            <div className="row" style={{ width: "100%" }}>
              {boardInfo.name}
            </div>
            <div
              className="row"
              style={{ width: "100%", alignItems: "center" }}
            >
              <div style={{ fontSize: "0.75rem", width: "4.5rem" }}>
                {boardInfo.todayCount}/{boardInfo.topicCount}
              </div>
              <div
                className="boardFollow"
                onClick={isFollow ? unfollow : follow}
              >
                {isFollow ? "取关" : "关注"}{" "}
              </div>
            </div>
          </div>
        </div>
        <div className="boardDescription">
          <div>{boardInfo.description}</div>
        </div>
        <div className="boardMasters">
          <div>版主</div>
          <div>{boardInfo.boardMasters.map(renderMaster)}</div>
        </div>
      </div>
      <div className="bigPaper" style={{ display: "block" }}>
        <button
          className="fa fa-angle-double-up"
          style={{
            float: "right",
            backgroundColor: "#fff",
            cursor: "pointer",
            border: "none",
          }}
          type="button"
          onClick={() => setIsExtend(false)}
        >
          收起
        </button>
        <div className="bigPaperTitle">
          {canManage ? (
            <button type="button" onClick={() => setIsEditing(true)}>
              编辑
            </button>
          ) : null}
          {isEditing ? (
            <button type="button" onClick={() => void changeBigPaper()}>
              提交
            </button>
          ) : null}
          <p>{info}</p>
        </div>
        {isEditing ? (
          <div>
            <textarea
              style={{ width: "50rem", height: "15rem", resize: "none" }}
              defaultValue={currentDescription}
              onChange={(event) => setCurrentDescription(event.target.value)}
            />
          </div>
        ) : (
          <div style={{ maxWidth: "53.25rem" }}>
            <UbbContainer code={boardInfo.bigPaper} />
          </div>
        )}
      </div>
    </div>
  );
}
