import * as React from "react";

import type { EditorTagInfo } from "../model/types";
import styles from "./EditorTagNotice.module.scss";

interface EditorTagNoticeProps {
  tagsV2: EditorTagInfo;
  postInfo: any;
}

export function EditorTagNotice({
  tagsV2,
  postInfo,
}: EditorTagNoticeProps): React.ReactElement | null {
  // 发新帖时 postInfo.floor === 0。
  if (tagsV2.layers !== 2 || postInfo.floor >= 2) return null;

  return (
    <div className={styles.createTopicType}>
      <div className={styles.tagNotice}>
        【提示】↓↓↓ 该版面有两层标签，请先选择第1个标签，再选择第2个标签 ↓↓↓
      </div>
    </div>
  );
}
