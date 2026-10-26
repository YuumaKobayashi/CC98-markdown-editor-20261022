import * as React from "react";

import { Dialog } from "@foundation/ui/dialog";
import { TextArea } from "@foundation/ui/input";
import { UbbCodeOptions } from "@modules/ubb/engine/Core";
import { UbbContainer } from "@modules/ubb/UbbContainer";

import styles from "./BoardAnnouncementEditorDialog.module.scss";

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

export interface BoardAnnouncementEditorDialogProps {
  open: boolean;
  initialContent: string | null;
  onOpenChange: (open: boolean) => void;
  save: (content: string) => Promise<void>;
}

export function BoardAnnouncementEditorDialog({
  open,
  initialContent,
  onOpenChange,
  save,
}: BoardAnnouncementEditorDialogProps) {
  const [content, setContent] = React.useState(() => initialContent ?? "");
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const wasOpenRef = React.useRef(false);

  useIsomorphicLayoutEffect(() => {
    if (open && !wasOpenRef.current) {
      setContent(initialContent ?? "");
      setPending(false);
      setError(null);
    }

    wasOpenRef.current = open;
  }, [initialContent, open]);

  const submit = async () => {
    if (pending) return;

    setPending(true);
    setError(null);

    try {
      await save(content);
      onOpenChange(false);
    } catch {
      setError("保存失败，请稍后重试。");
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog
      title="编辑大字报"
      open={open}
      onConfirm={submit}
      onOpenChange={onOpenChange}
      confirmLoading={pending}
      cancelText="取 消"
      width="50rem"
    >
      支持UBB代码
      <TextArea
        rows={6}
        value={content}
        onChange={(event) => setContent(event.target.value)}
      />
      {error !== null && (
        <div className={styles.editError} role="alert">
          {error}
        </div>
      )}
      <UbbContainer
        code={content}
        options={{ ...new UbbCodeOptions(), allowToolbox: false }}
      />
    </Dialog>
  );
}
