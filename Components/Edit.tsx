import * as React from "react";

export {
  EditorBreadcrumb as Category,
  EditorPage as ShowEdit,
  EditorTagNotice as TagNotice,
  EditorTitleInput as InputTitle,
  HousingTemplateDialog as Tmp,
} from "@pages/editor";

/**
 * 编辑界面的标签。
 * 该占位 class 没有运行时引用，原样保留至 P21 引用证明。
 */
export class Tags extends React.Component<{}, {}> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <div />;
  }
}

/**
 * 编辑界面的选项。
 * 该占位 class 没有运行时引用，原样保留至 P21 引用证明。
 */
export class Options extends React.Component<{}, {}> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="createTopicOption">
        <div className="createTopicListName">选项</div>
        <input type="radio" checked={true} name="option" value="all" />
        回复所有人可见
        <input type="radio" name="option" value="host" />
        回复仅楼主可见
        <input type="radio" name="option" value="special" />
        回复仅特定用户可见
      </div>
    );
  }
}
