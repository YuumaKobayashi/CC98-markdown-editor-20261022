import "es6-promise/auto";
import "core-js/shim";
import * as ReactDOM from "react-dom";
import $ from "jquery";
import "whatwg-fetch";
import "blueimp-canvas-to-blob";
import { initWatermark } from "spatial-watermark";

import { createAppRoot } from "@app/providers/create-app-root";
import { Constants } from "@legacy/Components/Constant";
import { IndexedDB } from "@legacy/IndexedDB/IndexedDB";
import { shouldUseIndexedDb } from "@legacy/config";
import moment from "moment";
import { checkThemeToChange } from "@legacy/Utility";
moment.locale("zh-cn");

/**
 * 定时器回调函数集合。
 */
const timerCallbacks: (() => void)[] = [];

/**
 * 定时器回调核心方法。
 */
function timeoutCore() {
  for (let item of timerCallbacks) {
    item();
  }
}

/**
 * 初始化网页定时器。
 */
function initializeTimer() {
  window.setInterval(timeoutCore, 1000);
}

/**
 * 为系统添加一个新的定时器回调过程。
 * @param {function} callback 要添加的定时器回调过程方法。
 */
export function addTimerCallback(callback: () => void) {
  timerCallbacks.push(callback);
}

/**
 * 项目初始化代码
 */
async function initialize() {
  await Constants.loadConfig();
  if (shouldUseIndexedDb) await IndexedDB.start();

  // 输出一些没用的东西
  // console.info('%c       ', 'font-size: 100px; background: url(http://cdn.nyanit.com/nyan2.gif) no-repeat;');
  console.info("%cCC98 Durian", "font-size: 80px; fontFamily: Big");

  // 显示应用程序核心内容
  ReactDOM.render(createAppRoot(), document.getElementById("root"));

  if (process.env.NODE_ENV === "development") {
    const { whyDidYouUpdate } = require("why-did-you-update");
    //	whyDidYouUpdate(React);
  } else {
    initWatermark();
  }

  initializeTimer();

  // 添加主题检查程序
  addTimerCallback(checkThemeToChange);
}

initialize();
