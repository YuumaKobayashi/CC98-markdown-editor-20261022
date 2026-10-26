import * as React from "react";

import type { HomeSectionLink } from "../model/types";
import styles from "./HomeSectionHeader.module.scss";

interface HomeSectionHeaderProps {
  tone: "main" | "sub";
  title: string;
  links?: HomeSectionLink[];
}

/** 首页栏目共同的标题和附加链接行。 */
export function HomeSectionHeader({
  tone,
  title,
  links,
}: HomeSectionHeaderProps) {
  return (
    <div
      className={
        tone === "main" ? styles.mainPageTitle1 : styles.mainPageTitle2
      }
    >
      <div className={styles.mainPageTitleRow}>
        <i className="fa fa-volume-up"></i>
        <div className={styles.mainPageTitleText}>{title}</div>
      </div>
      {links === undefined ? null : (
        <div className={styles.mainPageTitleRow}>
          {links.map((item, index) => (
            <div key={index} className={styles.mainPageTitleText}>
              <a href={item.url} target="_blank">
                {item.name}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
