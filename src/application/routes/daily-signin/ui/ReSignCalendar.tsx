import * as React from "react";

import {
  addMonths,
  compareCalendarDates,
  compareCalendarMonths,
  formatCalendarMonth,
  parseCalendarDate,
  toMonth,
  type CalendarDate,
  type CalendarMonth,
} from "@foundation/lib/calendar-date";
import { Button, ButtonGroup } from "@foundation/ui/button";
import { message } from "@foundation/ui/feedback";
import {
  LeftOutlined,
  QuestionCircleOutlined,
  RightOutlined,
} from "@foundation/ui/icon";
import { MonthPicker } from "@foundation/ui/month-picker";
import { Popover } from "@foundation/ui/popover";
import {
  getServerNow,
  getSigninInMonth,
  makeUpMissedSignin,
} from "@modules/daily-signin/api/service";
import type {
  MakeUpMissedSigninResult,
  ServerNowResultDto,
  UserSignInDailyInfo,
} from "@modules/daily-signin/model/dto";
import { refreshUserInfo } from "@modules/session/api/refresh-user-info";
import { getMyInfo } from "@modules/session/api/session";

import CC98Calendar from "./CC98Calendar";
import styles from "./ReSignCalendar.module.scss";

const MINIMUM_MONTH: CalendarMonth = { year: 2016, month: 6 };
const BEIJING_OFFSET_MS = 8 * 60 * 60 * 1000;

type LoadState = "loading" | "ready" | "error";
type LoadMonthResult = "ready" | "stale" | "error";
type MakeUpState = "idle" | "pending" | "success" | "error" | "sync-error";

interface SignInCardInfo {
  readonly signInCardCount?: number;
}

export interface ReSignCalendarOperations {
  getServerNow: () => Promise<ServerNowResultDto | undefined>;
  getSigninInMonth: (
    year: number,
    month: number
  ) => Promise<UserSignInDailyInfo[] | null>;
  makeUpMissedSignin: () => Promise<MakeUpMissedSigninResult>;
  refreshMyInfo: () => Promise<SignInCardInfo | undefined>;
  getMyInfo: () => SignInCardInfo | null | undefined;
}

export interface ReSignCalendarProps {
  updateSigninInfo?: (lastSignInCount: number) => void;
  operations?: ReSignCalendarOperations;
}

const productionOperations: ReSignCalendarOperations = {
  getServerNow,
  getSigninInMonth,
  makeUpMissedSignin,
  refreshMyInfo: refreshUserInfo,
  getMyInfo,
};

function getCardCount(info: SignInCardInfo | null | undefined) {
  const count = info?.signInCardCount;
  return Number.isInteger(count) && (count ?? -1) >= 0 ? count ?? null : null;
}

export function parseBeijingServerDate(value: string | null | undefined) {
  if (!value) return null;
  const hasExplicitZone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(value);
  if (hasExplicitZone) {
    const timestamp = Date.parse(value);
    if (!Number.isFinite(timestamp)) return null;
    const beijing = new Date(timestamp + BEIJING_OFFSET_MS);
    return parseCalendarDate(
      `${String(beijing.getUTCFullYear()).padStart(4, "0")}-${String(
        beijing.getUTCMonth() + 1
      ).padStart(2, "0")}-${String(beijing.getUTCDate()).padStart(2, "0")}`
    );
  }

  const datePrefix = /^(\d{4}-\d{2}-\d{2})(?:[T ]|$)/.exec(value);
  return datePrefix ? parseCalendarDate(datePrefix[1]) : null;
}

function getStatusText(state: LoadState) {
  if (state === "loading") return "加载中...";
  if (state === "error") return "签到记录加载失败";
  return "";
}

