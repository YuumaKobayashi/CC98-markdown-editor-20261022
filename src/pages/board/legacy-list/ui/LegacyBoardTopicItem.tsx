import * as React from "react";
import $ from "jquery";
import moment from "moment";
import { Link } from "react-router";

import { getTagNamebyId } from "@modules/topic";
import { getMyInfo } from "@modules/user";
import type { TopicTitleAndContentState } from "@legacy/States/AppState";

const createPager = (replyCount: number) => {
  const count = replyCount + 1;
  const totalPage =
    count % 10 === 0 ? count / 10 : (count - (count % 10)) / 10 + 1;
  const pager: number[] = [];
  if (totalPage <= 7) {
    for (let page = 1; page <= totalPage; page++) {
      if (totalPage !== 1) pager.push(page);
    }
  } else {
    pager.push(1, 2, 3, 4, -1, totalPage - 2, totalPage - 1, totalPage);
  }
  return pager;
};

export function LegacyBoardTopicItem(
  props: TopicTitleAndContentState
) {
  const [pager] = React.useState<number[]>(() =>
    typeof props.replyCount === "number" ? createPager(props.replyCount) : []
  );
  const [tag1, setTag1] = React.useState("");
  const [tag2, setTag2] = React.useState("");

  React.useEffect(() => {
    const loadTags = async () => {
      if (typeof props.replyCount === "number" && props.highlightInfo != null) {
        const titleId = `#title${props.id}`;
        if (props.highlightInfo.isBold == true) {
          $(titleId).css("font-weight", "bold");
        }
        if (props.highlightInfo.isItalic == true) {
          $(titleId).css("font-style", "italic");
        }
        if (props.highlightInfo.color != null) {
          $(titleId).css("color", props.highlightInfo.color);
        }
      }

      const nextTag1 = await getTagNamebyId(props.tag1);
      const nextTag2 = await getTagNamebyId(props.tag2);
      setTag1(nextTag1 ? nextTag1 : "");
      setTag2(nextTag2 ? nextTag2 : "");
    };

    void loadTags();
  }, []);

  const generateListPager = (item: number) => {
    const url = `/topic/${props.id}/${item}`;
    if (item != -1) {
      return (
        <div style={{ marginRight: "0.3rem" }}>
          <Link style={{ color: "#79b8ca" }} to={url}>
            {item}
          </Link>
        </div>
      );
    }
    return <div style={{ marginRight: "0.3rem" }}>...</div>;
  };

  if (typeof props.replyCount !== "number") {
    console.log("does not exist");
    console.log(props);
    return null;
  }

  const colorId = props.topState === 0 ? "changeColor" : "changeTopColor";
  const topicId = `topic${props.id}`;
  const url = `/topic/${props.id}`;
  const titleId = `title${props.id}`;
  let icon: React.ReactNode;

  const currentUserName = getMyInfo() ? getMyInfo().name : "";
  if (props.topState === 0) {
    icon = (
      <div style={{ width: "1rem", justifyContent: "flex-start" }}>
        <i style={{ color: "#B0B0B0" }} className="fa fa-envelope fa-lg" />
      </div>
    );
  }
  if (currentUserName === props.userName) {
    icon = (
      <div style={{ width: "1rem", justifyContent: "flex-start" }}>
        <i style={{ color: "#FFC90E" }} className="fa fa-envelope fa-lg" />
      </div>
    );
  }
  if (props.replyCount > 100 && props.topState === 0) {
    icon = (
      <div style={{ width: "1rem", justifyContent: "flex-start" }}>
        <i
          style={{ color: "red" }}
          className="fa fa-envelope-open fa-lg"
        />
      </div>
    );
  }
  if (props.state === 1) {
    icon = (
      <div style={{ width: "1rem", justifyContent: "flex-start" }}>
        <i style={{ color: "#B0B0B0" }} className="fa fa-lock fa-lg" />
      </div>
    );
  }

  let hitCount: any = props.hitCount;
  if (props.hitCount > 100000) {
    hitCount =
      (
        (props.hitCount - (props.hitCount % 10000)) /
        10000
      ).toString() + "万";
  } else if (props.hitCount > 10000) {
    hitCount = (props.hitCount / 10000).toFixed(1).toString() + "万";
  }

  if (props.bestState === 1) {
    icon = (
      <div style={{ width: "1rem", justifyContent: "flex-start" }}>
        <i style={{ color: "#FF1493" }} className="fa fa-star fa-lg" />
      </div>
    );
  }
  if (props.topState === 2) {
    icon = (
      <div style={{ width: "1rem", justifyContent: "flex-start" }}>
        <i
          style={{ color: "orange" }}
          className="fa fa-chevron-circle-up fa-lg"
        />
      </div>
    );
  } else if (props.topState === 4) {
    icon = (
      <div style={{ width: "1rem", justifyContent: "flex-start" }}>
        <i style={{ color: "red" }} className="fa fa-arrow-circle-up fa-lg" />
      </div>
    );
  }

  let color: any = "#000";
  let fontWeight: any = "normal";
  let fontStyle: any = "normal";
  if (props.highlightInfo) {
    if (props.highlightInfo.isBold) fontWeight = "bold";
    if (props.highlightInfo.isItalic) fontStyle = "italic";
    if (props.highlightInfo.color) color = props.highlightInfo.color;
  }

  const checkbox =
    props.topState === 0 ? (
      <div
        className="opTitleCheckbox"
        style={{ alignContent: "center", display: "none" }}
      >
        <input
          id={`topic_${props.id}`}
          className="opTitleCheckboxValue"
          type="checkbox"
        />
      </div>
    ) : null;

  let title = "";
  if (tag2 && !props.topState) title = `[${tag2}]${title}`;
  if (tag1 && !props.topState) title = `[${tag1}]${title}`;
  if (props.isVote) title = `[投票]${title}`;

  return (
    <div style={{ display: "flex" }} id={colorId}>
      {checkbox}
      <Link to={url}>
        <div className="rofw topicInList" id={topicId}>
          <div className="listTitleAndPager">
            <div className="row listTitleAndIcon">
              {icon}
              <div
                className="listTitle"
                id={titleId}
                style={{
                  marginLeft: "1rem",
                  color,
                  fontWeight,
                  fontStyle,
                }}
              >
                <span className="listTitleTag">{title}</span>
                {props.title}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                fontSize: "0.75rem",
                marginLeft: "1rem",
                width: "auto",
              }}
            >
              {pager.map(generateListPager)}
            </div>
          </div>
          <div
            className="row"
            style={{
              width: "28rem",
              flexDirection: "row",
              alignItems: "flex-end",
              justifyContent: "space-between",
              fontSize: "0.75rem",
              marginBottom: "-4px",
            }}
          >
            <div style={{ width: "7.5rem", textAlign: "left" }}>
              {" "}
              <span>{props.userName || "匿名"}</span>
            </div>
            <div className="row topicIcon">
              <div id="disliked" style={{ display: "flex", width: "4.5rem" }}>
                <i className="fa fa-eye fa-lg" />
                <span className="timeProp tagSize">{hitCount}</span>
              </div>
              <div
                id="commentsAmount"
                style={{ display: "flex", width: "3.5rem" }}
              >
                <i className="fa fa-commenting-o fa-lg" />
                <span className="timeProp tagSize">{props.replyCount}</span>
              </div>
            </div>
            <div className="lastReply">
              <span>
                {props.lastPostUser}/
                {moment(props.lastPostTime).format("YY-MM-DD HH:mm")}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
