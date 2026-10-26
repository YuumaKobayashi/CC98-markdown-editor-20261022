import * as React from "react";

import type { CalendarDateRange } from "@foundation/lib/calendar-date";
import { DateRangePicker } from "@foundation/ui/date-range-picker";
import { Dialog } from "@foundation/ui/dialog";
import { Field } from "@foundation/ui/field";
import { Form } from "@foundation/ui/form";
import { CloseCircleOutlined } from "@foundation/ui/icon";
import { Input, TextArea } from "@foundation/ui/input";
import { Radio, RadioGroup } from "@foundation/ui/radio";
import { Select } from "@foundation/ui/select";

import type { HousingTemplateValues } from "../model/housing-template";
import styles from "./HousingTemplateDialog.module.scss";

export interface HousingTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: HousingTemplateValues) => void;
  onValidationChange?: (state: HousingValidationState, errorCount: number) => void;
}

export type HousingValidationState = "idle" | "invalid" | "valid";

type HousingFormValues = Omit<HousingTemplateValues, "validDate"> & {
  validDate: CalendarDateRange | null;
};

type HousingField = keyof HousingFormValues;
type HousingErrors = Partial<Record<HousingField, string>>;

const REQUIRED_MESSAGES: Partial<Record<HousingField, string>> = {
  validDate: "Please select time!",
  type: "请选择类型!",
  district: "请输入地区!",
  neighborhood: "请输入小区名称!",
  address: "请输入详细地址!",
  contact: "请输入联系方式!",
  price: "请输入价格!",
  rentDays: "请输入租期!",
  houseType: "请输入房户类型!",
  rentType: "请输入出租类型!",
  area: "请输入出租面积!",
  range: "请输入可租期限!",
  paymentType: "请输入付款方式!",
  isSingleRoom: "请输入是否为隔间!",
  isElectricIsolated: "请输入电表方式!",
  waterElecValue: "请输入水电缴费!",
};

const TEXT_FIELDS: ReadonlyArray<{
  name: Exclude<
    HousingField,
    | "validDate"
    | "type"
    | "isSingleRoom"
    | "isElectricIsolated"
    | "waterElecValue"
    | "otherDescriptions"
    | "otherDemands"
  >;
  label: string;
  placeholder: string;
}> = [
  { name: "district", label: "地区", placeholder: "例如：紫金港 / 玉泉 / 文一西路xx路交叉口处 / 上海的xx路附近" },
  { name: "neighborhood", label: "小区名称", placeholder: "例如：港湾家园" },
  { name: "address", label: "详细地址", placeholder: "例如：余杭塘路866号港湾家园X幢X单元X号" },
  { name: "contact", label: "联系方式", placeholder: "例如：张房东 电话18888888888 / 李女士 微信1234abc" },
  { name: "price", label: "价格", placeholder: "例如：2000元/月" },
  { name: "rentDays", label: "租期", placeholder: "例如：6个月起租" },
  { name: "houseType", label: "房户类型", placeholder: "例如：4室0厅1阳1卫1厨（指包括要出租的房间数量，加上公用的区域，私用的不算入）" },
  { name: "rentType", label: "出租类型", placeholder: "（指本次出租的房间）例如： 单间（独卫带阳台）/ 单间（独卫）/ 单间 " },
  { name: "area", label: "出租面积", placeholder: "（指本次出租的房间）例如：20平米" },
  { name: "range", label: "可租期限", placeholder: "例如：到2017年11月7日 / 长期 （指合约可以签到什么时候）" },
  { name: "paymentType", label: "付款方式", placeholder: " 例如：押1付1  /  押1付2" },
  { name: "cleaning", label: "日常卫生", placeholder: "例如：自理 / 每周1次" },
  { name: "repairing", label: "维修物业", placeholder: "例如：合租统一由房东承担、整租自行商议" },
  { name: "networking", label: "网络带宽", placeholder: "例如：有，电信20M宽带 / 无，自理" },
  { name: "checkout", label: "退租方式", placeholder: "例如：合同到期，退还钥匙取回全额押金" },
];

const TYPE_OPTIONS = ["整租", "合租", "转租", "出售", "其他"].map((value) => ({
  value,
  label: value,
}));

const FIELD_CLASS_NAMES = {
  root: styles.formRow,
  label: styles.label,
  requiredMark: styles.required,
  control: styles.control,
  error: styles.error,
};

function createEmptyValues(): HousingFormValues {
  return {
    validDate: null,
    type: "",
    district: "",
    neighborhood: "",
    address: "",
    contact: "",
    price: "",
    rentDays: "",
    houseType: "",
    rentType: "",
    area: "",
    range: "",
    paymentType: "",
    isSingleRoom: "",
    isElectricIsolated: "",
    waterElecValue: "",
    cleaning: "",
    repairing: "",
    networking: "",
    checkout: "",
    otherDescriptions: "",
    otherDemands: "",
  };
}

