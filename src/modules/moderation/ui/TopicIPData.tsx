import * as React from "react";
import { Accordion } from "@foundation/ui/accordion";
import { Dialog } from "@foundation/ui/dialog";
import type { PostSimpleInfo, PostWithIpInfo } from "../model/dto";

import styles from "./TopicIPData.module.scss";

interface TopicIPDataProps {
  IPData: PostWithIpInfo[];
  changeStatus: () => void;
}

export function TopicIPData(props: TopicIPDataProps): React.ReactElement {
  const [visible] = React.useState(true);
  const { IPData, changeStatus } = props;

  const onClick = () => {
    changeStatus();
  };

  return (
    <Dialog
      open={visible}
      title="查看IP"
      confirmText="确 认"
      cancelText="取 消"
      onOpenChange={(open) => {
        if (!open) onClick();
      }}
      width="50rem"
      maskClosable={false}
      bodyClassName={styles.dialogBody}
    >
      <Accordion
        defaultExpandedIds={[]}
        items={IPData.map((item: PostWithIpInfo, index) => ({
          id: `${index}`,
          heading: `${item.ip} 共${item.posts.length}条`,
          content: item.posts.map((post: PostSimpleInfo, postIndex) => (
              <React.Fragment key={`${post.userName}-${post.floor}-${postIndex}`}>
                <p>
                  用户名:{post.userName} 楼层:{post.floor}
                </p>
                <p className={styles.postContent}>
                  {post.content}
                </p>
              </React.Fragment>
            )),
        }))}
      />
    </Dialog>
  );
}
