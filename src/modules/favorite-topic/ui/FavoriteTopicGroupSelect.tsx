import * as React from "react";

import { Select } from "@foundation/ui/select";

import { getFavoriteAllTopic } from "../api/service";
import {
  defaultFavoriteTopicGroups,
  type FavoriteTopicGroup,
} from "../model/favorite-topic-group";

import styles from "./FavoriteTopicGroupSelect.module.scss";

type FavoriteTopicGroupSelectProps = {
  option: (groupId: number) => void;
  value?: number;
  favoriteTopicGroups?: readonly FavoriteTopicGroup[];
};

export function FavoriteTopicGroupSelect({
  option,
  value,
  favoriteTopicGroups,
}: FavoriteTopicGroupSelectProps) {
  const [favoriteTopicList, setFavoriteTopicList] = React.useState<
    FavoriteTopicGroup[]
  >(() => [...(favoriteTopicGroups ?? defaultFavoriteTopicGroups)]);

  React.useEffect(() => {
    if (favoriteTopicGroups) {
      setFavoriteTopicList([...favoriteTopicGroups]);
      return;
    }

    const updateFavoriteTopicList = async () => {
      try {
        const favoriteTopicListResponse = await getFavoriteAllTopic();
        console.log(favoriteTopicListResponse);
        setFavoriteTopicList(
          favoriteTopicListResponse.errorCode === 0
            ? favoriteTopicListResponse.data ?? defaultFavoriteTopicGroups
            : defaultFavoriteTopicGroups
        );
      } catch (error) {
        setFavoriteTopicList(defaultFavoriteTopicGroups);
        console.log(error);
      }
    };

    void updateFavoriteTopicList();
  }, [favoriteTopicGroups]);

  const options = favoriteTopicList.map((item) => ({
    value: item.id,
    label: `${item.name} (${item.count})`,
  }));

  return (
    <Select
      ariaLabel="收藏分组"
      className={styles.favoriteTopicGroupSelect}
      classNames={{
        trigger: styles.trigger,
        positioner: styles.positioner,
        popup: styles.popup,
        item: styles.item,
      }}
      value={value}
      defaultValue={value === undefined ? 0 : undefined}
      options={options}
      onValueChange={(value) => {
        if (value !== null) option(value);
      }}
    />
  );
}

export default FavoriteTopicGroupSelect;
