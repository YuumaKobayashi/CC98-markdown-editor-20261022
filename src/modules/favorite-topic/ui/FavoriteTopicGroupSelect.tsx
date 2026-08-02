import * as React from "react";
import { Select } from "antd";

import { getFavoriteAllTopic } from "../api/service";
import {
  defaultFavoriteTopicGroups,
  type FavoriteTopicGroup,
} from "../model/favorite-topic-group";

const { Option } = Select;

type FavoriteTopicGroupSelectProps = {
  option: (groupId: number) => void;
};

export function FavoriteTopicGroupSelect({
  option,
}: FavoriteTopicGroupSelectProps) {
  const [favoriteTopicList, setFavoriteTopicList] = React.useState<
    FavoriteTopicGroup[]
  >(defaultFavoriteTopicGroups);

  React.useEffect(() => {
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
  }, []);

  const options = favoriteTopicList.map((item) => (
    <Option key={item.id} value={item.id}>
      {item.name + " (" + item.count + ")"}
    </Option>
  ));

  return (
    <Select
      style={{
        width: 180,
        marginRight: 40,
      }}
      defaultValue={0}
      onChange={(value) => option(value)}
    >
      {options}
    </Select>
  );
}

export default FavoriteTopicGroupSelect;