export default function ReSignCalendar({
  updateSigninInfo,
  operations = productionOperations,
}: ReSignCalendarProps) {
  const [serverToday, setServerToday] = React.useState<CalendarDate | null>(null);
  const [selectedMonth, setSelectedMonth] = React.useState<CalendarMonth | null>(null);
  const [signinInfo, setSigninInfo] = React.useState<UserSignInDailyInfo[]>([]);
  const [initialState, setInitialState] = React.useState<LoadState>("loading");
  const [monthState, setMonthState] = React.useState<LoadState>("loading");
  const [makeUpState, setMakeUpState] = React.useState<MakeUpState>("idle");
  const [signInCardCount, setSignInCardCount] = React.useState(0);
  const latestMonthRequestRef = React.useRef(0);
  const selectedMonthRef = React.useRef<CalendarMonth | null>(null);
  const makeUpPendingRef = React.useRef(false);
  const mountedRef = React.useRef(false);

  React.useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      latestMonthRequestRef.current += 1;
    };
  }, []);

  const loadMonth = React.useCallback(
    async (month: CalendarMonth): Promise<LoadMonthResult> => {
      const requestId = latestMonthRequestRef.current + 1;
      latestMonthRequestRef.current = requestId;
      setMonthState("loading");
      setSigninInfo([]);
      try {
        const data = await operations.getSigninInMonth(month.year, month.month);
        if (!mountedRef.current || requestId !== latestMonthRequestRef.current) {
          return "stale";
        }
        if (data === null) {
          setMonthState("error");
          return "error";
        }
        setSigninInfo(data);
        setMonthState("ready");
        return "ready";
      } catch {
        if (!mountedRef.current || requestId !== latestMonthRequestRef.current) {
          return "stale";
        }
        setMonthState("error");
        return "error";
      }
    },
    [operations]
  );

  const selectAndLoadMonth = React.useCallback(
    (month: CalendarMonth) => {
      const nextMonth = { ...month };
      selectedMonthRef.current = nextMonth;
      setSelectedMonth(nextMonth);
      void loadMonth(nextMonth);
    },
    [loadMonth]
  );

  React.useEffect(() => {
    let cancelled = false;
    setInitialState("loading");
    setMonthState("loading");

    const initialize = async () => {
      try {
        const result = await operations.getServerNow();
        const today =
          result?.errorCode === 0 ? parseBeijingServerDate(result.data) : null;
        if (cancelled || !mountedRef.current) return;
        if (!today) {
          setInitialState("error");
          setMonthState("error");
          return;
        }

        const month = toMonth(today);
        setServerToday(today);
        setSignInCardCount(getCardCount(operations.getMyInfo()) ?? 0);
        setInitialState("ready");
        selectAndLoadMonth(month);
      } catch {
        if (!cancelled && mountedRef.current) {
          setInitialState("error");
          setMonthState("error");
        }
      }
    };

    void initialize();
    return () => {
      cancelled = true;
      latestMonthRequestRef.current += 1;
    };
  }, [operations, selectAndLoadMonth]);

  const handleMakeUp = async () => {
    if (makeUpPendingRef.current || signInCardCount <= 0) return;
    makeUpPendingRef.current = true;
    setMakeUpState("pending");
    try {
      let result: MakeUpMissedSigninResult;
      try {
        result = await operations.makeUpMissedSignin();
      } catch {
        if (mountedRef.current) {
          setMakeUpState("error");
          message.error("补签请求失败");
        }
        return;
      }
      if (!mountedRef.current) return;
      if (result.ok === false) {
        setMakeUpState("error");
        message.error(result.errorMessage);
        return;
      }

      message.success("补签成功");
      try {
        updateSigninInfo?.(result.lastSignInCount);
        const refreshedInfo = await operations.refreshMyInfo();
        if (!mountedRef.current) return;
        const refreshedCardCount = getCardCount(refreshedInfo);
        if (refreshedCardCount === null) {
          throw new Error("Invalid refreshed sign-in card count");
        }
        setSignInCardCount(refreshedCardCount);
      } catch {
        if (mountedRef.current) {
          setMakeUpState("sync-error");
          message.error("补签已成功，但用户资料刷新失败，请刷新页面确认最新状态");
        }
        return;
      }

      const month = selectedMonthRef.current;
      if (month) {
        const monthRefreshResult = await loadMonth(month);
        if (monthRefreshResult === "error") {
          if (mountedRef.current) {
            setMakeUpState("sync-error");
            message.error("补签已成功，但签到记录刷新失败，请稍后重试或刷新页面");
          }
          return;
        }
      }
      if (mountedRef.current) setMakeUpState("success");
    } finally {
      makeUpPendingRef.current = false;
    }
  };

  const renderDateCell = (date: CalendarDate) => {
    const info =
      monthState === "ready"
        ? signinInfo.find(
            (item) =>
              item.year === date.year &&
              item.month === date.month &&
              item.day === date.day
          )
        : undefined;
    const isFuture =
      serverToday !== null && compareCalendarDates(date, serverToday) > 0;

    if (monthState !== "ready" || !serverToday || isFuture) {
      return (
        <div className={styles.calendarCell}>
          {date.day}
          <div className={styles.signinInfo}>&nbsp;</div>
        </div>
      );
    }
    if (info?.useCard) {
      return (
        <div className={`${styles.calendarCell} ${styles.checkedCell}`}>
          {date.day}
          <div className={`${styles.signinInfo} ${styles.makeupTag}`}>补</div>
        </div>
      );
    }
    if (info) {
      return (
        <div className={`${styles.calendarCell} ${styles.checkedCell}`}>
          {date.day}
          <div className={styles.signinInfo}>+{info.reward}</div>
        </div>
      );
    }
    return (
      <div className={styles.calendarCell}>
        {date.day}
        <div className={`${styles.signinInfo} ${styles.notSigninTag}`}>未</div>
      </div>
    );
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

  const currentMonth = serverToday ? toMonth(serverToday) : null;
  const previousDisabled =
    !selectedMonth || compareCalendarMonths(selectedMonth, MINIMUM_MONTH) <= 0;
  const nextDisabled =
    !selectedMonth ||
    !currentMonth ||
    compareCalendarMonths(selectedMonth, currentMonth) >= 0;

  return (
    <div
      className={styles.root}
      data-resign-initial-state={initialState}
      data-resign-month-state={monthState}
      data-resign-makeup-state={makeUpState}
      data-resign-selected-month={
        selectedMonth ? formatCalendarMonth(selectedMonth) : "empty"
      }
    >
      <div className={styles.summaryHeader}>
        补签卡：{signInCardCount}张
        <div>
          <Popover
            content={ruleContent}
            title="补签规则"
            openDelay={100}
            closeDelay={100}
            openOnFocus
            collisionPadding={0}
          >
            <QuestionCircleOutlined label="查看补签规则" tabIndex={0} />
          </Popover>
        </div>
        {signInCardCount > 0 ? (
          <div>
            <Button
              type="primary"
              loading={makeUpState === "pending"}
              disabled={
                makeUpState === "pending" || makeUpState === "sync-error"
              }
              onClick={() => void handleMakeUp()}
            >
              补签一次
            </Button>
          </div>
        ) : null}
      </div>
      <div className={styles.pickerRow}>
        <MonthPicker
          className={styles.monthPicker}
          value={selectedMonth}
          min={MINIMUM_MONTH}
          max={currentMonth ?? undefined}
          currentMonth={currentMonth ?? undefined}
          placeholder="选择月份"
          disabled={!currentMonth}
          onValueChange={selectAndLoadMonth}
        />
        <ButtonGroup className={styles.signinButtonGroup}>
          <Button
            disabled={previousDisabled}
            onClick={() => {
              if (selectedMonth) {
                selectAndLoadMonth(addMonths(selectedMonth, -1));
              }
            }}
          >
            <LeftOutlined className={styles.signinPreviousIcon} />
            上月
          </Button>
          <Button
            disabled={nextDisabled}
            onClick={() => {
              if (selectedMonth) {
                selectAndLoadMonth(addMonths(selectedMonth, 1));
              }
            }}
          >
            下月
            <RightOutlined className={styles.signinNextIcon} />
          </Button>
        </ButtonGroup>
        <div className={styles.pickerInfo}>
          <span>
            可追溯范围：2016年06月 - {currentMonth ? `${currentMonth.year}年${String(currentMonth.month).padStart(2, "0")}月` : ""}
          </span>
          <span className={styles.statusText} aria-live="polite">
            {initialState === "error" ? "服务器时间加载失败" : getStatusText(monthState)}
          </span>
        </div>
      </div>
      {selectedMonth ? (
        <CC98Calendar month={selectedMonth} renderDateCell={renderDateCell} />
      ) : (
        <div className={styles.calendarPlaceholder} />
      )}
    </div>
  );
}
