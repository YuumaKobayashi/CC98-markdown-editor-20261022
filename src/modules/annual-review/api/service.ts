import { formAuthorizeHeader, isLogOn } from "@modules/session";
import { cc98Fetch } from "@foundation/api/http";
import { throwLegacyError } from "@foundation/lib/legacy-utility-effects";

export async function getAnnualReview() {
  if (!isLogOn()) {
    throwLegacyError("LogOut");
    return null;
  }
  const url = "/me/annual-review-2022";
  const headers = await formAuthorizeHeader();
  const response = await cc98Fetch(url, { headers });
  return await response.json();
}

/**
 * 获取年度总结v2.0
 * @param year 年度总结的年份
 * @returns 年度总结数据
 */
export async function getAnnualReviewV2(year) {
  if (!isLogOn()) {
    throwLegacyError("LogOut");
    return null;
  }
  const url = `/me/annual-review-${year}`;
  const headers = await formAuthorizeHeader();
  const response = await cc98Fetch(url, { headers });
  return await response.json();
}
