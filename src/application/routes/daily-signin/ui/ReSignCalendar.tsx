import moment from "moment";
import React, { useEffect } from "react";
import CC98Calendar from "./CC98Calendar";
import { Button, DatePicker, message, Popover, Radio } from "antd";
import {
  LeftOutlined,
  QuestionCircleOutlined,
  RightOutlined,
} from "@ant-design/icons";
import {
  formAuthorizeHeader,
  getMyInfo,
  refreshUserInfo,
} from "@modules/session";
import {
  getServerNow,
  getSigninInMonth,
} from "@modules/daily-signin/api/service";
import { cc98Fetch } from "@foundation/api/http";
import type { UserSignInDailyInfo } from "@modules/daily-signin/model/dto";
import styles from "./ReSignCalendar.module.scss";

interface ResignCalendarProps {
  updateSigninInfo?: (number) => void;
}

const ResignCalendar: React.FC<ResignCalendarProps> = (props) => {
  const [dateNow, setDateNow] = React.useState<moment.Moment | null>(null);
  const [signinInfo, setSigninInfo] = React.useState<
    UserSignInDailyInfo[] | null
  >(null);
  const [datePicker, setDatePicker] = React.useState<moment.Moment | null>(
    null
  );
  const [signInCardCount, setSignInCardCount] = React.useState<number>(0);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const dateNow = await fetchServerDate();
    setDateNow(dateNow);
    setDatePicker(dateNow.clone());
    fetchSigninInfo(dateNow.year(), dateNow.month() + 1);
    const userInfo = getMyInfo();
    setSignInCardCount(userInfo.signInCardCount || 0);
  };

  const fetchServerDate = async () => {
    const data = await getServerNow();
    if (!data) return;
    return moment(data.data);
  };

  /**
   * 获取指定年份与月份的签到信息。
   *
   * @param {number} year  - 年份，例如 2025
   * @param {number} month - 月份（1～12），例如 5
   * @returns {Promise<any|null>}
   *    返回对应月份的签到数据，如果请求失败则返回 null。
   */
  const fetchSigninInfo = async (year: number, month: number) => {
    setSigninInfo(null);
    // 这里将 URL 改为根据传入的 year 和 month 生成
    const data = await getSigninInMonth(year, month);
    if (!data) return null;
    setSigninInfo(data);
    return data;
  };

  /**
   * 使用补签卡
   * @returns {Promise<any|null>}
   */
  const useSignInCard = async () => {
    const headers = await formAuthorizeHeader();
    const response = await cc98Fetch("/me/make-up-missed-signin", {
      method: "POST",
      headers: headers,
    });
    if (!response.ok) {
      console.error("Failed to use signin card:", response.statusText);
      return null;
    }
    const data = await response.json();
    console.log("补签卡使用结果：", data);
    if (data.errorCode !== 0) {
      console.error("补签卡使用失败：", data.extra);
      message.error(data.extra || "补签卡使用失败");
      return null;
    }
    message.success("补签成功");
    if (props.updateSigninInfo) {
      props.updateSigninInfo(data.data);
    }
  };

  const renderDateCell = (momentDate) => {
    // let color = "";
    if (!signinInfo) {
      return (
        <div className={styles["cc98-calendar-cell"]}>
          {momentDate.date()}
          <div className={styles["cc98-signin-info"]}>&nbsp;</div>
        </div>
      );
    }
    const info = signinInfo.find(
      (item) =>
        item.year === moment(datePicker).year() &&
        item.month === moment(datePicker).month() + 1 &&
        item.day === momentDate.date()
    );
    if (info) {
      if (info.useCard) {
        return (
          <div
            className={`${styles["cc98-calendar-cell"]} ${styles["cc98-calendar-cell-checked"]}`}
          >
            {momentDate.date()}
            <div
              className={`${styles["cc98-signin-info"]} ${styles["calendar-tag"]} ${styles["calendar-makeup-tag"]}`}
            >
              补
            </div>
          </div>
        );
      } else {
        return (
          <div
            className={`${styles["cc98-calendar-cell"]} ${styles["cc98-calendar-cell-checked"]}`}
          >
            {momentDate.date()}
            <div
              className={`${styles["cc98-signin-info"]} ${styles["calendar-tag"]}`}
            >
              {"+" + info.reward}
            </div>
          </div>
        );
      }
    } else if (momentDate.isAfter(dateNow)) {
      return (
        <div className={styles["cc98-calendar-cell"]}>
          {momentDate.date()}
          <div
            className={`${styles["cc98-signin-info"]} ${styles["calendar-tag"]}`}
          >
            &nbsp;
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles["cc98-calendar-cell"]}>
          {momentDate.date()}
          <div
            className={`${styles["cc98-signin-info"]} ${styles["calendar-tag"]} ${styles["calendar-not-signin-tag"]}`}
          >
            未
          </div>
        </div>
      );
    }
  };

  const ruleContent = (
    <div>
      ①补签功能上线后，每位用户获得3张补签卡（包括此后新注册用户）
      <br />
      ②使用补签卡后，自动在最近的未签到日补签，并重新计算连续签到天数
      <br />
      ③补签不获得额外的财富值奖励
      <br />
      ④后续会增加补签卡的获取方式
      <br />
      ⑤签到功能使用和显示的时间为北京时间
    </div>
  );

  return (
    <div style={{ minHeight: "700px", marginTop: "40px" }}>
      <div className={styles["cc98-calendar-header"]}>
        补签卡：{signInCardCount}张
        <div>
          <Popover content={ruleContent} title="补签规则">
            <QuestionCircleOutlined />
          </Popover>
        </div>
        <div>
          {signInCardCount > 0 ? (
            <Button
              type="primary"
              onClick={() => {
                useSignInCard().then(() => {
                  refreshUserInfo().then(() => {
                    fetchSigninInfo(
                      datePicker?.year(),
                      datePicker?.month() + 1
                    );
                    const userInfo = getMyInfo();
                    setSignInCardCount(userInfo.signInCardCount || 0);
                  });
                });
              }}
            >
              补签一次
            </Button>
          ) : null}
        </div>
      </div>
      <div className={styles["cc98-calendar-picker"]}>
        <DatePicker
          picker="month"
          style={{ marginRight: 8 }}
          placeholder="选择月份"
          value={datePicker}
          allowClear={false}
          onChange={(date) => {
            setDatePicker(date);

            fetchSigninInfo(date?.year(), date?.month() + 1);
          }}
          disabledDate={(date) => {
            // 只能选择2016年6月~当前月份
            const minDate = moment("2016-06", "YYYY-MM");
            const maxDate = dateNow.clone().endOf("month"); // 本月最后一天
            return date.isBefore(minDate) || date.isAfter(maxDate);
          }}
          renderExtraFooter={() => (
            <div style={{ textAlign: "center"}}>
              <a onClick={() => setDatePicker(dateNow)}>本月</a>
            </div>
          )}
        />

        <Button.Group>
          <Button
            onClick={() => {
              const newDate = datePicker.subtract(1, "month");
              setDatePicker(newDate);
              fetchSigninInfo(newDate.year(), newDate.month() + 1);
            }}
            disabled={
              !datePicker ||
              datePicker.isSameOrBefore(moment("2016-07", "YYYY-MM"))
            }
          >
            <LeftOutlined />
            上月
          </Button>
          <Button
            onClick={() => {
              const newDate = datePicker.add(1, "month");
              setDatePicker(newDate);
              fetchSigninInfo(newDate.year(), newDate.month() + 1);
            }}
            disabled={
              !datePicker ||
              datePicker.isSameOrAfter(dateNow.clone().startOf("month"))
            }
          >
            下月
            <RightOutlined />
          </Button>
        </Button.Group>
        <div className={styles["cc98-calendar-picker-info"]}>
          可追溯范围：2016年06月 - {dateNow ? dateNow.format("YYYY年MM月") : ""}
        </div>
      </div>
      <CC98Calendar
        year={moment(datePicker).year()}
        month={moment(datePicker).month() + 1}
        renderDateCell={renderDateCell}
      />
    </div>
  );
};

export default ResignCalendar;
