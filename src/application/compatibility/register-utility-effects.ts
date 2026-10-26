import { navigate } from "@application/router/navigation";
import { reportApplicationError } from "@application/providers/application-error";
import type { AppDispatch, RootState } from "@application/store/store";
import { replaceUnreadCount } from "@modules/notification/model/unread-count-slice";
import { selectUnreadCount } from "@modules/notification/model/selectors";
import { sessionInvalidated } from "@modules/session/model/session-slice";
import { updateCurrentUser } from "@modules/session/model/session-actions";
import { configureLegacyUtilityEffects } from "@foundation/lib/legacy-utility-effects";

export function registerLegacyUtilityEffects(
  dispatch: AppDispatch,
  getState: () => RootState
): void {
  configureLegacyUtilityEffects({
    throwError(error) {
      reportApplicationError(error);
    },
    logOffAndNavigate() {
      dispatch(sessionInvalidated());
      navigate("/logon");
    },
    changeCurrentUser(userInfo) {
      dispatch(updateCurrentUser(userInfo));
    },
    getMessageCounts() {
      return selectUnreadCount(getState());
    },
    clearMessageCounts() {
      dispatch(
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
