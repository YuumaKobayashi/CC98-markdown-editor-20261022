import "es6-promise/auto";
import "core-js/shim";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import $ from "jquery";
import "whatwg-fetch";
import "blueimp-canvas-to-blob";
import { initWatermark } from "spatial-watermark";

import { createAppRoot } from "@app/providers/create-app-root";
import { registerLegacyUtilityEffects } from "@app/legacy/register-utility-effects";
import { Constants } from "@shared/config/runtime-config";
import { IndexedDB } from "@shared/storage/indexed-db";
import { shouldUseIndexedDb } from "@shared/config/platform";
import { checkThemeToChange } from "@shared/theme/runtime";
import moment from "moment";
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
  registerLegacyUtilityEffects();
  await Constants.loadConfig();
  if (shouldUseIndexedDb) await IndexedDB.start();

  // 输出一些没用的东西
  // console.info('%c       ', 'font-size: 100px; background: url(http://cdn.nyanit.com/nyan2.gif) no-repeat;');
  console.info("%cCC98 Durian", "font-size: 80px; fontFamily: Big");

  // 显示应用程序核心内容
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Cannot initialize CC98 Forum: #root element is missing.");
  }

  const root = createRoot(rootElement);
  flushSync(() => {
    root.render(createAppRoot());
  });

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