function validateValues(values: HousingFormValues): HousingErrors {
  const errors: HousingErrors = {};
  for (const [name, message] of Object.entries(REQUIRED_MESSAGES) as Array<
    [HousingField, string]
  >) {
    const fieldValue = values[name];
    if (fieldValue === null || fieldValue === "") errors[name] = message;
  }
  return errors;
}

export function HousingTemplateDialog({
  open,
  onOpenChange,
  onSubmit,
  onValidationChange,
}: HousingTemplateDialogProps): React.ReactElement {
  const [values, setValues] = React.useState<HousingFormValues>(createEmptyValues);
  const [errors, setErrors] = React.useState<HousingErrors>({});
  const [hasSubmitted, setHasSubmitted] = React.useState(false);
  const [electricCustomValue, setElectricCustomValue] = React.useState("");
  const [waterCustomValue, setWaterCustomValue] = React.useState("");
  const fieldIdPrefix = React.useId();

  const errorId = (name: HousingField) => `${fieldIdPrefix}-${name}-error`;

  const updateValue = <Name extends HousingField>(
    name: Name,
    nextValue: HousingFormValues[Name]
  ) => {
    const nextValues = { ...values, [name]: nextValue };
    setValues(nextValues);
    if (hasSubmitted) setErrors(validateValues(nextValues));
  };

  const handleSubmit = () => {
    const nextErrors = validateValues(values);
    setHasSubmitted(true);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || values.validDate === null) return;

    const submittedValues: HousingTemplateValues = {
      ...values,
      validDate: values.validDate,
      isElectricIsolated:
        values.isElectricIsolated === "其他"
          ? electricCustomValue
          : values.isElectricIsolated,
      waterElecValue:
        values.waterElecValue === "其他"
          ? waterCustomValue
          : values.waterElecValue,
    };
    onSubmit(submittedValues);
    onOpenChange(false);
  };

  const renderTextField = (field: (typeof TEXT_FIELDS)[number]) => {
    const required = REQUIRED_MESSAGES[field.name] !== undefined;
    const error = errors[field.name];
    return (
      <Field
        key={field.name}
        data-field={field.name}
        label={field.label}
        required={required}
        error={error}
        errorId={errorId(field.name)}
        classNames={FIELD_CLASS_NAMES}
      >
        <Input
          className={styles.input}
          value={values[field.name]}
          placeholder={field.placeholder}
          aria-label={field.label}
          status={error ? "error" : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId(field.name) : undefined}
          onChange={(event) => updateValue(field.name, event.target.value)}
        />
      </Field>
    );
  };

  const validationState: HousingValidationState = !hasSubmitted
    ? "idle"
    : Object.keys(errors).length > 0
      ? "invalid"
      : "valid";
  // Legacy debt: the water custom input intentionally follows the electricity choice.
  const showLegacyCoupledCustomInputs = values.isElectricIsolated === "其他";

  React.useEffect(() => {
    onValidationChange?.(validationState, Object.keys(errors).length);
  }, [errors, onValidationChange, validationState]);

  return (
    <Dialog
      open={open}
      title="住房信息模板"
      onOpenChange={onOpenChange}
      onConfirm={handleSubmit}
      confirmText="确 定"
      cancelText="取 消"
      width={520}
      bodyClassName={styles.dialogBody}
      classNames={{ content: styles.dialogContent, footer: styles.dialogFooter }}
    >
      <Form
        className={styles.form}
        data-housing-validation-state={validationState}
        data-housing-error-count={Object.keys(errors).length}
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <Field
          data-field="validDate"
          label="有效时间"
          required
          error={errors.validDate}
          errorId={errorId("validDate")}
          classNames={FIELD_CLASS_NAMES}
        >
          <DateRangePicker
            className={styles.dateRangeRoot}
            value={values.validDate}
            onValueChange={(nextValue) => updateValue("validDate", nextValue)}
            placeholder={["开始日期", "结束日期"]}
            ariaLabel="有效时间"
            ariaInvalid={Boolean(errors.validDate)}
            ariaDescribedBy={errors.validDate ? errorId("validDate") : undefined}
            footer="不能大于2周，到期可编辑"
          />
        </Field>
        <Field
          data-field="type"
          label="类型"
          required
          error={errors.type}
          errorId={errorId("type")}
          classNames={FIELD_CLASS_NAMES}
        >
          <Select
            className={styles.select}
            classNames={{
              trigger: styles.selectTrigger,
              popup: styles.selectPopup,
              item: styles.selectOption,
            }}
            options={TYPE_OPTIONS}
            value={values.type || null}
            onValueChange={(nextValue) => updateValue("type", nextValue ?? "")}
            placeholder="请选择类型"
            highlightFirstItemOnOpen
            ariaLabel="类型"
            ariaInvalid={Boolean(errors.type)}
            ariaDescribedBy={errors.type ? errorId("type") : undefined}
          />
          {errors.type ? <CloseCircleOutlined className={styles.feedbackIcon} /> : null}
        </Field>
        {TEXT_FIELDS.slice(0, 11).map(renderTextField)}
        <Field
          data-field="isSingleRoom"
          label="是否为隔间"
          required
          error={errors.isSingleRoom}
          errorId={errorId("isSingleRoom")}
          classNames={FIELD_CLASS_NAMES}
        >
          <RadioGroup<string>
            name={`${fieldIdPrefix}-single-room`}
            value={values.isSingleRoom}
            onValueChange={(nextValue) => updateValue("isSingleRoom", nextValue)}
            className={styles.radioGroup}
            aria-label="是否为隔间"
            aria-invalid={errors.isSingleRoom ? true : undefined}
            aria-describedby={errors.isSingleRoom ? errorId("isSingleRoom") : undefined}
          >
            {["是", "否"].map((option) => (
              <Radio<string>
                key={option}
                value={option}
                label={option}
              />
            ))}
          </RadioGroup>
        </Field>
        <Field
          data-field="isElectricIsolated"
          label="独立电表"
          required
          error={errors.isElectricIsolated}
          errorId={errorId("isElectricIsolated")}
          classNames={FIELD_CLASS_NAMES}
          className={styles.radioFormRow}
        >
          <RadioGroup<string>
            name={`${fieldIdPrefix}-electric`}
            value={values.isElectricIsolated}
            onValueChange={(nextValue) => updateValue("isElectricIsolated", nextValue)}
            className={styles.radioGroup}
            aria-label="独立电表"
            aria-invalid={errors.isElectricIsolated ? true : undefined}
            aria-describedby={errors.isElectricIsolated ? errorId("isElectricIsolated") : undefined}
          >
            {["是", "否", "空调独立电表", "其他"].map((option) => (
              <Radio<string>
                key={option}
                value={option}
                label={option}
              >
                {option === "其他" && showLegacyCoupledCustomInputs ? (
                  <Input
                    className={styles.customInput}
                    value={electricCustomValue}
                    aria-label="其他独立电表方式"
                    onChange={(event) => setElectricCustomValue(event.target.value)}
                  />
                ) : null}
              </Radio>
            ))}
          </RadioGroup>
        </Field>
        <Field
          data-field="waterElecValue"
          label="水电缴费"
          required
          error={errors.waterElecValue}
          errorId={errorId("waterElecValue")}
          classNames={FIELD_CLASS_NAMES}
          className={styles.radioFormRow}
        >
          <RadioGroup<string>
            name={`${fieldIdPrefix}-water-electric`}
            value={values.waterElecValue}
            onValueChange={(nextValue) => updateValue("waterElecValue", nextValue)}
            className={styles.radioGroup}
            aria-label="水电缴费"
            aria-invalid={errors.waterElecValue ? true : undefined}
            aria-describedby={errors.waterElecValue ? errorId("waterElecValue") : undefined}
          >
            {["每月一付", "每季一付", "退租结算", "其他"].map((option) => (
              <Radio<string>
                key={option}
                value={option}
                label={option}
              >
                {option === "其他" && showLegacyCoupledCustomInputs ? (
                  <Input
                    className={styles.customInput}
                    value={waterCustomValue}
                    aria-label="其他水电缴费方式"
                    onChange={(event) => setWaterCustomValue(event.target.value)}
                  />
                ) : null}
              </Radio>
            ))}
          </RadioGroup>
        </Field>
        {TEXT_FIELDS.slice(11).map(renderTextField)}
        <Field
          data-field="otherDescriptions"
          label="其他描述"
          errorId={errorId("otherDescriptions")}
          classNames={FIELD_CLASS_NAMES}
          className={styles.textAreaRow}
        >
          <TextArea
            className={styles.textArea}
            rows={4}
            value={values.otherDescriptions}
            aria-label="其他描述"
            placeholder="此处添加任何合适的描述，可以包括家具设备、地理优势、水电网物业详细、入住情况、朝向等相关信息描述"
            onChange={(event) => updateValue("otherDescriptions", event.target.value)}
          />
        </Field>
        <Field
          data-field="otherDemands"
          label="其他要求"
          errorId={errorId("otherDemands")}
          classNames={FIELD_CLASS_NAMES}
          className={styles.textAreaRow}
        >
          <TextArea
            className={styles.textArea}
            rows={4}
            value={values.otherDemands}
            aria-label="其他要求"
            placeholder="例如：无 / 由于XXX原因，希望找一个男生/女生/上班族/不接受情侣/……"
            onChange={(event) => updateValue("otherDemands", event.target.value)}
          />
        </Field>
        <div className={styles.noticeRow}>
          图片请点击下方编辑器的图片上传按钮上传，其他未尽内容请在下方编辑器输入。
        </div>
      </Form>
    </Dialog>
  );
}
