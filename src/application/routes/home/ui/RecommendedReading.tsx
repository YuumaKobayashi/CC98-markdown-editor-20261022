import * as React from "react";
import { useEffect, useState } from "react";

import styles from "../Home.module.scss";
import readingStyles from "./RecommendedReading.module.scss";
import { MainPageColumn } from "../model/types";

/**
 * 推荐阅读组件
 **/
export function RecommendedReading({ data }: { data: MainPageColumn[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(data.length ? Math.floor(Math.random() * data.length) : 0);
  }, [data]);

  const handleMouseEnter = (nextIndex: number) => {
    setIndex(nextIndex);
  };

  const selectedIndex = index < data.length ? index : 0;
  const selected = data[selectedIndex];

  return (
    <div className={readingStyles.recommendedReading}>
      <div className={styles.mainPageTitle2}>
        <div className={styles.mainPageTitleRow}>
          <i className="fa fa-volume-up"></i>
          <div className={styles.mainPageTitleText}>推荐阅读</div>
        </div>
      </div>
      <div className={readingStyles.recommendedReadingContent}>
        <div className={readingStyles.recommendedReadingImage}>
          <img src={selected?.imageUrl ?? ""} />
        </div>
        <div className="column" style={{ flexGrow: 1 }}>
          <div className={readingStyles.recommendedReadingTitle}>
            <a href={selected?.url ?? ""} target="_blank">
              {selected?.title ?? ""}
            </a>
          </div>
          <div className={readingStyles.recommendedReadingAbstract}>
            {selected?.content ?? ""}
          </div>
          <div className={readingStyles.recommendedReadingButtons}>
            {data.map((_, buttonIndex) => (
              <div
                key={buttonIndex}
                className={
                  buttonIndex === selectedIndex
                    ? readingStyles.recommendedReadingButtonSelected
                    : readingStyles.recommendedReadingButton
                }
                onMouseEnter={() => handleMouseEnter(buttonIndex)}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
