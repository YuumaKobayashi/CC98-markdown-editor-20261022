import { formAuthorizeHeader } from "@modules/session/api/session";
import { cc98Fetch } from "@foundation/api/http";
import type {
  MakeUpMissedSigninResponseDto,
  MakeUpMissedSigninResult,
  ServerNowResultDto,
  UserSignInDailyInfo,
  UserSignInStateInfo,
} from "../model/dto";

export async function getServerNow(): Promise<ServerNowResultDto | undefined> {
  const headers = await formAuthorizeHeader();
  const response = await cc98Fetch("/config/now", {
    method: "GET",
    headers,
  });
  if (!response.ok) {
    console.error("Failed to fetch signin info:", response.statusText);
    return;
  }
  return (await response.json()) as ServerNowResultDto;
}

export async function getSigninInMonth(
  year: number,
  month: number,
): Promise<UserSignInDailyInfo[] | null> {
  const headers = await formAuthorizeHeader();
  const response = await cc98Fetch(
    `/me/signin-in-month?year=${year}&month=${month}`,
    { method: "GET", headers },
  );
  if (!response.ok) {
    console.error(
      `Failed to fetch signin info for ${year}-${month}:`,
      response.statusText,
    );
    return null;
  }
  return (await response.json()) as UserSignInDailyInfo[];
}

export async function makeUpMissedSignin(): Promise<MakeUpMissedSigninResult> {
  try {
    const headers = await formAuthorizeHeader();
    const response = await cc98Fetch("/me/make-up-missed-signin", {
      method: "POST",
      headers,
    });
    if (!response.ok) {
      return {
        ok: false,
        errorMessage: response.statusText || "补签请求失败",
      };
    }

    const data = (await response.json()) as MakeUpMissedSigninResponseDto;
    if (data.errorCode !== 0) {
      return { ok: false, errorMessage: data.extra || "补签卡使用失败" };
    }
    if (!Number.isInteger(data.data) || data.data < 0) {
      return { ok: false, errorMessage: "补签结果无效" };
    }
    return { ok: true, lastSignInCount: data.data };
  } catch {
    return { ok: false, errorMessage: "补签请求失败" };
  }
}

export async function signin(content: string): Promise<void> {
  const headers = await formAuthorizeHeader();
  headers.append("Content-Type", "application/json");
  const url = `/me/signin`;
  const response = await cc98Fetch(url, {
    method: "POST",
    headers,
    body: content,
  });
}

export async function getSigninInfo(): Promise<UserSignInStateInfo> {
  const headers = await formAuthorizeHeader();
  const url = `/me/signin`;
  const response = await cc98Fetch(url, { headers });
  const data = (await response.json()) as UserSignInStateInfo;
  return data;
}
