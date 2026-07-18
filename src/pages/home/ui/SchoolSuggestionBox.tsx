import * as React from "react";

export function SchoolSuggestionBox(): React.ReactElement {
  return (
    <div
      style={{
        position: "relative",
        width: "18.75rem",
        height: "6.25rem",
        marginBottom: "1rem",
      }}
    >
      <div>
        <a
          href="https://zju.aliwork.com/s/mailto?corpid=ding2c6bcab1e41b0242&ddtab=true"
          target="_blank"
        >
          <img
            src="/static/images/xyyjx.jpg"
            style={{ width: "18.75rem", height: "6.25rem" }}
          />
        </a>
      </div>
    </div>
  );
}
