import * as React from "react";

import { Actions, useAppDispatch } from "@app/store";
import { getMyInfo } from "@entities/user/storage/current-user";
import { refreshUserInfo } from "@features/account/api/service";
import { Constants } from "@foundation/config/runtime-config";
import {
  removeLocalStorage,
  removeStorage,
  setLocalStorage,
} from "@foundation/storage/web-storage";
import { changeTheme } from "@foundation/theme/runtime";
import DocumentTitle from "@foundation/ui/document-title";

type TokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
};

const getLoginReturnUrl = (): string => {
  if (window.history.length === 1) return "/";

  const storedUrl = localStorage.getItem("logOnRedirectUrl");
  if (!storedUrl) return "/";

  try {
    const parsedUrl = new URL(storedUrl, window.location.origin);
    return parsedUrl.origin === window.location.origin ? parsedUrl.href : "/";
  } catch {
    return "/";
  }
};

export function LoginPage() {
  const dispatch = useAppDispatch();
  const [loginName, setLoginName] = React.useState("");
  const [loginPassword, setLoginPassword] = React.useState("");
  const [loginMessage, setLoginMessage] = React.useState("");
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);
  const loginNameRef = React.useRef<HTMLInputElement>(null);
  const loginPasswordRef = React.useRef<HTMLInputElement>(null);
  const timersRef = React.useRef<Set<number>>(new Set());

  React.useEffect(
    () => () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
      timersRef.current.clear();
    },
    []
  );

  const shake = (element: HTMLInputElement | null) => {
    if (!element) return;

    element.classList.add("shake");
    const timer = window.setTimeout(() => {
      element.classList.remove("shake");
      timersRef.current.delete(timer);
    }, 500);
    timersRef.current.add(timer);
    element.focus();
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoggingIn) return;

    if (!loginName) {
      setLoginMessage("请输入用户名");
      shake(loginNameRef.current);
      return;
    }
    if (!loginPassword) {
      setLoginMessage("请输入密码");
      shake(loginPasswordRef.current);
      return;
    }

    setLoginMessage("登录中");
    setIsLoggingIn(true);
    dispatch(Actions.userLogOff());

    try {
      const requestBody = new URLSearchParams({
        client_id: "9a1fd200-8687-44b1-4c20-08d50a96e5cd",
        client_secret: "REDACTED_CLIENT_SECRET",
        grant_type: "password",
        username: loginName,
        password: loginPassword,
        scope: "cc98-api openid offline_access",
      });
      const response = await fetch(
        `${Constants.config.openIdUrl}/connect/token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: requestBody,
        }
      );

      if (response.status !== 200) {
        throw new Error(response.status.toString());
      }

      const data = (await response.json()) as TokenResponse;
      const token = `${data.token_type} ${data.access_token}`;
      removeStorage("mainAds-v2");
      setLocalStorage("accessToken", token, data.expires_in);
      setLocalStorage("refresh_token", data.refresh_token, 2592000);
      await refreshUserInfo();

      const userInfo = getMyInfo();
      if (userInfo.lockState === 1 || userInfo.lockState === 2) {
        throw new Error("账号已锁定");
      }

      setLoginMessage("登录成功 正在返回");
      changeTheme(userInfo.theme);
      dispatch(Actions.userLogIn());

      const timer = window.setTimeout(() => {
        timersRef.current.delete(timer);
        window.location.href = getLoginReturnUrl();
      }, 100);
      timersRef.current.add(timer);
    } catch (error) {
      removeLocalStorage("userInfo");
      removeLocalStorage("accessToken");
      removeLocalStorage("refresh_token");

      const message = error instanceof Error ? error.message : String(error);
      let info: string;
      switch (message) {
        case "400":
          info = "密码错误";
          break;
        case "账号已锁定":
          info = "账号已锁定";
          break;
        default:
          info = `未知错误 ${message}`;
      }
      setLoginMessage(`登录失败 ${info}`);
      setIsLoggingIn(false);
      dispatch(Actions.userLogOff());
    }
  };

  return (
    <div>
      <div className="login-announcement">
        <p className="login-message">
          <span>
            温馨提示：
            <br />
            　　本论坛仅限校内交流使用，任何内容在未经允许的情况下禁止外传到公网。按照网络实名制的要求及学校和论坛的相关规定，本论坛账号禁止外借他人使用。违规用户将视情节轻重进行全站处罚。请全体用户共同珍惜和维护良好的讨论环境。
          </span>
        </p>
      </div>
      <div className="login">
        <DocumentTitle title="登录 - CC98论坛" />
        <div>
          <img src="/static/images/login.png" />
          <div>
            <img src="/static/images/login_welcome.png" />
            <form onSubmit={handleLogin} autoComplete="on">
              <div className="login-form">
                <p>用户名</p>
                <input
                  ref={loginNameRef}
                  name="username"
                  type="text"
                  id="loginName"
                  onChange={(event) => setLoginName(event.target.value)}
                  value={loginName}
                  autoComplete="username"
                />
              </div>
              <div className="login-form">
                <p>密码</p>
                <input
                  ref={loginPasswordRef}
                  name="password"
                  type="password"
                  id="loginPassword"
                  onChange={(event) => setLoginPassword(event.target.value)}
                  value={loginPassword}
                  autoComplete="current-password"
                />
              </div>
              <p className="login-message" id="loginMessage">
                {loginMessage}
              </p>
              <button type="submit" disabled={isLoggingIn}>
                登录账号
              </button>
            </form>
            <p className="login-message">
              <span>
                还没账号？我要{" "}
                <a href="//account.cc98.org/" target="_blank">
                  注册
                </a>
              </span>
            </p>
            <p className="login-message">
              <span>
                密码错误？我要{" "}
                <a href="//account.cc98.org/" target="_blank">
                  找回
                </a>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
