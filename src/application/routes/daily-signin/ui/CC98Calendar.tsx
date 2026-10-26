import * as React from "react";

import {
  dayOfWeek,
  daysInMonth,
  formatCalendarDate,
  type CalendarDate,
  type CalendarMonth,
} from "@foundation/lib/calendar-date";

import styles from "./CC98Calendar.module.scss";

const WEEKDAYS = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

export interface CC98CalendarProps {
  month: CalendarMonth;
  renderDateCell?: (date: CalendarDate) => React.ReactNode;
}

export default function CC98Calendar({
  month,
  renderDateCell,
}: CC98CalendarProps) {
  const cells = React.useMemo(() => {
    const firstDate = { ...month, day: 1 };
    const leadingSlots = (dayOfWeek(firstDate) + 6) % 7;
    const dates: Array<CalendarDate | null> = Array.from(
      { length: leadingSlots },
      () => null
    );
    for (let day = 1; day <= daysInMonth(month); day += 1) {
      dates.push({ ...month, day });
    }
    return dates;
  }, [month]);

  return (
    <div className={styles.calendar} data-calendar-slot-count={cells.length}>
      <div className={styles.header} role="row">
        {WEEKDAYS.map((weekday) => (
          <div key={weekday} role="columnheader">
            {weekday}
          </div>
        ))}
      </div>
      <div className={styles.body} role="grid" aria-label={`${month.year}年${month.month}月`}>
        {cells.map((date, index) => (
          <div
            key={date ? formatCalendarDate(date) : `empty-${index}`}
            className={styles.slot}
            role="gridcell"
          >
            {date ? renderDateCell?.(date) ?? date.day : null}
          </div>
        ))}
      </div>
    </div>
  );
}
