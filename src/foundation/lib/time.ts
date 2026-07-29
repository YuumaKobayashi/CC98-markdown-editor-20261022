import moment from "moment";

/**
 * api返回的UTC时间格式转换成时间戳的函数
 * @param time
 */
export function transerTime(time) {
  let time1 = moment(time).format("YYYY-MM-DD HH:mm:ss");
  let timestamp = new Date(time1.replace(/-/g, "/")).getTime();
  return timestamp;
}

/**
 * api返回的UTC时间格式转换成"1分钟前，昨天18：45"这样的形式
 * @param time
 */
export function transerRecentTime(time, showSecond = true) {
  let time1 = moment(time).format("YYYY/MM/DD HH:mm:ss");
  let thatDate = new Date(time1);
  let thatTime = thatDate.getTime();
  let thisDate = new Date();
  let thisTime = new Date().getTime();
  let delta =
    (new Date(new Date().setHours(0, 0, 0, 0)).getTime() +
      86400000 -
      thatTime) /
    1000;
  let month: any = thatDate.getMonth() + 1;
  if (month < 10) {
    month = `0${month}`;
  }
  let date: any = thatDate.getDate();
  if (date < 10) {
    date = `0${date}`;
  }
  let hours: any = thatDate.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let min: any = thatDate.getMinutes();
  if (min < 10) {
    min = `0${min}`;
  }
  let sec: any = thatDate.getSeconds();
  if (sec < 10) {
    sec = `0${sec}`;
  }
  if (delta > 259200) {
    let strTime = showSecond ?
      `${thatDate.getFullYear()}-${month}-${date} ${hours}:${min}:${sec}` :
      `${thatDate.getFullYear()}-${month}-${date} ${hours}:${min}`;
    return strTime;
  } else if (delta > 172800) {
    let strTime = showSecond ?
      `${hours}:${min}:${sec}` :
      `${hours}:${min}`;
    return `前天 ${strTime}`;
  } else if (delta > 86400) {
    let strTime = showSecond ?
      `${hours}:${min}:${sec}` :
      `${hours}:${min}`;
    return `昨天 ${strTime}`;
  } else if (thisTime - thatTime > 3600000) {
    let strTime = showSecond ?
      `${hours}:${min}:${sec}` :
      `${hours}:${min}`;
    return `今天 ${strTime}`;
  } else if (thisTime - thatTime > 0) {
    let min0: any = (thisTime - thatTime) / 60000;
    min = parseInt(min0);
    return `${min}分钟前`;
  } else {
    let strTime = showSecond ?
      `${thatDate.getFullYear()}-${month}-${date} ${hours}:${min}:${sec}` :
      `${thatDate.getFullYear()}-${month}-${date} ${hours}:${min}`;
    return strTime;
  }
}

export function transerTimeToYearMonthDay(time) {
  let time1 = moment(time).format("YYYY/MM/DD HH:mm:ss");
  let thatDate = new Date(time1);
  let thatTime = thatDate.getTime();
  let thisDate = new Date();
  let thisTime = new Date().getTime();
  let delta =
    (new Date(new Date().setHours(0, 0, 0, 0)).getTime() +
      86400000 -
      thatTime) /
    1000;
  let month: any = thatDate.getMonth() + 1;
  if (month < 10) {
    month = `0${month}`;
  }
  let date: any = thatDate.getDate();
  if (date < 10) {
    date = `0${date}`;
  }

  let strTime = `${thatDate.getFullYear()}-${month}-${date}`;
  return strTime;
}
