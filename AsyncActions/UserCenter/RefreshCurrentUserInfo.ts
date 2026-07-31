import { Action, ActionCreator } from 'redux';
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
export const refreshCurrentUserInfo: ActionCreator<ThunkAction<Promise<Action | CurrentUser>, RootState, void, RootAction>> = () => async (dispatch) => {
    try {
        const userInfo = await dispatch(refreshCurrentUser() as any) as CurrentUser;
        return userInfo;
    } catch (e) {
        return dispatch(Actions.userCenterError(e.message));
    }
}
