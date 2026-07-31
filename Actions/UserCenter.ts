import * as ActionTypes from '../ActionTypes';
import { createAction } from './ActionCreator';

export const resetUserInfoAfterLogin = createAction(ActionTypes.RESET_USER_INFO_AFTER_LOGIN);

export const userCenterError = createAction(ActionTypes.USER_CENTER_FETCH_ERROR, (message: string) => ({
    type: ActionTypes.USER_CENTER_FETCH_ERROR,
    payload: { message }
}));
