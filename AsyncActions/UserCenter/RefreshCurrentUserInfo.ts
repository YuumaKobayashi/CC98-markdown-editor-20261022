import { Action, ActionCreator, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import * as Actions from '../../Actions/UserCenter';
import { RootState, RootAction } from '../../Store';
import {
    refreshCurrentUser,
    type CurrentUser,
} from "@modules/session";

/**
 * 刷新当前用户的个人信息
 * @author AsukaSong
 */
export const refreshCurrentUserInfo: ActionCreator<ThunkAction<Promise<Action | CurrentUser>, RootState, void, RootAction>> = () => async (dispatch,getState) => {
    try {
        const userInfo = await dispatch(refreshCurrentUser((currentUser) => {
            // 保留旧顺序：先更新页面派生字段，再 dispatch 当前用户变更。
            getState().userInfo.browsingHistoryEnabled = currentUser.browsingHistoryEnabled;
        }) as any) as CurrentUser;
        return userInfo;
    } catch (e) {
        return dispatch(Actions.userCenterError(e.message));
    }
}
