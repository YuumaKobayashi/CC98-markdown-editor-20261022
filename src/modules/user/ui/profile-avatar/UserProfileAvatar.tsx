import * as React from "react";
import { Link } from "react-router";

import type { UserInfo } from "@legacy/States/AppState";
import { cc98Fetch } from "@foundation/api/http";

interface DisplayTitle {
  id: number;
  name: string;
}

interface PortraitData {
  [title: string]: {
    imageUrl: string;
  };
}

interface PortraitFrame {
  title: string;
  style: React.CSSProperties;
}

interface UserProfileAvatarProps {
  /**
   * 用户信息
   */
  userInfo: UserInfo;
}

const standardFrameStyle: React.CSSProperties = {
  width: "15rem",
  position: "absolute",
  top: "-2rem",
  left: "-1.75rem",
};

const portraitFrames: Record<number, PortraitFrame> = {
  82: {
    title: "吉祥物",
    style: { width: "13.32rem", position: "absolute", top: "-1.45rem" },
  },
  18: { title: "版主", style: standardFrameStyle },
  22: { title: "版主", style: standardFrameStyle },
  32: {
    title: "站务组",
    style: {
      width: "15.2rem",
      position: "absolute",
      top: "-2.5rem",
      left: "-2.75rem",
    },
  },
  21: {
    title: "站务组",
    style: {
      width: "15.2rem",
      position: "absolute",
      top: "-2.5rem",
      left: "-2.75rem",
    },
  },
  28: { title: "贵宾", style: standardFrameStyle },
  16: { title: "贵宾", style: standardFrameStyle },
  37: {
    title: "技术组",
    style: {
      width: "13rem",
      position: "absolute",
      top: "-1.4rem",
      left: "-1.2rem",
    },
  },
  23: {
    title: "技术组",
    style: {
      width: "13rem",
      position: "absolute",
      top: "-1.4rem",
      left: "-1.2rem",
    },
  },
  85: { title: "编辑部", style: standardFrameStyle },
  29: { title: "编辑部", style: standardFrameStyle },
  84: { title: "策划部", style: standardFrameStyle },
  34: { title: "策划部", style: standardFrameStyle },
  94: { title: "办公室", style: standardFrameStyle },
  93: { title: "办公室", style: standardFrameStyle },
  35: { title: "体育部", style: standardFrameStyle },
  86: { title: "体育部", style: standardFrameStyle },
  96: { title: "影音部", style: standardFrameStyle },
  99: { title: "影音部", style: standardFrameStyle },
  91: { title: "认证用户", style: standardFrameStyle },
  104: {
    title: "年度用户",
    style: {
      width: "15rem",
      position: "absolute",
      top: "-2rem",
      left: "-2rem",
    },
  },
};

//用户中心主页用户头像与徽章组件
export function UserProfileAvatar({ userInfo }: UserProfileAvatarProps) {
  const [displayTitles, setDisplayTitles] = React.useState<DisplayTitle[]>([]);
  const [portraitUrl, setPortraitUrl] = React.useState("");
  const [portraitStyle, setPortraitStyle] =
    React.useState<React.CSSProperties>({});

  React.useEffect(() => {
    let active = true;

    const loadTitlesAndPortrait = async () => {
      try {
        const titleResponse = await cc98Fetch(
          "/config/global/all-user-title"
        );
        const titles = (await titleResponse.json()) as DisplayTitle[];
        if (!active) return;
        setDisplayTitles(titles);
        setPortraitUrl("");
        setPortraitStyle({});

        const frame = portraitFrames[userInfo.displayTitleId];
        const hasTitle = titles.some(
          (item) => item.id === userInfo.displayTitleId
        );
        if (!frame || !hasTitle) return;

        const portraitResponse = await fetch("/static/portrait.json");
        const portraits = (await portraitResponse.json()) as PortraitData;
        if (!active) return;

        setPortraitUrl(portraits[frame.title]?.imageUrl ?? "");
        setPortraitStyle(frame.style);
      } catch {
        // 保持旧行为：头衔或头像框配置加载失败时不显示额外内容。
      }
    };

    void loadTitlesAndPortrait();
    return () => {
      active = false;
    };
  }, [userInfo.displayTitleId]);

  return (
    <div style={{ position: "relative" }} className="user-avatar">
      <img className="user-avatar-img" src={userInfo.portraitUrl} />
      {/*是否有头像框*/}
      {portraitUrl ? <img style={portraitStyle} src={portraitUrl} /> : null}
      <div className="user-badge">
        {displayTitles && userInfo.userTitleIds
          ? displayTitles
              .filter(
                (item) =>
                  userInfo.userTitleIds.indexOf(item.id) !== -1 &&
                  [18, 81].indexOf(item.id) === -1
              )
              .map((item) => (
                <p key={item.id} style={{ color: "red" }}>
                  {item.name}
                </p>
              ))
          : null}
        {userInfo.boardMasterTitles.map((item) =>
          item.boardMasterLevel === 10 ? (
            <p key={item.boardId}>
              {/* 站务主管*/}
              <Link to={`/boardList#${item.boardName}`}>
                {item.boardName}
              </Link>
              <span style={{ color: "red" }}>{item.title}</span>
            </p>
          ) : (
            <p key={item.boardId}>
              {/* 站务主管*/}
              <Link to={`/board/${item.boardId}`}>{item.boardName}</Link>
              <span>{item.title}</span>
            </p>
          )
        )}
      </div>
    </div>
  );
}
