import * as React from "react";
import { LocaleProvider } from "antd";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import { Provider } from "react-redux";

import App from "@legacy/Components/App";
import ErrorBoundary from "@legacy/Components/ErrorBoundary";
import store from "@legacy/Store";

/**
 * 创建与旧入口完全相同的应用 Provider 树。
 *
 * 这里返回元素而不是新增包装组件，避免改变 ErrorBoundary、Redux Provider、
 * AntD LocaleProvider 和 App 之间的运行时层级。
 */
export function createAppRoot(): React.ReactElement<any> {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <LocaleProvider locale={zh_CN}>
          <App />
        </LocaleProvider>
      </Provider>
    </ErrorBoundary>
  );
}
