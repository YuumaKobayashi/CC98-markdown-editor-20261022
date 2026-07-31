import * as React from "react";
import { useLocation } from "react-router";

import { clearApplicationError } from "@application/providers/application-error";

export function NavigationErrorReset() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    clearApplicationError();
  }, [pathname]);

  return null;
}
