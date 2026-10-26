import * as React from "react";

import { Button } from "@foundation/ui/button";
import { Dialog } from "@foundation/ui/dialog";
import { NoticeMessage, noticeMessageShow } from "@foundation/ui/feedback";
import { Field } from "@foundation/ui/field";
import { Input } from "@foundation/ui/input";
import { Select } from "@foundation/ui/select";
import {
  createFavGroup,
  deleteFavGroup,
  updateFavGroup,
} from "@modules/favorite-topic/api/service";
import type { FavoriteTopicGroup } from "@modules/favorite-topic/model/favorite-topic-group";

import styles from "./FavoriteTopicGroupManager.module.scss";

enum Options {
  Default = "0",
  Create = "1",
  Rename = "2",
  Delete = "3",
}

type MutationResult = "ok" | "error";

type FavoriteTopicGroupManagerProps = {
  updateFavoriteTopicList: () => Promise<void>;
  favoriteTopicList: FavoriteTopicGroup[];
  createFavoriteTopicGroup?: (name: string) => Promise<MutationResult>;
  renameFavoriteTopicGroup?: (
    id: number | undefined,
    name: string | undefined,
  ) => Promise<MutationResult>;
  deleteFavoriteTopicGroup?: (
    id: number | undefined,
  ) => Promise<MutationResult>;
};

interface FieldErrors {
  createName?: string;
  renameId?: string;
  renameName?: string;
  deleteId?: string;
}

const emptyErrors: FieldErrors = {};
const nameErrorMessage = "请输入最多十个字符且不为空的名称";

function validateGroupName(value: string) {
  return value.length === 0 || value.length > 10
    ? nameErrorMessage
    : undefined;
}

