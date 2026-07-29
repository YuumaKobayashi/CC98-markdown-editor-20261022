import store, { Actions } from "@app/store";
import { navigate } from "@app/router/navigation";
import * as ErrorActions from "@legacy/Actions/Error";
import * as UserCenterActions from "@legacy/Actions/UserCenter";
import { configureLegacyUtilityEffects } from "@foundation/lib/legacy-utility-effects";

export function registerLegacyUtilityEffects(): void {
  configureLegacyUtilityEffects({
    throwError(error) {
      store.dispatch(ErrorActions.throwError(error));
    },
    logOffAndNavigate() {
      store.dispatch(UserCenterActions.userLogOff());
      navigate("/logon");
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
