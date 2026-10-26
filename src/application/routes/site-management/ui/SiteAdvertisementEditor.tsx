import * as React from "react";
import moment from "moment";

import { Button } from "@foundation/ui/button";
import { Checkbox } from "@foundation/ui/checkbox";
import {
  DataTable,
  type DataTableColumn,
} from "@foundation/ui/data-table";
import { Input } from "@foundation/ui/input";
import {
  getIndexColumnInfo,
  putIndexColumnInfo,
} from "@modules/site-content/api/service";
import {
  ForumIndexColumnType,
  ForumIndexColumnVisibility,
} from "@modules/site-content/model/dto";
import type {
  ForumIndexColumn,
  PostForumIndexColumnInfo,
} from "@modules/site-content/model/dto";

import styles from "./SiteAdvertisementEditor.module.scss";

interface SiteIndexColumnEditorItem
  extends Omit<ForumIndexColumn, "id"> {
  id: number | null;
  /** Stable local identity for unsaved rows. Not part of the wire DTO. */
  clientKey?: string;
  /** Only distinguishes unsaved editor rows. Not part of the wire DTO. */
  isNew?: boolean;
  /** Submitted by the Banner and special-offer editors. Not part of the GET DTO. */
  days?: number | string;
}

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

export interface SiteAdvertisementEditorOperations {
  load: (url: string) => Promise<ForumIndexColumn[]>;
  save: (id: number | null, body: PostForumIndexColumnInfo) => Promise<void>;
}

interface SiteAdvertisementEditorProps {
  operations?: SiteAdvertisementEditorOperations;
}

const defaultOperations: SiteAdvertisementEditorOperations = {
  load: getIndexColumnInfo,
  save: putIndexColumnInfo,
};

