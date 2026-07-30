import * as React from "react";
import {
  DatePicker,
  Form,
  type FormInstance,
  Input,
  Modal,
  Radio,
  Select,
} from "antd";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

interface HousingTemplateDialogProps {
  visible: boolean;
  submit: (values: any) => void;
}

export function HousingTemplateDialog({
  visible,
  submit,
}: HousingTemplateDialogProps): React.ReactElement {
  const formRef = React.useRef<FormInstance>(null);
  const [currentVisible, setCurrentVisible] = React.useState(visible);
  const [elecRadio, setElecRadio] = React.useState("");
  const [waterElecRadio, setWaterElecRadio] = React.useState("");
  const [elecValue, setElecValue] = React.useState("");
  const [waterElecValue, setWaterElecValue] = React.useState("");

  React.useEffect(() => {
    setCurrentVisible(visible);
  }, [visible]);

  const handleSubmit = async (event?) => {
    if (event?.preventDefault) event.preventDefault();
    try {
      const values = await formRef.current!.validateFields();
      console.log("Received values of form: ", values);
      if (elecRadio === "其他") values.isElectricIsolated = elecValue;
      if (waterElecRadio === "其他") {
        values.waterElecValue = waterElecValue;
      }
      submit(values);
      setCurrentVisible(false);
    } catch (_error) {
      return;
    }
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  return (
    <Modal
      title="住房信息模板"
      open={currentVisible}
      onOk={handleSubmit}
      onCancel={() => setCurrentVisible(false)}
    >
      <Form
        ref={formRef}
        style={{ maxHeight: "500px", overflowY: "scroll" }}
        {...formItemLayout}
      >
        <Form.Item
          label="有效时间"
          name="validDate"
          rules={[
            { type: "array", required: true, message: "Please select time!" },
          ]}
        >
          <RangePicker renderExtraFooter={() => "不能大于2周，到期可编辑"} />
        </Form.Item>
        <Form.Item
          label="类型"
          name="type"
          rules={[{ required: true, message: "请选择类型!" }]}
          hasFeedback
        >
          <Select placeholder="请选择类型">
            <Option value="整租">整租</Option>
            <Option value="合租">合租</Option>
            <Option value="转租">转租</Option>
            <Option value="出售">出售</Option>
            <Option value="其他">其他</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="地区"
          name="district"
          rules={[{ required: true, message: "请输入地区!" }]}
        >
          <Input placeholder="例如：紫金港 / 玉泉 / 文一西路xx路交叉口处 / 上海的xx路附近" />
        </Form.Item>
        <Form.Item
          label="小区名称"
          name="neighborhood"
          rules={[{ required: true, message: "请输入小区名称!" }]}
        >
          <Input placeholder="例如：港湾家园" />
        </Form.Item>
        <Form.Item
          label="详细地址"
          name="address"
          rules={[{ required: true, message: "请输入详细地址!" }]}
        >
          <Input placeholder="例如：余杭塘路866号港湾家园X幢X单元X号" />
        </Form.Item>
        <Form.Item
          label="联系方式"
          name="contact"
          rules={[{ required: true, message: "请输入联系方式!" }]}
        >
          <Input placeholder="例如：张房东 电话18888888888 / 李女士 微信1234abc" />
        </Form.Item>
        <Form.Item
          label="价格"
          name="price"
          rules={[{ required: true, message: "请输入价格!" }]}
        >
          <Input placeholder="例如：2000元/月" />
        </Form.Item>
        <Form.Item
          label="租期"
          name="rentDays"
          rules={[{ required: true, message: "请输入租期!" }]}
        >
          <Input placeholder="例如：6个月起租" />
        </Form.Item>
        <Form.Item
          label="房户类型"
          name="houseType"
          rules={[{ required: true, message: "请输入房户类型!" }]}
        >
          <Input placeholder="例如：4室0厅1阳1卫1厨（指包括要出租的房间数量，加上公用的区域，私用的不算入）" />
        </Form.Item>
        <Form.Item
          label="出租类型"
          name="rentType"
          rules={[{ required: true, message: "请输入出租类型!" }]}
        >
          <Input placeholder="（指本次出租的房间）例如： 单间（独卫带阳台）/ 单间（独卫）/ 单间 " />
        </Form.Item>
        <Form.Item
          label="出租面积"
          name="area"
          rules={[{ required: true, message: "请输入出租面积!" }]}
        >
          <Input placeholder="（指本次出租的房间）例如：20平米" />
        </Form.Item>
        <Form.Item
          label="可租期限"
          name="range"
          rules={[{ required: true, message: "请输入可租期限!" }]}
        >
          <Input placeholder="例如：到2017年11月7日 / 长期 （指合约可以签到什么时候）" />
        </Form.Item>
        <Form.Item
          label="付款方式"
          name="paymentType"
          rules={[{ required: true, message: "请输入付款方式!" }]}
        >
          <Input placeholder=" 例如：押1付1  /  押1付2" />
        </Form.Item>
        <Form.Item
          label="是否为隔间"
          name="isSingleRoom"
          rules={[{ required: true, message: "请输入是否为隔间!" }]}
        >
          <Radio.Group>
            <Radio value="是">是</Radio>
            <Radio value="否">否</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="独立电表"
          name="isElectricIsolated"
          rules={[{ required: true, message: "请输入电表方式!" }]}
        >
          <Radio.Group onChange={(event) => setElecRadio(event.target.value)}>
            <Radio value="是">是</Radio>
            <Radio value="否">否</Radio>
            <Radio value="空调独立电表">空调独立电表</Radio>
            <Radio value="其他">
              其他
              {elecRadio === "其他" ? (
                <Input
                  onChange={(event) => setElecValue(event.target.value)}
                  style={{ width: 100, marginLeft: 10 }}
                />
              ) : null}
            </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="水电缴费"
          name="waterElecValue"
          rules={[{ required: true, message: "请输入水电缴费!" }]}
        >
          <Radio.Group
            onChange={(event) => setWaterElecRadio(event.target.value)}
          >
            <Radio value="每月一付">每月一付</Radio>
            <Radio value="每季一付">每季一付</Radio>
            <Radio value="退租结算">退租结算</Radio>
            <Radio value="其他">
              其他
              {elecRadio === "其他" ? (
                <Input
                  onChange={(event) => setWaterElecValue(event.target.value)}
                  style={{ width: 100, marginLeft: 10 }}
                />
              ) : null}
            </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="日常卫生" name="cleaning">
          <Input placeholder="例如：自理 / 每周1次" />
        </Form.Item>
        <Form.Item label="维修物业" name="repairing">
          <Input placeholder="例如：合租统一由房东承担、整租自行商议" />
        </Form.Item>
        <Form.Item label="网络带宽" name="networking">
          <Input placeholder="例如：有，电信20M宽带 / 无，自理" />
        </Form.Item>
        <Form.Item label="退租方式" name="checkout">
          <Input placeholder="例如：合同到期，退还钥匙取回全额押金" />
        </Form.Item>
        <Form.Item
          label="其他描述"
          name="otherDescriptions"
          rules={[{ required: false }]}
        >
          <TextArea
            rows={4}
            placeholder="此处添加任何合适的描述，可以包括家具设备、地理优势、水电网物业详细、入住情况、朝向等相关信息描述"
          />
        </Form.Item>
        <Form.Item
          label="其他要求"
          name="otherDemands"
          rules={[{ required: false }]}
        >
          <TextArea
            rows={4}
            placeholder="例如：无 / 由于XXX原因，希望找一个男生/女生/上班族/不接受情侣/……"
          />
        </Form.Item>
        <Form.Item>
          图片请点击下方编辑器的图片上传按钮上传，其他未尽内容请在下方编辑器输入。
        </Form.Item>
      </Form>
    </Modal>
  );
}
