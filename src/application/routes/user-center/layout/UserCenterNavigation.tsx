import * as React from "react";
import $ from "jquery";
import { NavLink } from "react-router";
import styles from "./UserCenterNavigation.module.scss";

const navigationClassName = (baseClassName: string) =>
  ({ isActive }: { isActive: boolean }) =>
    isActive
      ? `${baseClassName} ${styles["user-center-navigation-active"]}`
      : baseClassName;

/**
 * 用户中心侧边栏导航组件
 */
export function UserCenterNavigation() {
  const [buttonClassName, setButtonClassName] = React.useState("");

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 234) {
        setButtonClassName(styles["btn-show"]);
      }

      if (window.pageYOffset < 234) {
        setButtonClassName((currentClassName) =>
          currentClassName === "" ? "" : styles["btn-disappare"],
        );
      }
    };

    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    $("body,html").animate({ scrollTop: 0 }, 500);
  };

  return (
    <div className={styles["user-center-navigation"]} id="userCenterNavigation">
      <ul>
        <li>
          <NavLink to="/usercenter" end className={navigationClassName("fa-home")}>
            <div className={styles["center-nav-item"]}>个人主页</div>
          </NavLink>
        </li>
        <hr />
        <li>
          <NavLink to="/usercenter/config" className={navigationClassName("fa-cog")}>
            <div className={styles["center-nav-item"]}>修改资料</div>
          </NavLink>
        </li>
        <hr />
        <li>
          <NavLink
            to="/usercenter/mytopics"
            className={navigationClassName("fa-pencil-square-o")}
          >
            <div className={styles["center-nav-item"]}>我的主题</div>
          </NavLink>
        </li>
        <hr />
        <li>
          <NavLink
            to="/usercenter/myposts"
            className={navigationClassName("fa-mail-reply")}
          >
            <div className={styles["center-nav-item"]}>我的回复</div>
          </NavLink>
        </li>
        <hr />
        <li>
          <NavLink
            to="/usercenter/myhistory"
            className={navigationClassName("fa-history")}
          >
            <div className={styles["center-nav-item"]}>我的足迹</div>
          </NavLink>
        </li>
        <hr />
        <li>
          <NavLink
            to="/usercenter/myfavorites"
            className={navigationClassName("fa-star")}
          >
            <div className={styles["center-nav-item"]}>我的收藏</div>
          </NavLink>
        </li>
        <hr />
        <li>
          <NavLink
            to="/usercenter/mycustomboards"
            className={navigationClassName("fa-rss")}
          >
            <div className={styles["center-nav-item"]}>关注版面</div>
          </NavLink>
        </li>
        <hr />
        <li>
          <NavLink
            to="/usercenter/myfollowings"
            className={navigationClassName("fa-heart")}
          >
            <div className={styles["center-nav-item"]}>关注用户</div>
          </NavLink>
        </li>
        <hr />
        <li>
          <NavLink
            to="/usercenter/myfans"
            className={navigationClassName("fa-users")}
          >
            <div className={styles["center-nav-item"]}>我的粉丝</div>
          </NavLink>
        </li>
        <hr />
        <li>
          <NavLink
            to="/usercenter/transferwealth"
            className={navigationClassName("fa-credit-card")}
          >
            <div className={styles["center-nav-item"]}>转账系统</div>
          </NavLink>
        </li>
        <hr />
        <li>
          <NavLink
            to="/usercenter/theme"
            className={navigationClassName("fa-magic")}
          >
            <div className={styles["center-nav-item"]}>切换皮肤</div>
          </NavLink>
        </li>
      </ul>
      <button
        type="button"
        id="scrollToTop"
        className={buttonClassName}
        onClick={scrollToTop}
      >
        <div>回到顶部</div>
      </button>
    </div>
  );
}
