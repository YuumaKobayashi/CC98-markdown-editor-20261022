import * as React from "react";
import type { IBoard } from "@modules/board";
import { useNavigate, useParams } from "react-router";

import * as Utility from "@legacy/Utility";

import styles from "./BoardPage.module.scss";
import { getBoardInfo } from "../api/service";
import { BoardContent } from "./BoardContent";
import { BoardHeader } from "./BoardHeader";

export function BoardPage() {
  const navigate = useNavigate();
  const { id, page } = useParams<{ id: string; page: string }>();
  const [data, setData] = React.useState<IBoard | null>(null);

  React.useEffect(() => {
    const loadBoard = async () => {
      await Utility.getTagInfo();
      const nextData = await getBoardInfo(id);
      if (nextData === "not found") {
        navigate("/error/404");
      } else if (nextData === "unauthorized") {
        navigate("/error/401");
      } else if (nextData === "server error") {
        navigate("/error/500");
      } else {
        setData(nextData);
      }
    };

    void loadBoard();
  }, []);

  return data ? (
    <div className={styles["board-body"]}>
      <BoardHeader data={data} page={page || "1"} />
      <BoardContent data={data} page={page || "1"} />
    </div>
  ) : null;
}
