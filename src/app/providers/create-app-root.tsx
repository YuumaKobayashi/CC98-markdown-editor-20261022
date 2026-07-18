import * as React from "react";
import { LocaleProvider } from "antd";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import { Provider } from "react-redux";

import App from "@legacy/Components/App";
import ErrorBoundary from "@legacy/Components/ErrorBoundary";
import store from "@app/store";
import { CrossTabSync } from "@app/providers/cross-tab-sync";

/**
 * 创建保持旧运行行为的应用 Provider 树。
 *
 * CrossTabSync 是 P09 新增的无 DOM 应用壳；同步白名单为空，现有 Header
 * storage 合同仍保持原状。
 */
export function createAppRoot(): React.ReactElement<any> {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <CrossTabSync>
          <LocaleProvider locale={zh_CN}>
            <App />
          </LocaleProvider>
        </CrossTabSync>
      </Provider>
    </ErrorBoundary>
  );
}
