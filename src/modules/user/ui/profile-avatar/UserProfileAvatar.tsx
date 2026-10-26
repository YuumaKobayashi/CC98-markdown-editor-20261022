import * as React from "react";
import { Link } from "react-router";

import type {
  PortraitConfigDto,
  UserInfo,
} from "../../model/dto";
import { getAllUserTitles, getPortraitConfig } from "../../api/service";
import type { UserTitleDto } from "../../model/dto";
import styles from "./UserProfileAvatar.module.scss";

interface PortraitFrame {
  title: string;
  className: string;
}

export interface UserProfileAvatarOperations {
  getAllUserTitles: () => Promise<UserTitleDto[]>;
  getPortraitConfig: () => Promise<PortraitConfigDto>;
}

interface UserProfileAvatarProps {
  /**
   * 用户信息
   */
  userInfo: UserInfo;
  operations?: UserProfileAvatarOperations;
}

const defaultUserProfileAvatarOperations: UserProfileAvatarOperations = {
  getAllUserTitles,
  getPortraitConfig,
};

const portraitFrames: Record<number, PortraitFrame> = {
  82: {
    title: "吉祥物",
    className: styles.frameMascot,
  },
  18: { title: "版主", className: styles.frameStandard },
  22: { title: "版主", className: styles.frameStandard },
  32: {
    title: "站务组",
    className: styles.frameStaff,
  },
  21: {
    title: "站务组",
    className: styles.frameStaff,
  },
  28: { title: "贵宾", className: styles.frameStandard },
  16: { title: "贵宾", className: styles.frameStandard },
  37: {
    title: "技术组",
    className: styles.frameTechnical,
  },
  23: {
    title: "技术组",
    className: styles.frameTechnical,
  },
  85: { title: "编辑部", className: styles.frameStandard },
  29: { title: "编辑部", className: styles.frameStandard },
  84: { title: "策划部", className: styles.frameStandard },
  34: { title: "策划部", className: styles.frameStandard },
  94: { title: "办公室", className: styles.frameStandard },
  93: { title: "办公室", className: styles.frameStandard },
  35: { title: "体育部", className: styles.frameStandard },
  86: { title: "体育部", className: styles.frameStandard },
  96: { title: "影音部", className: styles.frameStandard },
  99: { title: "影音部", className: styles.frameStandard },
  91: { title: "认证用户", className: styles.frameStandard },
  104: {
    title: "年度用户",
    className: styles.frameAnnual,
  },
};

//用户中心主页用户头像与徽章组件
export function UserProfileAvatar({
  userInfo,
  operations = defaultUserProfileAvatarOperations,
}: UserProfileAvatarProps) {
  const [displayTitles, setDisplayTitles] = React.useState<UserTitleDto[]>([]);
  const [portraitUrl, setPortraitUrl] = React.useState("");
  const [portraitClassName, setPortraitClassName] = React.useState("");

  React.useEffect(() => {
    let active = true;

    const loadTitlesAndPortrait = async () => {
      try {
        const titles = await operations.getAllUserTitles();
        if (!active) return;
        setDisplayTitles(titles);
        setPortraitUrl("");
        setPortraitClassName("");

        const frame = portraitFrames[userInfo.displayTitleId];
        const hasTitle = titles.some(
          (item) => item.id === userInfo.displayTitleId
        );
        if (!frame || !hasTitle) return;

        const portraits = await operations.getPortraitConfig();
        if (!active) return;

        setPortraitUrl(portraits[frame.title]?.imageUrl ?? "");
        setPortraitClassName(frame.className);
      } catch {
        // 保持旧行为：头衔或头像框配置加载失败时不显示额外内容。
      }
    };

    void loadTitlesAndPortrait();
    return () => {
      active = false;
    };
  }, [operations, userInfo.displayTitleId]);

  return (
    <div className={styles["user-avatar"]}>
      <img className={styles["user-avatar-img"]} src={userInfo.portraitUrl} />
      {/*是否有头像框*/}
      {portraitUrl ? (
        <img
          className={`${styles.frame} ${portraitClassName}`}
          src={portraitUrl}
        />
      ) : null}
      <div className={styles["user-badge"]}>
        {displayTitles && userInfo.userTitleIds
          ? displayTitles
              .filter(
                (item) =>
                  userInfo.userTitleIds.indexOf(item.id) !== -1 &&
                  [18, 81].indexOf(item.id) === -1
              )
              .map((item) => (
                <p key={item.id} className={styles.titleBadge}>
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
              <span className={styles.supervisorTitle}>{item.title}</span>
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