export function FavoriteTopicGroupManager({
  favoriteTopicList,
  updateFavoriteTopicList,
  createFavoriteTopicGroup = createFavGroup,
  renameFavoriteTopicGroup = (id, name) =>
    updateFavGroup(id as number, name as string),
  deleteFavoriteTopicGroup = (id) => deleteFavGroup(id as number),
}: FavoriteTopicGroupManagerProps) {
  const [visible, setVisible] = React.useState(false);
  const [option, setOption] = React.useState(Options.Create);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [createName, setCreateName] = React.useState("");
  const [renameId, setRenameId] = React.useState<number | null>(null);
  const [renameName, setRenameName] = React.useState("");
  const [deleteId, setDeleteId] = React.useState<number | null>(null);
  const [errors, setErrors] = React.useState<FieldErrors>(emptyErrors);
  const tabRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const instanceId = React.useId().replace(/:/g, "");

  const groupOptions = favoriteTopicList
    .filter((item) => item.id !== 0)
    .map((item) => ({
      value: item.id,
      label: `${item.name} (${item.count})`,
    }));
  const isFavoriteTopicListMax = favoriteTopicList.length - 1 === 10;
  const hasOnlyDefaultGroup = favoriteTopicList.length === 1;

  const resetFields = React.useCallback(() => {
    setCreateName("");
    setRenameId(null);
    setRenameName("");
    setDeleteId(null);
    setErrors(emptyErrors);
  }, []);

  const selectOption = (nextOption: Options) => {
    if (nextOption === option) return;
    resetFields();
    setOption(nextOption);
  };

  const moveTabFocus = (startIndex: number, direction: 1 | -1) => {
    const index = (startIndex + direction + tabs.length) % tabs.length;
    tabRefs.current[index]?.focus();
    selectOption(tabs[index].id);
  };

  const handleTabKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      moveTabFocus(index, event.key === "ArrowRight" ? 1 : -1);
      return;
    }
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      const targetIndex = event.key === "Home" ? 0 : tabs.length - 1;
      tabRefs.current[targetIndex]?.focus();
      selectOption(tabs[targetIndex].id);
    }
  };

  const validate = () => {
    const nextErrors: FieldErrors = {};
    if (option === Options.Create) {
      if (createName.length === 0 || createName.length > 10) {
        nextErrors.createName = nameErrorMessage;
      }
    } else if (option === Options.Rename && !hasOnlyDefaultGroup) {
      if (renameId === null) {
        nextErrors.renameId = "请选择需要更名的收藏组";
      }
      if (renameName.length === 0 || renameName.length > 10) {
        nextErrors.renameName = nameErrorMessage;
      }
    } else if (option === Options.Delete && !hasOnlyDefaultGroup) {
      if (deleteId === null) {
        nextErrors.deleteId = "请选择需要删除的收藏组";
      }
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleOk = async () => {
    if (!validate()) return;

    setConfirmLoading(true);
    try {
      switch (option) {
        case Options.Create: {
          const result = await createFavoriteTopicGroup(createName);
          if (result !== "ok") {
            noticeMessageShow("maxFavGroup");
            return;
          }
          break;
        }
        case Options.Rename: {
          const result = await renameFavoriteTopicGroup(
            hasOnlyDefaultGroup ? undefined : (renameId ?? undefined),
            hasOnlyDefaultGroup ? undefined : renameName,
          );
          if (result !== "ok") {
            noticeMessageShow("other");
            return;
          }
          break;
        }
        case Options.Delete: {
          const result = await deleteFavoriteTopicGroup(
            hasOnlyDefaultGroup ? undefined : (deleteId ?? undefined),
          );
          if (result !== "ok") {
            noticeMessageShow("other");
            return;
          }
          break;
        }
        default:
          break;
      }

      noticeMessageShow("success");
      await updateFavoriteTopicList();
      setVisible(false);
      resetFields();
    } catch (_error) {
      return;
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleOpenChange = (nextVisible: boolean) => {
    setVisible(nextVisible);
    if (!nextVisible) resetFields();
  };

  const emptyForm = (
    <div className={styles.emptyForm}>
      <div>没有可供操作的收藏组</div>
      <div>默认分组不可删除或重命名</div>
    </div>
  );

  const createForm = (
    <div className={styles.createForm}>
      <Field
        label="分组名称"
        controlId={`${instanceId}-create-name`}
        required
        error={errors.createName}
        errorId={`${instanceId}-create-error`}
        description={
          <>
            目前支持的分组上限为10个，你已经创建了
            {favoriteTopicList.length - 1}个分组
          </>
        }
        descriptionId={`${instanceId}-create-extra`}
        classNames={{
          root: styles.formItem,
          label: styles.label,
          control: styles.control,
          description: styles.extra,
          error: styles.error,
        }}
        data-error={errors.createName ? "" : undefined}
      >
        <Input
          id={`${instanceId}-create-name`}
          className={styles.input}
          value={createName}
          disabled={isFavoriteTopicListMax}
          status={errors.createName ? "error" : undefined}
          aria-invalid={errors.createName ? true : undefined}
          aria-describedby={`${instanceId}-create-extra${
            errors.createName ? ` ${instanceId}-create-error` : ""
          }`}
          onChange={(event) => {
            const nextName = event.target.value;
            setCreateName(nextName);
            setErrors((current) => ({
              ...current,
              createName: validateGroupName(nextName),
            }));
          }}
        />
      </Field>
    </div>
  );

  const renameForm = hasOnlyDefaultGroup ? (
    emptyForm
  ) : (
    <div className={styles.renameForm}>
      <Field
        label="分组名称"
        required
        error={errors.renameId}
        errorId={`${instanceId}-rename-id-error`}
        classNames={{
          root: styles.formItem,
          label: styles.label,
          control: styles.control,
          error: styles.error,
        }}
        data-error={errors.renameId ? "" : undefined}
      >
        <Select
          className={styles.select}
          classNames={{
            trigger: styles.selectTrigger,
            positioner: styles.selectPositioner,
            popup: styles.selectPopup,
            item: styles.selectItem,
          }}
          ariaLabel="分组名称"
          ariaInvalid={Boolean(errors.renameId)}
          ariaDescribedBy={errors.renameId ? `${instanceId}-rename-id-error` : undefined}
          options={groupOptions}
          value={renameId}
          highlightFirstItemOnOpen
          onValueChange={(value) => {
            setRenameId(value);
            setErrors((current) => ({ ...current, renameId: undefined }));
          }}
        />
      </Field>
      <Field
        label="将名称修改为"
        controlId={`${instanceId}-rename-name`}
        required
        error={errors.renameName}
        errorId={`${instanceId}-rename-name-error`}
        classNames={{
          root: styles.formItem,
          label: styles.label,
          control: styles.control,
          error: styles.error,
        }}
        data-error={errors.renameName ? "" : undefined}
      >
        <Input
          id={`${instanceId}-rename-name`}
          className={styles.input}
          value={renameName}
          status={errors.renameName ? "error" : undefined}
          aria-invalid={errors.renameName ? true : undefined}
          aria-describedby={errors.renameName ? `${instanceId}-rename-name-error` : undefined}
          onChange={(event) => {
            const nextName = event.target.value;
            setRenameName(nextName);
            setErrors((current) => ({
              ...current,
              renameName: validateGroupName(nextName),
            }));
          }}
        />
      </Field>
    </div>
  );

  const deleteForm = hasOnlyDefaultGroup ? (
    emptyForm
  ) : (
    <div className={styles.deleteForm}>
      <Field
        label="分组名称"
        required
        error={errors.deleteId}
        errorId={`${instanceId}-delete-id-error`}
        classNames={{
          root: styles.formItem,
          label: styles.label,
          control: styles.control,
          error: styles.error,
        }}
        data-error={errors.deleteId ? "" : undefined}
      >
        <Select
          className={styles.select}
          classNames={{
            trigger: styles.selectTrigger,
            positioner: styles.selectPositioner,
            popup: styles.selectPopup,
            item: styles.selectItem,
          }}
          ariaLabel="分组名称"
          ariaInvalid={Boolean(errors.deleteId)}
          ariaDescribedBy={errors.deleteId ? `${instanceId}-delete-id-error` : undefined}
          options={groupOptions}
          value={deleteId}
          highlightFirstItemOnOpen
          onValueChange={(value) => {
            setDeleteId(value);
            setErrors((current) => ({ ...current, deleteId: undefined }));
          }}
        />
      </Field>
      <div className={styles.warning}>
        注意：删除后该分组将无法恢复，该分组下的所有收藏主题帖将被移入【默认分组】
      </div>
    </div>
  );

  let optionForm: React.ReactNode = null;
  switch (option) {
    case Options.Create:
      optionForm = createForm;
      break;
    case Options.Rename:
      optionForm = renameForm;
      break;
    case Options.Delete:
      optionForm = deleteForm;
      break;
    default:
      break;
  }

  return (
    <span>
      <Button type="primary" className={styles.manageButton} onClick={() => setVisible(true)}>
        管理分组
      </Button>
      <NoticeMessage text="收藏分组达到上限" id="maxFavGroup" top="33%" left="40%" />
      <NoticeMessage text="操作成功" id="success" top="33%" left="40%" />
      <NoticeMessage text="操作失败" id="other" top="33%" left="40%" />
      <Dialog
        title="收藏管理"
        open={visible}
        onOpenChange={handleOpenChange}
        onConfirm={handleOk}
        confirmLoading={confirmLoading}
        cancelText="取 消"
        confirmText="确 定"
        width={520}
        className={styles.dialog}
        bodyClassName={styles.dialogBody}
        classNames={{
          content: styles.dialogContent,
          header: styles.dialogHeader,
          close: styles.dialogClose,
          footer: styles.dialogFooter,
          cancel: styles.dialogButton,
          confirm: styles.dialogButton,
        }}
      >
        <div className={styles.dialogMain}>
          <div className={styles.tabList} role="tablist" aria-label="收藏管理操作">
            {tabs.map((tab, index) => {
              const selected = tab.id === option;
              return (
                <button
                  key={tab.id}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  id={`${instanceId}-tab-${tab.id}`}
                  className={styles.tab}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`${instanceId}-panel-${tab.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => selectOption(tab.id)}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
          <div
            id={`${instanceId}-panel-${option}`}
            className={styles.panel}
            role="tabpanel"
            aria-labelledby={`${instanceId}-tab-${option}`}
          >
            {optionForm}
          </div>
        </div>
      </Dialog>
    </span>
  );
}

const tabs = [
  { id: Options.Create, label: "新增分组" },
  { id: Options.Rename, label: "编辑分组" },
  { id: Options.Delete, label: "删除分组" },
] as const;

export default FavoriteTopicGroupManager;
