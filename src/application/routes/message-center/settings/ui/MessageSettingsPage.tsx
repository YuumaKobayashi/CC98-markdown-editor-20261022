import * as React from "react";

import { MessageSetting } from "@modules/notification";
import centerStyles from "../../MessageCenter.module.scss";
import styles from "../../MessageSettings.module.scss";

export function MessageSettingsPage(): React.ReactElement {
  return (
    <MessageSetting
      key={`${centerStyles["message-right"]} ${styles.messageSettingsModuleAnchor}`}
    />
  );
}
