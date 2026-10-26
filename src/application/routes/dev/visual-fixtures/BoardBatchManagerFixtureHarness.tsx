import * as React from "react";
import { createPortal } from "react-dom";

import {
  BoardBatchManager,
  type BoardBatchOperations,
} from "@application/routes/board/ui/BoardBatchManager";
import type { BoardInfo } from "@modules/board/model/types";
import type { TopicInfo } from "@modules/topic/model/dto";

import styles from "./BoardBatchManagerFixtureHarness.module.scss";

export type { BoardBatchOperations };

interface BoardBatchManagerFixtureHarnessProps {
  data: BoardInfo;
  list: TopicInfo[];
  visible: boolean;
  revision: number;
  onClose: () => void;
  onDropFirst: () => void;
  operations: BoardBatchOperations;
}

const managerSelector = "[data-board-batch-target-ids]";
const maxManagerSearchFrames = 30;

export function BoardBatchManagerFixtureHarness({
  data,
  list,
  visible,
  revision,
  onClose,
  onDropFirst,
  operations,
}: BoardBatchManagerFixtureHarnessProps) {
  const [managerHost, setManagerHost] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    setManagerHost(null);
    if (!visible) return undefined;

    let cancelled = false;
    let frameId = 0;
    let frameCount = 0;

    const findManagerHost = () => {
      if (cancelled) return;

      const nextHost = document.querySelector<HTMLElement>(managerSelector);
      if (nextHost) {
        setManagerHost(nextHost);
        return;
      }

      frameCount += 1;
      if (frameCount < maxManagerSearchFrames) {
        frameId = window.requestAnimationFrame(findManagerHost);
      }
    };

    frameId = window.requestAnimationFrame(findManagerHost);
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frameId);
    };
  }, [revision, visible]);

  return (
    <>
      <BoardBatchManager
        key={revision}
        data={data}
        list={list}
        visible={visible}
        onClose={onClose}
        operations={operations}
      />
      {managerHost
        ? createPortal(
            <button
              type="button"
              className={styles.control}
              data-fixture-board-batch-drop-first-in-dialog="true"
              aria-label="Drop first synthetic board topic"
              onClick={onDropFirst}
            >
              Drop first synthetic board topic
            </button>,
            managerHost,
          )
        : null}
    </>
  );
}
