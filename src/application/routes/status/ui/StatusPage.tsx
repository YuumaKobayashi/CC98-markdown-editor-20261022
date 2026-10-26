import * as React from 'react';
import { Link } from 'react-router';

import DocumentTitle from "@foundation/ui/document-title";

import styles from "./StatusPage.module.scss";

interface StatusPageAction {
  label: string;
  to: string;
}

interface StatusPageProps {
  actions?: readonly StatusPageAction[];
  children: React.ReactNode;
  documentTitle: string;
  heading?: string;
  imageSrc?: string;
}

export function StatusPage({
  actions = [],
  children,
  documentTitle,
  heading,
  imageSrc,
}: StatusPageProps) {
  const illustrated = imageSrc !== undefined;

  return (
    <div className={illustrated ? styles.errorState : undefined}>
      <DocumentTitle title={documentTitle} />
      {imageSrc && (
        <div>
          <img className={styles.errorIcon} src={imageSrc} />
        </div>
      )}
      {heading && <div className={styles.errorTitle}>{heading}</div>}
      {children}
      {actions.map(({ label, to }) => (
        <div className={styles.returnIndexBtn} key={`${to}-${label}`}>
          <Link to={to}>{label}</Link>
        </div>
      ))}
    </div>
  );
}

export const LogOut = () => (
  <StatusPage
    actions={[{ label: "点我登录", to: "/logon" }]}
    documentTitle="您未登录 - CC98论坛"
    heading="糟糕！好像出错了"
    imageSrc="/static/images/401.webp"
  >
    <div className={styles.errorText}>您当前未登录</div>
  </StatusPage>
);

export const TopicDeleted = () => (
  <StatusPage
    actions={[{ label: "返回首页", to: "/" }]}
    documentTitle="帖子被删除了 - CC98论坛"
    heading="糟糕！好像出错了"
    imageSrc="/static/images/404.webp"
  >
    <div className={styles.errorText}>帖子被删除</div>
  </StatusPage>
);

export const Disconnected = () => (
  <StatusPage documentTitle="网络中断 - CC98论坛">
    <div>网络连接中断</div>
  </StatusPage>
);

export const UnauthorizedBoard = () => (
  <StatusPage
    actions={[
      { label: "返回首页", to: "/" },
      { label: "点我登录", to: "/logon" },
    ]}
    documentTitle="您没有权限进入这个版面 - CC98论坛"
    heading="糟糕！好像出错了"
    imageSrc="/static/images/401.webp"
  >
    <div className={styles.errorText}>您没有权限进入这个版面或未登陆</div>
  </StatusPage>
);

export const UnauthorizedTopic = () => (
  <StatusPage
    actions={[{ label: "返回首页", to: "/" }]}
    documentTitle="您没有权限进入这个主题 - CC98论坛"
    heading="糟糕！好像出错了"
    imageSrc="/static/images/401.webp"
  >
    <div className={styles.errorText}>您没有权限进入这个主题</div>
  </StatusPage>
);

export const UnauthorizedOperation = () => (
  <StatusPage
    actions={[{ label: "返回首页", to: "/" }]}
    documentTitle="您没有权限执行这个操作 - CC98论坛"
    heading="糟糕！好像出错了"
    imageSrc="/static/images/401.webp"
  >
    <div className={styles.errorText}>您没有权限进行这个操作</div>
  </StatusPage>
);

export const NotFoundBoard = () => (
  <StatusPage
    actions={[{ label: "返回首页", to: "/" }]}
    documentTitle="版面不存在 - CC98论坛"
    heading="糟糕！好像出错了"
    imageSrc="/static/images/404.webp"
  >
    <div className={styles.errorText}>版面不存在</div>
  </StatusPage>
);

export const NotFoundTopic = () => (
  <StatusPage
    actions={[{ label: "返回首页", to: "/" }]}
    documentTitle="帖子不存在 - CC98论坛"
    heading="糟糕！好像出错了"
    imageSrc="/static/images/404.webp"
  >
    <div className={styles.errorText}>帖子不存在</div>
  </StatusPage>
);

export const CannotPost = () => (
  <StatusPage
    actions={[{ label: "返回首页", to: "/" }]}
    documentTitle="您还不能发帖 - CC98论坛"
    heading="糟糕！好像出错了"
    imageSrc="/static/images/403.webp"
  >
    <div className={styles.errorText}>
      你无法在本版发帖，可能的原因有：权限不足、未达到发帖门槛、版面已锁定、账号受到处罚等。
    </div>
  </StatusPage>
);

export const NotFoundUser = () => (
  <StatusPage
    actions={[{ label: "返回首页", to: "/" }]}
    documentTitle="用户不存在 - CC98论坛"
    heading="糟糕！好像出错了"
    imageSrc="/static/images/404.webp"
  >
    <div className={styles.errorText}>用户不存在</div>
  </StatusPage>
);

export const ServerError = () => (
  <StatusPage
    actions={[{ label: "返回首页", to: "/" }]}
    documentTitle="服务器发送错误 - CC98论坛"
    heading="糟糕！好像出错了"
    imageSrc="/static/images/500.webp"
  >
    <div className={styles.errorText}>服务器发送错误</div>
  </StatusPage>
);

export const ContentNeeded = () => (
  <StatusPage documentTitle="请输入内容 - CC98论坛">
    <div className={styles.errorText}>402需要输入内容</div>
  </StatusPage>
);

export const OperationForbidden = () => (
  <StatusPage
    actions={[{ label: "返回首页", to: "/" }]}
    documentTitle="操作失败或被拒绝 - CC98论坛"
    heading="糟糕！好像出错了"
    imageSrc="/static/images/403.webp"
  >
    <div className={styles.errorText}>操作失败或被拒绝</div>
  </StatusPage>
);

export const PageNotFound = () => (
  <StatusPage
    actions={[{ label: "返回首页", to: "/" }]}
    documentTitle="页面不存在 - CC98论坛"
    heading="糟糕！好像出错了"
    imageSrc="/static/images/404.webp"
  >
    <div className={styles.errorText}>页面不存在</div>
  </StatusPage>
);

export const TooFrequentSearch = () => (
  <StatusPage
    actions={[{ label: "返回首页", to: "/" }]}
    documentTitle="操作失败或被拒绝 - CC98论坛"
    heading="糟糕！好像出错了"
    imageSrc="/static/images/403.webp"
  >
    <div className={styles.errorText}>可能的原因有：</div>
    <div className={styles.errorText}>1. 你没有权限进行该操作；</div>
    <div className={styles.errorText}>
      2. 你的请求过快。出于服务器性能考虑，目前设定为10秒内最多搜索一次。
    </div>
  </StatusPage>
);
