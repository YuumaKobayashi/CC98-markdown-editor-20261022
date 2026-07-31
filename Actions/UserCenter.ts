import * as ActionTypes from '../ActionTypes';
import { createAction } from './ActionCreator';

export const resetUserInfoAfterLogin = createAction(ActionTypes.RESET_USER_INFO_AFTER_LOGIN);

export const userNotFound = createAction(ActionTypes.USER_NOT_FOUND);

export const userLookupStarted = createAction(ActionTypes.USER_LOOKUP_STARTED);

export const userCenterLoading = createAction(ActionTypes.USER_CENTER_LOADING);

export const userCenterLoaded = createAction(ActionTypes.USER_CENTER_LOADED);

export const userCenterSolveError = createAction(ActionTypes.USER_CENTER_SOLVE_ERROR);

export const changeCurrentVisitingUserPage = createAction(ActionTypes.CHANGE_VISITING_USER, (page: 'exact' | 'manage' = 'exact', id: number) => ({
    type: ActionTypes.CHANGE_VISITING_USER,
    payload: {
        page,
        id
    }
}));

export const userCenterError = createAction(ActionTypes.USER_CENTER_FETCH_ERROR, (message: string) => ({
    type: ActionTypes.USER_CENTER_FETCH_ERROR,
    payload: { message }
}));

export const userCenterTransferWealthSuccess = createAction(ActionTypes.USER_CENTER_TRANSFER_WEALTH_SUCCESS, (userNames: string[]) => ({
    type: ActionTypes.USER_CENTER_TRANSFER_WEALTH_SUCCESS,
    payload: { userNames }
}));
