import { formatCalendarDate, type CalendarDateRange } from "@foundation/lib/calendar-date";

export interface HousingTemplateValues {
  validDate: CalendarDateRange;
  type: string;
  district: string;
  neighborhood: string;
  address: string;
  contact: string;
  price: string;
  rentDays: string;
  houseType: string;
  rentType: string;
  area: string;
  range: string;
  paymentType: string;
  isSingleRoom: string;
  isElectricIsolated: string;
  waterElecValue: string;
  cleaning: string;
  repairing: string;
  networking: string;
  checkout: string;
  otherDescriptions: string;
  otherDemands: string;
}

export function formatHousingTemplateUbb(values: HousingTemplateValues) {
  return `[table]
    [tr][th]序号[/th][th]信息项[/th][th]描述[/th][/tr]
    [tr][td]01[/td][td]有效日期[/td][td]${formatCalendarDate(values.validDate[0])}-${formatCalendarDate(values.validDate[1])}[/td][/tr]
    [tr][td]02[/td][td]类型[/td][td]${values.type || ""}[/td][/tr]
    [tr][td]03[/td][td]地区[/td][td]${values.district || ""}[/td][/tr]
    [tr][td]04[/td][td]小区名称[/td][td]${values.neighborhood || ""}[/td][/tr]
    [tr][td]05[/td][td]详细地址[/td][td]${values.address || ""}[/td][/tr]
    [tr][td]06[/td][td]联系方式[/td][td]${values.contact || ""}[/td][/tr]
    [tr][td]07[/td][td]价格[/td][td]${values.price || ""}[/td][/tr]
    [tr][td]08[/td][td]租期[/td][td]${values.rentDays || ""}[/td][/tr]
    [tr][td]09[/td][td]房户类型[/td][td]${values.houseType || ""}[/td][/tr]
    [tr][td]10[/td][td]出租户型[/td][td]${values.rentType || ""}[/td][/tr]
    [tr][td]11[/td][td]出租面积[/td][td]${values.area || ""}[/td][/tr]
    [tr][td]12[/td][td]可租期限[/td][td]${values.range || ""}[/td][/tr]
    [tr][td]13[/td][td]付款方式[/td][td]${values.paymentType || ""}[/td][/tr]
    [tr][td]14[/td][td]是否为隔间[/td][td]${values.isSingleRoom || ""}[/td][/tr]
    [tr][td]15[/td][td]独立电表[/td][td]${values.isElectricIsolated || ""}[/td][/tr]
    [tr][td]16[/td][td]水电缴费[/td][td]${values.waterElecValue || ""}[/td][/tr]
    [tr][td]17[/td][td]日常卫生[/td][td]${values.cleaning || ""}[/td][/tr]
    [tr][td]18[/td][td]维修物业[/td][td]${values.repairing || ""}[/td][/tr]
    [tr][td]19[/td][td]网络带宽[/td][td]${values.networking || ""}[/td][/tr]
    [tr][td]20[/td][td]退租方式[/td][td]${values.checkout || ""}[/td][/tr]
    [tr][td]21[/td][td]其他描述[/td][td]${values.otherDescriptions || ""}[/td][/tr]
    [tr][td]22[/td][td]其他要求[/td][td]${values.otherDemands || ""}[/td][/tr]
    [/table]`;
}
