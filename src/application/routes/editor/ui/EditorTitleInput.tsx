import * as React from "react";
import $ from "jquery";

import { getTagNamebyId } from "@modules/topic";
import type { EditorTagInfo } from "../model/types";
import styles from "./EditorTitleInput.module.scss";

interface EditorTitleInputProps {
  boardId;
  onChange: (title: string, tag1: string, tag2: string) => void;
  tagsV2: EditorTagInfo;
  title: string;
  tag1;
  tag2;
}

interface EditorTitleState {
  title: string;
  tagsV2: EditorTagInfo;
  tag1: string;
  tag2: string;
}

export function EditorTitleInput({
  onChange,
  tagsV2,
  title,
  tag1,
  tag2,
}: EditorTitleInputProps): React.ReactElement {
  const [current, setCurrent] = React.useState<EditorTitleState>({
    title,
    tagsV2,
    tag1: "",
    tag2: "",
  });

  React.useEffect(() => {
    setCurrent((state) => {
      if (title && !state.title) {
        return { ...state, title, tagsV2 };
      }
      return { ...state, tagsV2 };
    });
  }, [title, tagsV2]);

  React.useEffect(() => {
    const loadSelectedTags = async () => {
      let tag1Name = "";
      let tag2Name = "";
      if (tag1 !== 0) tag1Name = (await getTagNamebyId(tag1)) as string;
      if (tag2 !== 0) tag2Name = (await getTagNamebyId(tag2)) as string;

      setCurrent((state) => ({
        ...state,
        title: title && !state.title ? title : state.title,
        tagsV2,
        tag1: tag1Name,
        tag2: tag2Name,
      }));
    };

    void loadSelectedTags();
  }, [tag1, tag2]);

  React.useEffect(() => {
    const tagBoxSelect = $(`.${styles.tagBoxSelect}`);
    if (tagBoxSelect.length === 0) return;

    const eventNamespace = ".p15EditorTitle";
    const downArrow = $(`.${styles.downArrow}`);
    const tagBoxSub = $(`.${styles.tagBoxSub}`);
    const tagBoxSelect1 = $(`.${styles.tagBoxSelect1}`);
    const downArrow1 = $(`.${styles.downArrow1}`);
    const tagBoxSub1 = $(`.${styles.tagBoxSub1}`);

    $(document).on(`click${eventNamespace}`, () => {
      tagBoxSub.css("display", "none");
      tagBoxSub1.css("display", "none");
    });
    tagBoxSelect.on(`click${eventNamespace}`, () => {
      tagBoxSub.css(
        "display",
        tagBoxSub.css("display") === "block" ? "none" : "block"
      );
      return false;
    });
    downArrow.on(`click${eventNamespace}`, () => {
      tagBoxSub.css(
        "display",
        tagBoxSub.css("display") === "block" ? "none" : "block"
      );
      return false;
    });
    tagBoxSelect1.on(`click${eventNamespace}`, () => {
      tagBoxSub1.css(
        "display",
        tagBoxSub1.css("display") === "block" ? "none" : "block"
      );
      return false;
    });
    downArrow1.on(`click${eventNamespace}`, () => {
      tagBoxSub1.css(
        "display",
        tagBoxSub1.css("display") === "block" ? "none" : "block"
      );
      return false;
    });

    return () => {
      $(document).off(eventNamespace);
      tagBoxSelect.off(eventNamespace);
      downArrow.off(eventNamespace);
      tagBoxSelect1.off(eventNamespace);
      downArrow1.off(eventNamespace);
    };
  }, [current.tagsV2]);

  const handleTagChange = () => {
    const selectedTag1 = $(`.${styles.tagBoxSelect}`).text();
    const selectedTag2 = $(`.${styles.tagBoxSelect1}`).text();
    onChange("", selectedTag1, selectedTag2);
  };

  const generateTagOption = (item, layers = 1, isTag2 = false) => {
    return (
      <li
        onClick={() => {
          const tagBoxSelect = $(`.${styles.tagBoxSelect}`);
          if (layers === 1) {
            tagBoxSelect.text(item.name);
          } else {
            const tagBoxSelect1 = $(`.${styles.tagBoxSelect1}`);
            if (isTag2) {
              tagBoxSelect1.text(item.name);
            } else {
              tagBoxSelect.text(item.name);
              tagBoxSelect1.text("");
            }
          }
          handleTagChange();
        }}
      >
        {item.name}
      </li>
    );
  };

  const tagBoxSelect = $(`.${styles.tagBoxSelect}`);
  const tagBoxSelect1 = $(`.${styles.tagBoxSelect1}`);
  console.log("render begin:");
  console.log(`tagBoxSelect: ${tagBoxSelect.text()}`);
  console.log(`tagBoxSelect1: ${tagBoxSelect1.text()}`);
  console.log("render end.");

  let drop1: React.ReactNode = null;
  let drop2: React.ReactNode = null;
  if (current.tagsV2.layers > 0) {
    drop1 = (
      <ul className={styles.tagBoxSub}>
        {current.tagsV2.tags.map((item) =>
          generateTagOption(item, current.tagsV2.layers, false)
        )}
      </ul>
    );
  }
  if (current.tagsV2.layers === 2) {
    if (tagBoxSelect.text()) {
      drop2 = (
        <ul className={styles.tagBoxSub1}>
          {current.tagsV2.tags
            .find((item) => item.name === tagBoxSelect.text())
            .subTags.map((item) =>
              generateTagOption(item, current.tagsV2.layers, true)
            )}
        </ul>
      );
    } else if (current.tag1) {
      drop2 = (
        <ul className={styles.tagBoxSub1}>
          {current.tagsV2.tags
            .find((item) => item.name === current.tag1)
            .subTags.map((item) =>
              generateTagOption(item, current.tagsV2.layers, true)
            )}
        </ul>
      );
    } else {
      drop2 = <ul className={styles.tagBoxSub1} />;
    }
  }

  let tagInfo: React.ReactNode = null;
  if (current.tagsV2.layers === 2) {
    tagInfo = (
      <div className="cc98-row">
        <div className="cc98-row">
          <div className={styles.tagBoxSelect}>{current.tag1 || ""}</div>
          <div className={styles.downArrow}>
            <img src="/static/images/downArrow.png" width="12" height="12" />
          </div>
          {drop1}
        </div>
        <div className="cc98-row">
          <div className={styles.tagBoxSelect1}>{current.tag2 || ""}</div>
          <div className={styles.downArrow1}>
            <img src="/static/images/downArrow.png" width="12" height="12" />
          </div>
          {drop2}
        </div>
      </div>
    );
  } else if (current.tagsV2.layers == 1) {
    tagInfo = (
      <div className="cc98-row">
        <div className={styles.tagBoxSelect}>{current.tag1 || ""}</div>
        <div className={styles.downArrow}>
          <img src="/static/images/downArrow.png" width="12" height="12" />
        </div>
        {drop1}
      </div>
    );
  }

  return (
    <div className={styles.createTopicTitle}>
      <div className={styles.createTopicListName}>主题标题</div>
      {tagInfo}
      <input
        value={current.title}
        placeholder="请输入新主题的标题"
        onChange={(event) => {
          let selectedTag1;
          let selectedTag2;
          if (current.tagsV2.layers === 0) {
            onChange(event.target.value, "", "");
          } else if (current.tagsV2.layers === 1) {
            selectedTag1 = $(`.${styles.tagBoxSelect}`).text();
            onChange(event.target.value, selectedTag1, "");
          } else {
            selectedTag1 = $(`.${styles.tagBoxSelect}`).text();
            selectedTag2 = $(`.${styles.tagBoxSelect1}`).text();
            onChange(event.target.value, selectedTag1, selectedTag2);
          }
          setCurrent((state) => ({
            ...state,
            title: event.target.value,
          }));
        }}
      />
    </div>
  );
}
