import {
  bindNotificationResponseNavigation,
  type ReadAllNotificationSection,
} from "@modules/notification";
import { navigate } from "@application/router/navigation";

export function bindMessageNotificationNavigation(): void {
  bindNotificationResponseNavigation(() => {
    void navigate("/message/response");
  });
}

export function parseReadAllNotificationSection(
  pathname: string
): ReadAllNotificationSection | null {
  if (pathname === "/message/response") {
    return "reply";
  } else if (pathname === "/message/attme") {
    return "at";
  } else if (pathname === "/message/system") {
    return "system";
  } else if (pathname === "/message") {
    return "reply";
  } else {
    return null;
  }
}
