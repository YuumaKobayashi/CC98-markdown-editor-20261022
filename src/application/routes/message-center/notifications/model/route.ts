import { bindNotificationResponseNavigation } from "@modules/notification/lib/notification-navigation";
import { type ReadAllNotificationSection } from "@modules/notification/api/service";
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
