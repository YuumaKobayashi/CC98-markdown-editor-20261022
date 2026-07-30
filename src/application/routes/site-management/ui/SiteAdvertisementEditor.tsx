import * as React from "react";
import { useRef, useState } from "react";
import { Button, Checkbox, Input, Table } from "antd";
import moment from "moment";

import { getToken } from "@modules/session";
import { cc98Fetch } from "@foundation/api/http";

const columnTypeNames = ["推荐阅读", "推荐功能", "校园新闻", "Banner", "", "", "福利优惠"];
const urls = [
  "/index/column/recommandationreading",
  "/index/column/recommandationfunction",
  "/index/column/schoolnews",
  "/config/global/advertisement",
  "",
  "",
  "/config/global/special-offer",
];

interface ForumIndexColumnInfo {
  id: number;
  /** 1=推荐阅读，2=推荐功能，3=校园新闻，4=Banner，7=福利优惠 */
  type: number;
  /** 必须，Banner表示对Banner的简单描述 */
  title: string;
  /** 只有推荐阅读需要 */
  content: string;
  /** 校园新闻不需要 */
  url: string;
  /** 校园新闻不需要 */
  imageUrl: string;
  /** 排序权重，只有推荐阅读和推荐功能需要 */
  orderWeight: number;
  /** 是否显示 */
  enable: boolean;
  /** Banner和福利优惠需要，大于0的整数 */
  days: number;
  /** */
  isNew: boolean;
  /** */
  expiredTime: string;
  visibility: number;
}

