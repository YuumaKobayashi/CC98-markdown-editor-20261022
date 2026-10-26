import * as React from "react";
import { Provider } from "react-redux";

import ErrorBoundary from "@application/providers/error-boundary";
import store from "@application/store";
import { ApplicationErrorProvider } from "@application/providers/application-error";
import { CrossTabSync } from "@application/providers/cross-tab-sync";
import { AppRouter } from "@application/router/app-router";
import { FeedbackProvider } from "@foundation/ui/feedback";

/**
 * 创建保持旧运行行为的应用 Provider 树。
 *
 * CrossTabSync 是唯一的应用级跨标签入口；S1.1 起接管当前用户同步。
 */
export function createAppRoot(): React.ReactElement<any> {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ApplicationErrorProvider>
          <CrossTabSync>
            <FeedbackProvider>
              <AppRouter />
            </FeedbackProvider>
          </CrossTabSync>
        </ApplicationErrorProvider>
      </Provider>
    </ErrorBoundary>
  );
}
