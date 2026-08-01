import * as React from "react";

import { useAppDispatch } from "@application/store";
import { logIn } from "@modules/session";
import { changeTheme } from "@foundation/theme";
import DocumentTitle from "@foundation/ui/document-title";
import styles from "../Login.module.scss";
import messageStyles from "../LoginMessages.module.scss";

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

    element.classList.add(styles.shake);
    const timer = window.setTimeout(() => {
      element.classList.remove(styles.shake);
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

    try {
      const userInfo = await dispatch(
        logIn({ userName: loginName, password: loginPassword })
      );

      setLoginMessage("登录成功 正在返回");
      changeTheme(userInfo.theme);

      const timer = window.setTimeout(() => {
        timersRef.current.delete(timer);
        window.location.href = getLoginReturnUrl();
      }, 100);
      timersRef.current.add(timer);
    } catch (error) {
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
    }
  };

  return (
    <div>
      <div className={messageStyles["login-announcement"]}>
        <p className={messageStyles["login-message"]}>
          <span>
            温馨提示：
            <br />
            　　本论坛仅限校内交流使用，任何内容在未经允许的情况下禁止外传到公网。按照网络实名制的要求及学校和论坛的相关规定，本论坛账号禁止外借他人使用。违规用户将视情节轻重进行全站处罚。请全体用户共同珍惜和维护良好的讨论环境。
          </span>
        </p>
      </div>
      <div className={styles.login}>
        <DocumentTitle title="登录 - CC98论坛" />
        <div>
          <img src="/static/images/login.png" />
          <div>
            <img src="/static/images/login_welcome.png" />
            <form onSubmit={handleLogin} autoComplete="on">
              <div className={styles["login-form"]}>
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
              <div className={styles["login-form"]}>
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
              <p
                className={`${messageStyles["login-message"]} ${styles.loginMessage}`}
              >
                {loginMessage}
              </p>
              <button type="submit" disabled={isLoggingIn}>
                登录账号
              </button>
            </form>
            <p className={messageStyles["login-message"]}>
              <span>
                还没账号？我要{" "}
                <a href="//account.cc98.org/" target="_blank">
                  注册
                </a>
              </span>
            </p>
            <p className={messageStyles["login-message"]}>
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
