import type { UserInfo } from "../model/types";

import {
    readUserInfoCache,
    writeUserInfoCache
} from "../cache/public-user-cache";

import { formAuthorizeHeader } from "@modules/session";
import { cc98Fetch } from "@foundation/api/http";

/**
 * 使用用户id查询用户信息
 * @param {number} userId 用户id
 * @returns {Promise<UserInfo>} 用户信息
 * @author AsukaSong
 */
export async function getUserInfo(userId: number): Promise<UserInfo | undefined>;
/**
 * 使用用户名查询用户信息
 * @param {string} userName 用户名
 * @returns {Promise<UserInfo>} 用户信息
 * @author AsukaSong
 */
export async function getUserInfo(userName: string): Promise<UserInfo | undefined>;
export async function getUserInfo(key: number | string): Promise<UserInfo | undefined> {
    let userInfo: UserInfo;
    try {
        // 在缓存中查询
        userInfo = await readUserInfoCache(key);
        if(userInfo) return userInfo;

        // api请求
        const url = typeof key === 'number' ? `/user/${key}` : `/user/name/${encodeURIComponent(key)}`;
        let headers = await formAuthorizeHeader();
        let res = await cc98Fetch(url, { headers });
        userInfo = (await res.json()) as UserInfo;

        //缓存
        void writeUserInfoCache(userInfo);

        return userInfo;
    } catch(e) {

    }
}
