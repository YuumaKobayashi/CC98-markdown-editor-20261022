import type { UserInfo } from "../model/dto";

import {
    readUsersInfoCache,
    writeUserInfoCache
} from "../cache/public-user-cache";

import { formAuthorizeHeader } from "@modules/session";
import { cc98Fetch } from "@foundation/api/http";

/**
 * 使用用户id批量查询用户信息
 * @param {number} userIds 用户id
 * @returns {Promise<UserInfo[]>} 用户信息
 * @author AsukaSong
 */
export async function getUsersInfo(userIds: number[]): Promise<(UserInfo | undefined)[] | undefined>;
/**
 * 使用用户名批量查询用户信息
 * @param {string} userNames 用户名
 * @returns {Promise<UserInfo[]>} 用户信息
 * @author AsukaSong
 */
export async function getUsersInfo(userNames: string[]): Promise<(UserInfo | undefined)[] | undefined>;
export async function getUsersInfo(keys: (number | string)[]): Promise<(UserInfo | undefined)[] | undefined> {
    try {
        // 缓存未命中的项，其值为对应的key，以便进一步通过api查询
        let infos: (UserInfo | number | string)[];
        infos = (await readUsersInfoCache(keys)).map((item, index) => (item || keys[index]));

        // 批量查询未命中的项
        let querys = infos.filter(item => (typeof item === 'number' || typeof item === 'string')) as number[] | string[];
        let queryInfo: UserInfo[] = [];
        if(querys.length !== 0){
            const url = keys.some(key => typeof key === 'number') ? `/user?id=${querys.join('&id=')}` : `/user/name?name=${querys.map(encodeURIComponent).join('&name=')}`;
            let headers = await formAuthorizeHeader();
            let res = await cc98Fetch(url, { headers });
            queryInfo = (await res.json()) as UserInfo[];
        }

        // 填充通过api查到的项
        let userInfos = infos.map(item => {
            if(typeof item === 'number' || typeof item === 'string') {
                let userInfo = queryInfo.shift();
                // 未命中的项加入缓存
                if(userInfo){
                    void writeUserInfoCache(userInfo);

                    return userInfo;
                }
            } else {

                return item;
            }
        })

        return userInfos;

    } catch(e) {
        console.log(e)
    }
}
