import * as React from "react";

interface DocumentTitleProps {
  /**
   * 要显示的标题内容
   */
  title: string;
  children?: React.ReactNode;
}

/**
 * 修改文档标题组件
 */
export function DocumentTitle({ title, children }: DocumentTitleProps) {
  /**
   * 初始化及标题变化时，根据title修改标题
   */
  React.useEffect(() => {
    document.title = title || "CC98论坛";
  }, [title]);

  if (children) {
    //如果标签之间有内容则显示内容
    return React.Children.only(children);
  }

  //没有则什么也不显示
  return null;
}

export default DocumentTitle;
