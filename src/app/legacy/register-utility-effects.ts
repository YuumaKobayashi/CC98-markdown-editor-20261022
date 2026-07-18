import store, { Actions, history } from "@app/store";
import * as ErrorActions from "@legacy/Actions/Error";
import * as UserCenterActions from "@legacy/Actions/UserCenter";
import { configureLegacyUtilityEffects } from "@shared/lib/legacy-utility-effects";

export function registerLegacyUtilityEffects(): void {
  configureLegacyUtilityEffects({
    throwError(error) {
      store.dispatch(ErrorActions.throwError(error));
    },
    logOffAndNavigate() {
      store.dispatch(UserCenterActions.userLogOff());
      history.push("/logon");
    },
    changeCurrentUser(userInfo) {
      store.dispatch(UserCenterActions.changeUserInfo(userInfo));
    },
    getMessageCounts() {
      return store.getState().message;
    },
    clearMessageCounts() {
      store.dispatch(
        Actions.changeMessageCount({
          messageCount: 0,
          systemCount: 0,
          atCount: 0,
          replyCount: 0,
        })
      );
    },
  });
}
