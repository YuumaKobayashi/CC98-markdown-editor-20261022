import * as React from "react";

import { getTagNamebyId } from "@modules/topic/api/metadata";
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
  selectedTag1: string;
  selectedTag2: string;
  tag1Open: boolean;
  tag2Open: boolean;
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
    selectedTag1: "",
    selectedTag2: "",
    tag1Open: false,
    tag2Open: false,
  });
  const tagSelectionVersionRef = React.useRef(0);

  React.useEffect(() => {
    setCurrent((state) => {
      if (title && !state.title) {
        return { ...state, title };
      }
      return state;
    });
  }, [title]);

  React.useEffect(() => {
    let ignore = false;
    const selectionVersion = tagSelectionVersionRef.current;

    const loadSelectedTags = async () => {
      let tag1Name = "";
      let tag2Name = "";
      if (tag1 !== 0) {
        const resolvedTag1 = await getTagNamebyId(tag1);
        tag1Name = resolvedTag1 || "";
      }
      if (tag2 !== 0) {
        const resolvedTag2 = await getTagNamebyId(tag2);
        tag2Name = resolvedTag2 || "";
      }

      if (
        ignore ||
        selectionVersion !== tagSelectionVersionRef.current
      ) {
        return;
      }
      setCurrent((state) => ({
        ...state,
        selectedTag1: tag1Name,
        selectedTag2: tag2Name,
      }));
    };

    void loadSelectedTags();

    return () => {
      ignore = true;
    };
  }, [tag1, tag2]);

  React.useEffect(() => {
    const closeTagMenus = () => {
      setCurrent((state) => {
        if (!state.tag1Open && !state.tag2Open) return state;
        return { ...state, tag1Open: false, tag2Open: false };
      });
    };

    document.addEventListener("click", closeTagMenus);
    return () => {
      document.removeEventListener("click", closeTagMenus);
    };
  }, []);

  const toggleTag1 = (event: React.MouseEvent) => {
    event.stopPropagation();
    setCurrent((state) => ({
      ...state,
      tag1Open: !state.tag1Open,
    }));
  };

  const toggleTag2 = (event: React.MouseEvent) => {
    event.stopPropagation();
    setCurrent((state) => ({
      ...state,
      tag2Open: !state.tag2Open,
    }));
  };

  const selectTag1 = (tagName: string) => {
    tagSelectionVersionRef.current += 1;
    setCurrent((state) => ({
      ...state,
      selectedTag1: tagName,
      selectedTag2: "",
      tag1Open: false,
      tag2Open: false,
    }));
    onChange("", tagName, "");
  };

  const selectTag2 = (tagName: string) => {
    tagSelectionVersionRef.current += 1;
    setCurrent((state) => ({
      ...state,
      selectedTag2: tagName,
      tag1Open: false,
      tag2Open: false,
    }));
    onChange("", current.selectedTag1, tagName);
  };

  const subTags =
    tagsV2.tags.find((item) => item.name === current.selectedTag1)?.subTags ??
    [];

  let drop1: React.ReactNode = null;
  let drop2: React.ReactNode = null;
  if (tagsV2.layers > 0) {
    drop1 = (
      <ul
        className={
          current.tag1Open
            ? `${styles.tagBoxSub} ${styles.tagBoxSubOpen}`
            : styles.tagBoxSub
        }
      >
        {tagsV2.tags.map((item) => (
          <li key={item.id} onClick={() => selectTag1(item.name)}>
            {item.name}
          </li>
        ))}
      </ul>
    );
  }
  if (tagsV2.layers === 2) {
    drop2 = (
      <ul
        className={
          current.tag2Open
            ? `${styles.tagBoxSub1} ${styles.tagBoxSubOpen}`
            : styles.tagBoxSub1
        }
      >
        {subTags.map((item) => (
          <li key={item.id} onClick={() => selectTag2(item.name)}>
            {item.name}
          </li>
        ))}
      </ul>
    );
  }

  let tagInfo: React.ReactNode = null;
  if (tagsV2.layers === 2) {
    tagInfo = (
      <div className={styles.tagRow}>
        <div className={styles.tagRow}>
          <div className={styles.tagBoxSelect} onClick={toggleTag1}>
            {current.selectedTag1}
          </div>
          <div className={styles.downArrow} onClick={toggleTag1}>
            <img src="/static/images/downArrow.png" width="12" height="12" />
          </div>
          {drop1}
        </div>
        <div className={styles.tagRow}>
          <div className={styles.tagBoxSelect1} onClick={toggleTag2}>
            {current.selectedTag2}
          </div>
          <div className={styles.downArrow1} onClick={toggleTag2}>
            <img src="/static/images/downArrow.png" width="12" height="12" />
          </div>
          {drop2}
        </div>
      </div>
    );
  } else if (tagsV2.layers == 1) {
    tagInfo = (
      <div className={styles.tagRow}>
        <div className={styles.tagBoxSelect} onClick={toggleTag1}>
          {current.selectedTag1}
        </div>
        <div className={styles.downArrow} onClick={toggleTag1}>
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
          if (tagsV2.layers === 0) {
            onChange(event.target.value, "", "");
          } else if (tagsV2.layers === 1) {
            onChange(event.target.value, current.selectedTag1, "");
          } else {
            onChange(
              event.target.value,
              current.selectedTag1,
              current.selectedTag2,
            );
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
