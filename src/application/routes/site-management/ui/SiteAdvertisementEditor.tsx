import * as React from "react";
import { useRef, useState } from "react";
import { Button, Checkbox, Input, Table } from "antd";
import moment from "moment";

import {
  ForumIndexColumnType,
  ForumIndexColumnVisibility,
  getIndexColumnInfo,
  putIndexColumnInfo,
} from "@modules/site-content";
import type { ForumIndexColumnInfo } from "@modules/site-content";

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

export function SiteAdvertisementEditor() {
  const [info, setInfo] = useState("");
  const [data, setData] = useState<ForumIndexColumnInfo[]>([]);
  const [type, setType] = useState<ForumIndexColumnType | 0>(0);
  const [current, setCurrent] = useState(1);
  const requestId = useRef(0);

  const getInfo = async (url: string) => {
    const currentRequest = ++requestId.current;
    setType((urls.indexOf(url) + 1) as ForumIndexColumnType);
    setData([]);
    try {
      const nextData = await getIndexColumnInfo(url);
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
        if (type === ForumIndexColumnType.Advertisement) {
          nextValue = ForumIndexColumnVisibility.OnlyLogOn;
        } else {
          nextValue = ForumIndexColumnVisibility.Always;
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
    try {
      await putIndexColumnInfo(item);
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
      visibility:
        type === ForumIndexColumnType.Advertisement
          ? ForumIndexColumnVisibility.OnlyLogOn
          : ForumIndexColumnVisibility.Always,
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
    type === ForumIndexColumnType.RecommendationReading ? {
      title: "内容", dataIndex: "content", key: "content", width: 200,
      render: (text, _record, index) => <Input type="text" onChange={(event) => handleTdChange("content", event.target.value, getDataIndex(index))} value={text} />,
    } : null,
    {
      title: "url", dataIndex: "url", key: "url", width: 200,
      render: (text, _record, index) => <Input type="text" onChange={(event) => handleTdChange("url", event.target.value, getDataIndex(index))} value={text} />,
    },
    type !== ForumIndexColumnType.SchoolNews &&
    type !== ForumIndexColumnType.SpecialOffer ? {
      title: "图片url", dataIndex: "imageUrl", key: "imageUrl", width: 200,
      render: (text, _record, index) => <Input type="text" onChange={(event) => handleTdChange("imageUrl", event.target.value, getDataIndex(index))} value={text} />,
    } : null,
    type === ForumIndexColumnType.RecommendationReading ||
    type === ForumIndexColumnType.RecommendationFunction ? {
      title: "排序权重", dataIndex: "orderWeight", key: "orderWeight", width: 100,
      render: (text, _record, index) => <Input type="text" onChange={(event) => handleTdChange("orderWeight", event.target.value, getDataIndex(index))} value={text} />,
    } : null,
    {
      title: "有效", dataIndex: "enable", key: "enable", width: 80,
      render: (text, _record, index) => <Checkbox checked={text} onChange={(event) => handleTdChange("enable", event.target.checked, getDataIndex(index))} />,
    },
    type === ForumIndexColumnType.Advertisement ||
    type === ForumIndexColumnType.SpecialOffer ? {
      title: "天数 (新增和修改都填距现在时间)", dataIndex: "days", key: "days",
      render: (text, _record, index) => <Input type="text" onChange={(event) => handleTdChange("days", event.target.value, getDataIndex(index))} value={text} />,
    } : null,
    type === ForumIndexColumnType.Advertisement ||
    type === ForumIndexColumnType.SpecialOffer ? {
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
        <div><Button type="primary" disabled={type === ForumIndexColumnType.RecommendationReading} onClick={() => getInfo(urls[0])}>推荐阅读</Button></div>
        <div><Button type="primary" disabled={type === ForumIndexColumnType.RecommendationFunction} onClick={() => getInfo(urls[1])}>推荐功能</Button></div>
        <div><Button type="primary" disabled={type === ForumIndexColumnType.Advertisement} onClick={() => getInfo(urls[3])}>Banner</Button></div>
        <div><Button type="primary" disabled={type === ForumIndexColumnType.SpecialOffer} onClick={() => getInfo(urls[6])}>福利优惠</Button></div>
        {type > 0 ? <div><Button type="primary" onClick={add}>添加</Button></div> : null}
      </div>
      <div>
        <Table bordered onChange={onPageChange} columns={columns} dataSource={data} />
        <p>{info}</p>
      </div>
    </div>
  );
}
