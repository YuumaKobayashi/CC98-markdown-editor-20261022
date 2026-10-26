export interface CalendarDate {
  readonly year: number;
  readonly month: number;
  readonly day: number;
}

export interface CalendarMonth {
  readonly year: number;
  readonly month: number;
}

export type CalendarDateRange = readonly [CalendarDate, CalendarDate];

const MIN_YEAR = 1;
const MAX_YEAR = 9999;

function isIntegerInRange(value: number, minimum: number, maximum: number) {
  return Number.isInteger(value) && value >= minimum && value <= maximum;
}

function isLeapYear(year: number) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function assertMonth(month: CalendarMonth) {
  if (
    !isIntegerInRange(month.year, MIN_YEAR, MAX_YEAR) ||
    !isIntegerInRange(month.month, 1, 12)
  ) {
    throw new RangeError("Invalid calendar month");
  }
}

function assertDate(date: CalendarDate) {
  assertMonth(date);
  if (!isIntegerInRange(date.day, 1, daysInMonth(date))) {
    throw new RangeError("Invalid calendar date");
  }
}

function toDayNumber(date: CalendarDate) {
  assertDate(date);
  const a = Math.floor((14 - date.month) / 12);
  const year = date.year + 4800 - a;
  const month = date.month + 12 * a - 3;
  return (
    date.day +
    Math.floor((153 * month + 2) / 5) +
    365 * year +
    Math.floor(year / 4) -
    Math.floor(year / 100) +
    Math.floor(year / 400) -
    32045
  );
}

function fromDayNumber(dayNumber: number): CalendarDate {
  const a = dayNumber + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const monthIndex = Math.floor((5 * e + 2) / 153);
  const day = e - Math.floor((153 * monthIndex + 2) / 5) + 1;
  const month = monthIndex + 3 - 12 * Math.floor(monthIndex / 10);
  const year = 100 * b + d - 4800 + Math.floor(monthIndex / 10);
  const date = { year, month, day };
  assertDate(date);
  return date;
}

export function parseCalendarDate(value: string): CalendarDate | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const date = {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
  try {
    assertDate(date);
    return date;
  } catch {
    return null;
  }
}

export function formatCalendarDate(date: CalendarDate) {
  assertDate(date);
  return `${String(date.year).padStart(4, "0")}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
}

export function formatCalendarMonth(month: CalendarMonth) {
  assertMonth(month);
  return `${String(month.year).padStart(4, "0")}-${String(month.month).padStart(2, "0")}`;
}

export function compareCalendarDates(left: CalendarDate, right: CalendarDate) {
  return toDayNumber(left) - toDayNumber(right);
}

export function compareCalendarMonths(left: CalendarMonth, right: CalendarMonth) {
  assertMonth(left);
  assertMonth(right);
  return left.year * 12 + left.month - (right.year * 12 + right.month);
}

export function isSameCalendarDate(left: CalendarDate, right: CalendarDate) {
  return (
    left.year === right.year &&
    left.month === right.month &&
    left.day === right.day
  );
}

export function isSameCalendarMonth(left: CalendarMonth, right: CalendarMonth) {
  assertMonth(left);
  assertMonth(right);
  return left.year === right.year && left.month === right.month;
}

export function daysInMonth(month: CalendarMonth) {
  assertMonth(month);
  if (month.month === 2) return isLeapYear(month.year) ? 29 : 28;
  return [4, 6, 9, 11].includes(month.month) ? 30 : 31;
}

export function addDays(date: CalendarDate, amount: number): CalendarDate {
  if (!Number.isInteger(amount)) throw new RangeError("Day offset must be an integer");
  return fromDayNumber(toDayNumber(date) + amount);
}

export function addMonths(date: CalendarDate, amount: number): CalendarDate;
export function addMonths(month: CalendarMonth, amount: number): CalendarMonth;
export function addMonths(
  value: CalendarDate | CalendarMonth,
  amount: number
): CalendarDate | CalendarMonth {
  const isDateValue = "day" in value;
  if (isDateValue) assertDate(value);
  else assertMonth(value);
  if (!Number.isInteger(amount)) throw new RangeError("Month offset must be an integer");

  const monthIndex = (value.year - 1) * 12 + value.month - 1 + amount;
  const maximumMonthIndex = MAX_YEAR * 12 - 1;
  if (monthIndex < 0 || monthIndex > maximumMonthIndex) {
    throw new RangeError("Calendar month is outside the supported range");
  }

  const resultMonth = {
    year: Math.floor(monthIndex / 12) + 1,
    month: (monthIndex % 12) + 1,
  };
  if (!isDateValue) return resultMonth;
  return {
    ...resultMonth,
    day: Math.min(value.day, daysInMonth(resultMonth)),
  };
}

export function differenceInDays(left: CalendarDate, right: CalendarDate) {
  return toDayNumber(left) - toDayNumber(right);
}

export function toMonth(date: CalendarDate): CalendarMonth {
  assertDate(date);
  return { year: date.year, month: date.month };
}

export function dayOfWeek(date: CalendarDate) {
  return (toDayNumber(date) + 1) % 7;
}
