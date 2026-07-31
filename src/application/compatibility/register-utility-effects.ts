import store from "@application/store";
import { navigate } from "@application/router/navigation";
import * as ErrorActions from "@legacy/Actions/Error";
import {
  replaceUnreadCount,
  selectUnreadCount,
} from "@modules/notification";
import {
  sessionInvalidated,
  updateCurrentUser,
} from "@modules/session";
import { configureLegacyUtilityEffects } from "@foundation/lib/legacy-utility-effects";

export function registerLegacyUtilityEffects(): void {
  configureLegacyUtilityEffects({
    throwError(error) {
      store.dispatch(ErrorActions.throwError(error));
    },
    logOffAndNavigate() {
      store.dispatch(sessionInvalidated());
      navigate("/logon");
    },
    changeCurrentUser(userInfo) {
      store.dispatch(updateCurrentUser(userInfo));
    },
    getMessageCounts() {
      return selectUnreadCount(store.getState());
    },
    clearMessageCounts() {
      store.dispatch(
        replaceUnreadCount({
          messageCount: 0,
          systemCount: 0,
          atCount: 0,
          replyCount: 0,
        })
      );
    },
  });
}
