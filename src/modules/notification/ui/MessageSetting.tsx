// A '.tsx' file enables JSX support in the TypeScript compiler,
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
import * as React from "react";
import DocumentTitle from "@foundation/ui/document-title";
import { NoticeMessage, noticeMessageShow } from "@foundation/ui/feedback";
import { RadioGroup, RadioInput } from "@foundation/ui/radio";
import {
  getLocalStorage,
  setLocalStorage,
} from "@foundation/storage/web-storage";
import type { NoticeSetting } from "../model/types";
import styles from "./MessageSetting.module.scss";

const DEFAULT_NOTICE_SETTING: NoticeSetting = {
  response: "是",
  attme: "是",
  system: "是",
  message: "是",
  post: "否",
};

export function MessageSetting(): React.ReactElement {
  const [noticeSetting, setNoticeSetting] = React.useState<NoticeSetting>(() => {
    const noticeSetting = getLocalStorage<NoticeSetting>("noticeSetting");
    if (!noticeSetting) {
      return DEFAULT_NOTICE_SETTING;
    }

    return {
      response: noticeSetting.response === "否" ? "否" : "是",
      attme: noticeSetting.attme === "否" ? "否" : "是",
      system: noticeSetting.system === "否" ? "否" : "是",
      message: noticeSetting.message === "否" ? "否" : "是",
      post: noticeSetting.post === "否" ? "否" : "是",
    };
  });

  React.useLayoutEffect(() => {
    const noticeSetting = getLocalStorage<NoticeSetting>("noticeSetting");
    if (!noticeSetting) {
      setLocalStorage("noticeSetting", DEFAULT_NOTICE_SETTING);
    }
  }, []);

  const setMessageSetting = () => {
    setLocalStorage("noticeSetting", noticeSetting);
    noticeMessageShow("saveSuccess");
  };

  return (
    <div className={styles["message-right"]}>
      <DocumentTitle title={`消息设置-CC98论坛`} />
      <div className={styles["message-setting"]}>
        <div className={styles["message-settingbox"]}>
          <div className={styles.radioTitle}>是否显示回复通知</div>
          <RadioGroup
            name="responseSetting"
            value={noticeSetting.response}
            onValueChange={(response) =>
              setNoticeSetting((current) => ({ ...current, response }))
            }
            className={styles.radioGroup}
            aria-label="是否显示回复通知"
          >
            <RadioInput id="responseSetting1" value="是" aria-label="是" />
            <div>是</div>
            <RadioInput id="responseSetting2" value="否" aria-label="否" />
            <div>否</div>
          </RadioGroup>
        </div>
        <div className={styles["message-settingbox"]}>
          <div className={styles.radioTitle}>是否显示@通知</div>
          <RadioGroup
            name="attmeSetting"
            value={noticeSetting.attme}
            onValueChange={(attme) =>
              setNoticeSetting((current) => ({ ...current, attme }))
            }
            className={styles.radioGroup}
            aria-label="是否显示@通知"
          >
            <RadioInput id="attmeSetting1" value="是" aria-label="是" />
            <div>是</div>
            <RadioInput id="attmeSetting2" value="否" aria-label="否" />
            <div>否</div>
          </RadioGroup>
        </div>
        <div className={styles["message-settingbox"]}>
          <div className={styles.radioTitle}>是否显示系统通知</div>
          <RadioGroup
            name="systemSetting"
            value={noticeSetting.system}
            onValueChange={(system) =>
              setNoticeSetting((current) => ({ ...current, system }))
            }
            className={styles.radioGroup}
            aria-label="是否显示系统通知"
          >
            <RadioInput id="systemSetting1" value="是" aria-label="是" />
            <div>是</div>
            <RadioInput id="systemSetting2" value="否" aria-label="否" />
            <div>否</div>
          </RadioGroup>
        </div>
        <div className={styles["message-settingbox"]}>
          <div className={styles.radioTitle}>是否显示私信通知</div>
          <RadioGroup
            name="messageSetting"
            value={noticeSetting.message}
            onValueChange={(message) =>
              setNoticeSetting((current) => ({ ...current, message }))
            }
            className={styles.radioGroup}
            aria-label="是否显示私信通知"
          >
            <RadioInput id="messageSetting1" value="是" aria-label="是" />
            <div>是</div>
            <RadioInput id="messageSetting2" value="否" aria-label="否" />
            <div>否</div>
          </RadioGroup>
        </div>
        <div className={styles["message-settingbox"]}>
          <div className={styles.radioTitle}>回帖是否跳至最新回复</div>
          <RadioGroup
            name="postSetting"
            value={noticeSetting.post}
            onValueChange={(post) =>
              setNoticeSetting((current) => ({ ...current, post }))
            }
            className={styles.radioGroup}
            aria-label="回帖是否跳至最新回复"
          >
            <RadioInput id="postSetting1" value="是" aria-label="是" />
            <div>是</div>
            <RadioInput id="postSetting2" value="否" aria-label="否" />
            <div>否</div>
          </RadioGroup>
        </div>
        <button
          type="button"
          className={styles["message-setting-btn"]}
          onClick={setMessageSetting}
        >
          保存消息设置
        </button>
        <NoticeMessage text="保存成功" id="saveSuccess" top="31%" left="43%" />
      </div>
    </div>
  );
}
