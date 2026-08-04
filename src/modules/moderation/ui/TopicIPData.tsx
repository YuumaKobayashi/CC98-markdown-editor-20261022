import * as React from "react";
import { Collapse, Modal } from "antd";
import type { PostSimpleInfo, PostWithIpInfo } from "../model/dto";

const Panel = Collapse.Panel;

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
    <Modal
      open={visible}
      title="查看IP"
      okText="确认"
      cancelText="取消"
      onOk={onClick}
      onCancel={onClick}
      width={"50rem"}
      maskClosable={false}
      bodyStyle={{ maxHeight: "20rem", overflowY: "auto" }}
    >
      <Collapse defaultActiveKey={[]}>
        {IPData.map((item: PostWithIpInfo, index) => (
          <Panel
            key={`${index}`}
            header={`${item.ip} 共${item.posts.length}条`}
          >
            {item.posts.map((post: PostSimpleInfo) => (
              <>
                <p>
                  用户名:{post.userName} 楼层:{post.floor}
                </p>
                <p
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {post.content}
                </p>
              </>
            ))}
          </Panel>
        ))}
      </Collapse>
    </Modal>
  );
}
