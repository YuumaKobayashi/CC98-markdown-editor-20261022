// A '.tsx' file enables JSX support in the TypeScript compiler,
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
import * as React from "react";
import $ from "jquery";
import DocumentTitle from "@shared/ui/document-title";
import { NoticeMessage } from "@shared/ui/feedback";
import {
  getLocalStorage,
  setLocalStorage,
} from "@shared/storage/web-storage";
import { noticeMessageShow } from "../api/service";
import { NoticeSetting } from "../model/types";

export function MessageSetting(): React.ReactElement {
  React.useLayoutEffect(() => {
    const noticeSetting = getLocalStorage<NoticeSetting>("noticeSetting");
    if (noticeSetting) {
      if (noticeSetting.response === "否") {
        $("#responseSetting1").removeAttr("checked");
        $("#responseSetting2").attr("checked", "checked");
      } else {
        $("#responseSetting1").attr("checked", "checked");
        $("#responseSetting2").removeAttr("checked");
      }
      if (noticeSetting.attme === "否") {
        $("#attmeSetting1").removeAttr("checked");
        $("#attmeSetting2").attr("checked", "checked");
      } else {
        $("#attmeSetting1").attr("checked", "checked");
        $("#attmeSetting2").removeAttr("checked");
      }
      if (noticeSetting.system === "否") {
        $("#systemSetting1").removeAttr("checked");
        $("#systemSetting2").attr("checked", "checked");
      } else {
        $("#systemSetting1").attr("checked", "checked");
        $("#systemSetting2").removeAttr("checked");
      }
      if (noticeSetting.message === "否") {
        $("#messageSetting1").removeAttr("checked");
        $("#messageSetting2").attr("checked", "checked");
      } else {
        $("#messageSetting1").attr("checked", "checked");
        $("#messageSetting2").removeAttr("checked");
      }
      if (noticeSetting.post === "否") {
        $("#postSetting1").removeAttr("checked");
        $("#postSetting2").attr("checked", "checked");
      } else {
        $("#postSetting1").attr("checked", "checked");
        $("#postSetting2").removeAttr("checked");
      }
    } else {
      setLocalStorage("noticeSetting", {
        response: "是",
        attme: "是",
        system: "是",
        message: "是",
        post: "否",
      });
    }
  }, []);

  const setMessageSetting = () => {
    const responseSetting = $(
      'input:radio[name="responseSetting"]:checked',
    ).val();
    const attmeSetting = $('input:radio[name="attmeSetting"]:checked').val();
    const systemSetting = $('input:radio[name="systemSetting"]:checked').val();
    const messageSetting = $(
      'input:radio[name="messageSetting"]:checked',
    ).val();
    const postSetting = $('input:radio[name="postSetting"]:checked').val();
    const noticeSetting = {
      response: responseSetting,
      attme: attmeSetting,
      system: systemSetting,
      message: messageSetting,
      post: postSetting,
    };
    setLocalStorage("noticeSetting", noticeSetting);
    noticeMessageShow("saveSuccess");
  };

  return (
    <div className="message-right">
      <DocumentTitle title={`消息设置-CC98论坛`} />
      <div className="message-setting">
        <div className="message-settingbox">
          <div className="radioTitle">是否显示回复通知</div>
          <input
            type="radio"
            name="responseSetting"
            id="responseSetting1"
            value="是"
            checked
          />
          <div>是</div>
          <input
            type="radio"
            name="responseSetting"
            id="responseSetting2"
            value="否"
          />
          <div>否</div>
        </div>
        <div className="message-settingbox">
          <div className="radioTitle">是否显示@通知</div>
          <input
            type="radio"
            name="attmeSetting"
            id="attmeSetting1"
            value="是"
            checked
          />
          <div>是</div>
          <input
            type="radio"
            name="attmeSetting"
            id="attmeSetting2"
            value="否"
          />
          <div>否</div>
        </div>
        <div className="message-settingbox">
          <div className="radioTitle">是否显示系统通知</div>
          <input
            type="radio"
            name="systemSetting"
            id="systemSetting1"
            value="是"
            checked
          />
          <div>是</div>
          <input
            type="radio"
            name="systemSetting"
            id="systemSetting2"
            value="否"
          />
          <div>否</div>
        </div>
        <div className="message-settingbox">
          <div className="radioTitle">是否显示私信通知</div>
          <input
            type="radio"
            name="messageSetting"
            id="messageSetting1"
            value="是"
            checked
          />
          <div>是</div>
          <input
            type="radio"
            name="messageSetting"
            id="messageSetting2"
            value="否"
          />
          <div>否</div>
        </div>
        <div className="message-settingbox">
          <div className="radioTitle">回帖是否跳至最新回复</div>
          <input
            type="radio"
            name="postSetting"
            id="postSetting1"
            value="是"
          />
          <div>是</div>
          <input
            type="radio"
            name="postSetting"
            id="postSetting2"
            value="否"
            checked
          />
          <div>否</div>
        </div>
        <button
          className="message-setting-btn"
          onClick={setMessageSetting}
        >
          保存消息设置
        </button>
        <NoticeMessage text="保存成功" id="saveSuccess" top="31%" left="43%" />
      </div>
    </div>
  );
}
