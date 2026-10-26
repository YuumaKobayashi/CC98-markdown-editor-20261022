
/*
 *处理发帖回帖内容
 *如果存在合法的@，则会返回一个字符串数组，包含至多10个合法的被@用户的昵称，否则返回false
 */
export function atHanderler(content: string) {
  try {
    const reg1 = /([\s\S]*)\[quotex?\][\s\S]*?\[\/quotex?\]([\s\S]*)/;
    const reg2 = /@[^ \n]{1,10}?[ ]+/g;
    const reg3 = /[^@ ]+/;
    //不检测引用内容中的@
    //console.log("处理前内容", content);
    let str;
    do {
      str = content.match(reg1);
      if (str) {
        content = `${content.match(reg1)[1]}${content.match(reg1)[2]}`;
      }
    } while (str);
    console.log("非引用内容", content);
    if (content === "") {
      return false;
    } else if (content.match(reg2)) {
      //如果match方法返回了非null的值（即数组），则说明内容中存在合法的@
      let atNum = content.match(reg2).length; //合法的@数
      if (atNum > 10) atNum = 10; //至多10个
      let ats: string[] = new Array();
      for (let i = 0; i < atNum; i++) {
        let anAt = content.match(reg2)[i];

        let aUserName = reg3.exec(anAt)[0];

        ats[i] = aUserName;
      }
      return ats;
    } else {
      return false;
    }
  } catch (e) {
    return content;
  }
}

/**
 * 给ubb模式下的@添加链接指向个人中心
 * @param content
 */
export function atUserUbbUrl(content: string) {
  try {
    const reg = /@[^ \n]{1,10}?[ ]+/g;
    const reg2 = /[^@ ]+/;
    if (content === "") {
      return content;
    } else if (content.match(reg)) {
      //如果match方法返回了非null的值（即数组），则说明内容中存在合法的@
      let atNum = content.match(reg).length; //合法的@数
      if (atNum > 10) atNum = 10; //至多10个
      let ats: string[] = new Array();
      for (let i = 0; i < atNum; i++) {
        //提取@字符串
        let anAt = content.match(reg)[i];
        //提取@的用户名
        let aUserName = reg2.exec(anAt)[0];
        ats[i] = aUserName;
      }
      for (let i = 0; i < atNum; i++) {
        //给@用户名加上效果
        let atText = new RegExp(`@${ats[i]}[ ]`, "g");
        content = content.replace(
          atText,
          `[url="/user/name/${encodeURIComponent(ats[i])}"]@${ats[i]} [/url]`
        );
      }
      return content;
    } else {
      return content;
    }
  } catch (e) {
    return content;
  }
}

/**
 *  给markdown模式下的@添加链接指向个人中心
 * @param content
 */
export function atUserMdUrl(content: string) {
  try {
    const reg = /@[^ \n]{1,10}?[ ]+/g;
    const reg2 = /[^@ ]+/;
    if (content === "") {
      return content;
    } else if (content.match(reg)) {
      //如果match方法返回了非null的值（即数组），则说明内容中存在合法的@
      let atNum = content.match(reg).length; //合法的@数
      if (atNum > 10) atNum = 10; //至多10个
      let ats: string[] = new Array();
      for (let i = 0; i < atNum; i++) {
        //提取@字符串
        let anAt = content.match(reg)[i];
        //提取@的用户名
        let aUserName = reg2.exec(anAt)[0];
        ats[i] = aUserName;
      }
      for (let i = 0; i < atNum; i++) {
        //给@用户名加上效果
        const atText = new RegExp(`@${ats[i]} `, "g");
        content = content.replace(
          atText,
          `[@${ats[i]} ](/user/name/${encodeURIComponent(ats[i])})`
        );
      }
      return content;
    } else {
      return content;
    }
  } catch (e) {
    return content;
  }
}

/**
 * 将帖子内容中用户上传文件或图片的链接替换成https，避免浏览器因http拦截下载附件。
 * @param content
 */
export function replaceHttpToHttps(content: string): string {
  //http://file.cc98.org -> https://file.cc98.org
  return content.replace(/http:\/\/file\.cc98\.org/g, "https://file.cc98.org");
}

/**
 * 判断是否存在引用内容
 * @param content
 */
export function quoteJudger(content: string) {
  const reg = new RegExp("[(quotex?)].*[/(quotex?)]");
  if (content.match(reg) && content.match(reg)[1] === content.match(reg)[2]) {
    return true;
  } else {
    return false;
  }
}
