import * as React from "react";

import styles from "./SchoolSuggestionBox.module.scss";

export function SchoolSuggestionBox(): React.ReactElement {
  return (
    <div className={styles.suggestionBox}>
      <div>
        <a
          href="https://zju.aliwork.com/s/mailto?corpid=ding2c6bcab1e41b0242&ddtab=true"
          target="_blank"
        >
          <img
            className={styles.image}
            src="/static/images/xyyjx.jpg"
          />
        </a>
      </div>
    </div>
  );
}
