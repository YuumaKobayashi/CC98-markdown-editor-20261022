// A '.tsx' file enables JSX support in the TypeScript compiler,
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import * as React from "react";
import { NavLink } from "react-router";
import $ from "jquery";

type props = {};

const navigationClassName = (baseClassName: string) =>
  ({ isActive }: { isActive: boolean }) =>
    isActive
      ? `${baseClassName} user-center-navigation-active`
      : baseClassName;

/**
 * 用户中心侧边栏导航组件
 */
export default class extends React.Component<props, UserCenterNavigationState> {
  constructor(props) {
    super(props);
    this.state = {
      buttonClassName: "",
    };
    this.handleScroll = this.handleScroll.bind(this);
  }

  handleScroll(e) {
    if (window.pageYOffset > 234) {
      this.setState({
        buttonClassName: "btn-show",
      });
    }

    if (window.pageYOffset < 234) {
      this.setState((prevState) => ({
        buttonClassName: prevState.buttonClassName === "" ? "" : "btn-disappare",
      }));
    }
  }

  componentDidMount() {
    document.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    document.removeEventListener("scroll", this.handleScroll);
  }

  scrollToTop() {
    $("body,html").animate({ scrollTop: 0 }, 500);
  }

  render() {
    return (
      <div className="user-center-navigation" id="userCenterNavigation">
        <ul>
          <li>
            <NavLink to="/usercenter" end className={navigationClassName("fa-home")}>
              <div className="center-nav-item">个人主页</div>
            </NavLink>
          </li>
          <hr />
          <li>
            <NavLink to="/usercenter/config" className={navigationClassName("fa-cog")}>
              <div className="center-nav-item">修改资料</div>
            </NavLink>
          </li>
          <hr />
          <li>
            <NavLink
              to="/usercenter/mytopics"
              className={navigationClassName("fa-pencil-square-o")}
            >
              <div className="center-nav-item">我的主题</div>
            </NavLink>
          </li>
          <hr />
          <li>
            <NavLink to="/usercenter/myposts" className={navigationClassName("fa-mail-reply")}>
              <div className="center-nav-item">我的回复</div>
            </NavLink>
          </li>
          <hr />
          <li>
            <NavLink to="/usercenter/myhistory" className={navigationClassName("fa-history")}>
              <div className="center-nav-item">我的足迹</div>
            </NavLink>
          </li>
          <hr />
          <li>
            <NavLink to="/usercenter/myfavorites" className={navigationClassName("fa-star")}>
              <div className="center-nav-item">我的收藏</div>
            </NavLink>
          </li>
          <hr />
          <li>
            <NavLink to="/usercenter/mycustomboards" className={navigationClassName("fa-rss")}>
              <div className="center-nav-item">关注版面</div>
            </NavLink>
          </li>
          <hr />
          <li>
            <NavLink to="/usercenter/myfollowings" className={navigationClassName("fa-heart")}>
              <div className="center-nav-item">关注用户</div>
            </NavLink>
          </li>
          <hr />
          <li>
            <NavLink to="/usercenter/myfans" className={navigationClassName("fa-users")}>
              <div className="center-nav-item">我的粉丝</div>
            </NavLink>
          </li>
          <hr />
          <li>
            <NavLink
              to="/usercenter/transferwealth"
              className={navigationClassName("fa-credit-card")}
            >
              <div className="center-nav-item">转账系统</div>
            </NavLink>
          </li>
          <hr />
          <li>
            <NavLink to="/usercenter/theme" className={navigationClassName("fa-magic")}>
              <div className="center-nav-item">切换皮肤</div>
            </NavLink>
          </li>
        </ul>
        <button type="button" id="scrollToTop" className={this.state.buttonClassName} onClick={this.scrollToTop}>
        <div className="top-button-text">回到顶部</div>
        </button>
      </div>
    );
  }
}

interface UserCenterNavigationState {
  buttonClassName: string;
}