export function SiteAdvertisementEditor() {
  const [info, setInfo] = useState("");
  const [data, setData] = useState<ForumIndexColumnInfo[]>([]);
  const [type, setType] = useState(0);
  const [current, setCurrent] = useState(1);
  const requestId = useRef(0);

  const getInfo = async (url: string) => {
    const currentRequest = ++requestId.current;
    setType(urls.indexOf(url) + 1);
    setData([]);
    try {
      const token = await getToken();
      const headers = new Headers();
      headers.append("Authorization", token);
      const response = await cc98Fetch(`${url}/all`, { headers });
      const nextData = await response.json();
      if (requestId.current === currentRequest) setData(nextData);
    } catch (error) {
      if (requestId.current === currentRequest) setInfo(error.message);
    }
  };

  //TODO：类型校验 any?
  const handleTdChange = (key: string, value: any, index: number) => {
    let nextValue = value;
    if (key === "visibility") {
      const parsedValue = Number.parseInt(value, 10);
      if (Number.isNaN(parsedValue)) {
        if (type === 4) {
          nextValue = 1;
        } else {
          nextValue = 0;
        }
      } else {
        nextValue = parsedValue;
      }
    }
    setData((currentData) =>
      currentData.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: nextValue } : item
      )
    );
  };

  const putCurData = async (index: number) => {
    const item = data[index];
    if (!item) return;
    const url = item.isNew ? "/index/column/" : `/index/column/${item.id}`;
    const method = item.isNew ? "POST" : "PUT";
    try {
      const token = await getToken();
      const headers = new Headers();
      headers.append("Authorization", token);
      headers.append("Content-Type", "application/json");
      const response = await cc98Fetch(url, {
        method,
        headers,
        body: JSON.stringify(item),
      });
      if (response.status !== 200) throw new Error(response.status.toString());
      setInfo("修改成功");
    } catch (error) {
      setInfo(error.message);
    }
  };

  const add = () => {
    const nextId = data.reduce((maximum, item) => Math.max(maximum, item.id), 0) + 1;
    const newData = {
      enable: true,
      isNew: true,
      type,
      id: nextId,
      visibility: type === 4 ? 1 : 0,
    } as ForumIndexColumnInfo;
    setData((currentData) => [newData, ...currentData]);
  };

  const onPageChange = (pagination) => {
    setCurrent(pagination.current);
  };

  const getDataIndex = (index: number) => (current - 1) * 10 + index;
  const columns = [
    { title: "id", dataIndex: "id", key: "id", width: 60 },
    { title: "类型", dataIndex: "type", key: "type", width: 100, render: (text) => columnTypeNames[text - 1] },
    {
      title: "标题", dataIndex: "title", key: "title", width: 200,
      render: (text, _record, index) => <Input type="text" onChange={(event) => handleTdChange("title", event.target.value, getDataIndex(index))} value={text} />,
    },
    type === 1 ? {
      title: "内容", dataIndex: "content", key: "content", width: 200,
      render: (text, _record, index) => <Input type="text" onChange={(event) => handleTdChange("content", event.target.value, getDataIndex(index))} value={text} />,
    } : null,
    {
      title: "url", dataIndex: "url", key: "url", width: 200,
      render: (text, _record, index) => <Input type="text" onChange={(event) => handleTdChange("url", event.target.value, getDataIndex(index))} value={text} />,
    },
    type !== 3 && type !== 7 ? {
      title: "图片url", dataIndex: "imageUrl", key: "imageUrl", width: 200,
      render: (text, _record, index) => <Input type="text" onChange={(event) => handleTdChange("imageUrl", event.target.value, getDataIndex(index))} value={text} />,
    } : null,
    type === 1 || type === 2 ? {
      title: "排序权重", dataIndex: "orderWeight", key: "orderWeight", width: 100,
      render: (text, _record, index) => <Input type="text" onChange={(event) => handleTdChange("orderWeight", event.target.value, getDataIndex(index))} value={text} />,
    } : null,
    {
      title: "有效", dataIndex: "enable", key: "enable", width: 80,
      render: (text, _record, index) => <Checkbox checked={text} onChange={(event) => handleTdChange("enable", event.target.checked, getDataIndex(index))} />,
    },
    type === 4 || type === 7 ? {
      title: "天数 (新增和修改都填距现在时间)", dataIndex: "days", key: "days",
      render: (text, _record, index) => <Input type="text" onChange={(event) => handleTdChange("days", event.target.value, getDataIndex(index))} value={text} />,
    } : null,
    type === 4 || type === 7 ? {
      title: "过期时间", dataIndex: "expiredTime", key: "expiredTime",
      render: (text) => moment(text).format("YYYY-MM-DD HH:mm:ss"),
    } : null,
    {
      title: "可见性 (0-都可见 1-仅登录 2-仅未登录)", dataIndex: "visibility", key: "visibility",
      render: (text, _record, index) => <Input type="text" onChange={(event) => handleTdChange("visibility", event.target.value, getDataIndex(index))} value={text} />,
    },
    {
      title: "保存", dataIndex: "save", key: "save", width: 100,
      render: (_text, _record, index) => <Button type="primary" onClick={() => putCurData(getDataIndex(index))}>保存</Button>,
    },
  ].filter(Boolean);

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: "1rem", borderTop: "#eaeaea solid thin", paddingTop: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", width: "100%", marginBottom: "1rem" }}>
        <div style={{ marginTop: "10px" }}>自定义栏目</div>
        <div><Button type="primary" disabled={type === 1} onClick={() => getInfo(urls[0])}>推荐阅读</Button></div>
        <div><Button type="primary" disabled={type === 2} onClick={() => getInfo(urls[1])}>推荐功能</Button></div>
        <div><Button type="primary" disabled={type === 4} onClick={() => getInfo(urls[3])}>Banner</Button></div>
        <div><Button type="primary" disabled={type === 7} onClick={() => getInfo(urls[6])}>福利优惠</Button></div>
        {type > 0 ? <div><Button type="primary" onClick={add}>添加</Button></div> : null}
      </div>
      <div>
        <Table bordered onChange={onPageChange} columns={columns} dataSource={data} />
        <p>{info}</p>
      </div>
    </div>
  );
}