function getEditorRowKey(item: SiteIndexColumnEditorItem) {
  return item.clientKey ?? `server-${item.type}-${item.id}`;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function getTextInputValue(value: unknown) {
  return value === null || value === undefined ? "" : String(value);
}

function matchesCreatedRow(
  row: ForumIndexColumn,
  body: PostForumIndexColumnInfo
) {
  return (
    row.type === body.type &&
    row.title === body.title &&
    row.content === (body.content ?? null) &&
    row.url === (body.url ?? null) &&
    row.imageUrl === (body.imageUrl ?? null) &&
    Number(row.orderWeight ?? 0) === Number(body.orderWeight ?? 0) &&
    row.enable === body.enable &&
    row.visibility === body.visibility
  );
}

export function SiteAdvertisementEditor({
  operations = defaultOperations,
}: SiteAdvertisementEditorProps) {
  const [info, setInfo] = React.useState("");
  const [data, setData] = React.useState<SiteIndexColumnEditorItem[]>([]);
  const [type, setType] = React.useState<ForumIndexColumnType | 0>(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [pendingSaveKeys, setPendingSaveKeys] = React.useState<Set<string>>(
    () => new Set()
  );
  const [unresolvedCreateKeys, setUnresolvedCreateKeys] = React.useState<
    Set<string>
  >(() => new Set());
  const requestId = React.useRef(0);
  const viewRevision = React.useRef(0);
  const nextClientKey = React.useRef(0);
  const pendingSaveKeysRef = React.useRef(new Set<string>());
  const unresolvedCreateKeysRef = React.useRef(new Set<string>());
  const activeTypeRef = React.useRef<ForumIndexColumnType | 0>(0);
  const mountedRef = React.useRef(true);

  React.useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      requestId.current += 1;
      pendingSaveKeysRef.current.clear();
      unresolvedCreateKeysRef.current.clear();
    };
  }, []);

  const loadInfo = async (url: string, nextType: ForumIndexColumnType) => {
    const currentRequest = ++requestId.current;
    viewRevision.current += 1;
    activeTypeRef.current = nextType;
    unresolvedCreateKeysRef.current.clear();
    setUnresolvedCreateKeys(new Set());
    setCurrentPage(1);
    setType(nextType);
    setLoading(true);
    setData([]);
    try {
      const nextData = await operations.load(url);
      if (mountedRef.current && requestId.current === currentRequest) {
        setData(nextData);
        setLoading(false);
      }
    } catch (error) {
      if (mountedRef.current && requestId.current === currentRequest) {
        setInfo(getErrorMessage(error));
        setLoading(false);
      }
    }
  };

  const getInfo = (url: string) =>
    loadInfo(url, (urls.indexOf(url) + 1) as ForumIndexColumnType);

  // TODO: Replace the legacy stringly-typed cell updater when form validation is owned.
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
    const rowKey = getEditorRowKey(item);
    if (
      pendingSaveKeysRef.current.has(rowKey) ||
      unresolvedCreateKeysRef.current.has(rowKey)
    ) {
      return;
    }
    const isNew = item.isNew === true || item.id === null;
    const saveViewRevision = viewRevision.current;
    const knownServerIds = new Set(
      data.flatMap((row) => (row.id === null ? [] : [row.id]))
    );

    pendingSaveKeysRef.current.add(rowKey);
    setPendingSaveKeys((current) => new Set(current).add(rowKey));
    try {
      const body: PostForumIndexColumnInfo = {
        type: item.type,
        title: item.title,
        content: item.content,
        url: item.url,
        imageUrl: item.imageUrl,
        orderWeight: item.orderWeight,
        enable: item.enable,
        visibility: item.visibility,
        ...(item.days === undefined ? {} : { days: Number(item.days) }),
      };
      await operations.save(isNew ? null : item.id, body);
      if (!mountedRef.current) return;

      if (!isNew) {
        if (viewRevision.current === saveViewRevision) setInfo("修改成功");
        return;
      }

      if (
        viewRevision.current === saveViewRevision &&
        activeTypeRef.current === item.type
      ) {
        const url = urls[item.type - 1];
        if (!url) {
          unresolvedCreateKeysRef.current.add(rowKey);
          setUnresolvedCreateKeys(
            (current) => new Set(current).add(rowKey)
          );
          setInfo("新增成功，但无法刷新服务器记录。请切换栏目后再继续操作");
          return;
        }

        let serverRows: ForumIndexColumn[];
        try {
          serverRows = await operations.load(url);
        } catch (error) {
          if (
            mountedRef.current &&
            viewRevision.current === saveViewRevision &&
            activeTypeRef.current === item.type
          ) {
            unresolvedCreateKeysRef.current.add(rowKey);
            setUnresolvedCreateKeys(
              (current) => new Set(current).add(rowKey)
            );
            setInfo(
              `新增成功，但读取服务器记录失败：${getErrorMessage(
                error
              )}。请切换栏目后再继续操作`
            );
          }
          return;
        }

        if (
          !mountedRef.current ||
          viewRevision.current !== saveViewRevision ||
          activeTypeRef.current !== item.type
        ) {
          return;
        }

        const createdRows = serverRows.filter(
          (row) => !knownServerIds.has(row.id)
        );
        if (
          createdRows.length !== 1 ||
          !matchesCreatedRow(createdRows[0], body)
        ) {
          unresolvedCreateKeysRef.current.add(rowKey);
          setUnresolvedCreateKeys(
            (current) => new Set(current).add(rowKey)
          );
          setInfo(
            "新增成功，但无法唯一确认服务器记录。请切换栏目后再继续操作"
          );
          return;
        }

        setData((currentData) =>
          currentData.map((row) =>
            getEditorRowKey(row) === rowKey
              ? {
                  ...row,
                  id: createdRows[0].id,
                  isNew: false,
                  clientKey: undefined,
                  time: createdRows[0].time,
                  expiredTime: createdRows[0].expiredTime,
                }
              : row
          )
        );
        setInfo("修改成功");
      }
    } catch (error) {
      if (mountedRef.current && viewRevision.current === saveViewRevision) {
        setInfo(getErrorMessage(error));
      }
    } finally {
      pendingSaveKeysRef.current.delete(rowKey);
      if (mountedRef.current) {
        setPendingSaveKeys((current) => {
          const next = new Set(current);
          next.delete(rowKey);
          return next;
        });
      }
    }
  };

  const add = () => {
    if (loading) return;
    nextClientKey.current += 1;
    const newData = {
      clientKey: `new-${type}-${nextClientKey.current}`,
      enable: true,
      isNew: true,
      type,
      id: null,
      visibility:
        type === ForumIndexColumnType.Advertisement
          ? ForumIndexColumnVisibility.OnlyLogOn
          : ForumIndexColumnVisibility.Always,
    } as SiteIndexColumnEditorItem;
    setData((currentData) => [newData, ...currentData]);
  };

  const candidateColumns: Array<
    DataTableColumn<SiteIndexColumnEditorItem> | null
  > = [
    {
      key: "id",
      header: "id",
      width: data.length > 0 ? 80 : 60,
      render: (item) => item.id,
    },
    {
      key: "type",
      header: "类型",
      width: 100,
      render: (item) => columnTypeNames[item.type - 1],
    },
    {
      key: "title",
      header: "标题",
      width: 200,
      render: (item, index) => (
        <Input
          type="text"
          data-site-advertisement-field="title"
          data-site-advertisement-row-key={getEditorRowKey(item)}
          data-site-advertisement-value={getTextInputValue(item.title)}
          onChange={(event) => handleTdChange("title", event.target.value, index)}
          value={getTextInputValue(item.title)}
        />
      ),
    },
    type === ForumIndexColumnType.RecommendationReading
      ? {
          key: "content",
          header: "内容",
          width: 200,
          render: (item, index) => (
            <Input
              type="text"
              onChange={(event) =>
                handleTdChange("content", event.target.value, index)
              }
              value={getTextInputValue(item.content)}
            />
          ),
        }
      : null,
    {
      key: "url",
      header: "url",
      width: 200,
      render: (item, index) => (
        <Input
          type="text"
          onChange={(event) => handleTdChange("url", event.target.value, index)}
          value={getTextInputValue(item.url)}
        />
      ),
    },
    type !== ForumIndexColumnType.SchoolNews &&
    type !== ForumIndexColumnType.SpecialOffer
      ? {
          key: "imageUrl",
          header: "图片url",
          width: 200,
          render: (item, index) => (
            <Input
              type="text"
              onChange={(event) =>
                handleTdChange("imageUrl", event.target.value, index)
              }
              value={getTextInputValue(item.imageUrl)}
            />
          ),
        }
      : null,
    type === ForumIndexColumnType.RecommendationReading ||
    type === ForumIndexColumnType.RecommendationFunction
      ? {
          key: "orderWeight",
          header: "排序权重",
          width: 100,
          render: (item, index) => (
            <Input
              type="text"
              data-site-advertisement-field="orderWeight"
              data-site-advertisement-row-key={getEditorRowKey(item)}
              data-site-advertisement-value={getTextInputValue(
                item.orderWeight
              )}
              onChange={(event) =>
                handleTdChange("orderWeight", event.target.value, index)
              }
              value={getTextInputValue(item.orderWeight)}
            />
          ),
        }
      : null,
    {
      key: "enable",
      header: "有效",
      width: 80,
      render: (item, index) => (
        <Checkbox
          checked={item.enable}
          onChange={(event) =>
            handleTdChange("enable", event.target.checked, index)
          }
        />
      ),
    },
    type === ForumIndexColumnType.Advertisement ||
    type === ForumIndexColumnType.SpecialOffer
      ? {
          key: "days",
          header: "天数 (新增和修改都填距现在时间)",
          width:
            type === ForumIndexColumnType.Advertisement ? 140 : undefined,
          render: (item, index) => (
            <Input
              type="text"
              onChange={(event) =>
                handleTdChange("days", event.target.value, index)
              }
              value={getTextInputValue(item.days)}
            />
          ),
        }
      : null,
    type === ForumIndexColumnType.Advertisement ||
    type === ForumIndexColumnType.SpecialOffer
      ? {
          key: "expiredTime",
          header: "过期时间",
          render: (item) => moment(item.expiredTime).format("YYYY-MM-DD HH:mm:ss"),
        }
      : null,
    {
      key: "visibility",
      header: "可见性 (0-都可见 1-仅登录 2-仅未登录)",
      minWidth: type > 0 ? 140 : undefined,
      render: (item, index) => (
        <Input
          type="text"
          onChange={(event) =>
            handleTdChange("visibility", event.target.value, index)
          }
          value={getTextInputValue(item.visibility)}
        />
      ),
    },
    {
      key: "save",
      header: "保存",
      width: 100,
      render: (item, index) => {
        const rowKey = getEditorRowKey(item);
        const pending = pendingSaveKeys.has(rowKey);
        const unresolved = unresolvedCreateKeys.has(rowKey);
        return (
          <Button
            type="primary"
            data-site-advertisement-save-index={index}
            data-site-advertisement-save-key={rowKey}
            data-site-advertisement-save-pending={pending ? "true" : "false"}
            data-site-advertisement-save-unresolved={
              unresolved ? "true" : "false"
            }
            disabled={pending || unresolved}
            onClick={() => void putCurData(index)}
          >
            保存
          </Button>
        );
      },
    },
  ];
  const columns = candidateColumns.filter(
    (column): column is DataTableColumn<SiteIndexColumnEditorItem> =>
      column !== null
  );

  return (
    <div
      className={styles.root}
      data-site-advertisement-type={type}
      data-site-advertisement-row-count={data.length}
      data-site-advertisement-current-page={currentPage}
      data-site-advertisement-loading={loading ? "true" : "false"}
      data-site-advertisement-pending-save-count={pendingSaveKeys.size}
      data-site-advertisement-unresolved-create-count={
        unresolvedCreateKeys.size
      }
    >
      <div className={styles.toolbar}>
        <div className={styles.toolbarTitle}>自定义栏目</div>
        <div>
          <Button
            type="primary"
            data-site-advertisement-load-type={
              ForumIndexColumnType.RecommendationReading
            }
            disabled={type === ForumIndexColumnType.RecommendationReading}
            onClick={() => void getInfo(urls[0])}
          >
            推荐阅读
          </Button>
        </div>
        <div>
          <Button
            type="primary"
            data-site-advertisement-load-type={
              ForumIndexColumnType.RecommendationFunction
            }
            disabled={type === ForumIndexColumnType.RecommendationFunction}
            onClick={() => void getInfo(urls[1])}
          >
            推荐功能
          </Button>
        </div>
        <div>
          <Button
            type="primary"
            data-site-advertisement-load-type={ForumIndexColumnType.Advertisement}
            disabled={type === ForumIndexColumnType.Advertisement}
            onClick={() => void getInfo(urls[3])}
          >
            Banner
          </Button>
        </div>
        <div>
          <Button
            type="primary"
            data-site-advertisement-load-type={ForumIndexColumnType.SpecialOffer}
            disabled={type === ForumIndexColumnType.SpecialOffer}
            onClick={() => void getInfo(urls[6])}
          >
            福利优惠
          </Button>
        </div>
        {type > 0 ? (
          <div>
            <Button
              type="primary"
              data-site-advertisement-add
              disabled={loading}
              onClick={add}
            >
              添加
            </Button>
          </div>
        ) : null}
      </div>
      <div
        className={styles.tableRegion}
        data-site-advertisement-table-region
      >
        <DataTable
          bordered
          ariaLabel="自定义栏目"
          rows={data}
          columns={columns}
          getRowKey={getEditorRowKey}
          currentPage={currentPage}
          pageSize={10}
          loading={loading}
          loadingText="暂无数据"
          onPageChange={setCurrentPage}
        />
        <p data-site-advertisement-info>
          {info}
        </p>
      </div>
    </div>
  );
}
