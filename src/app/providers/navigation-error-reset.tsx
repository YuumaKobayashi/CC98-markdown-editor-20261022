import * as React from "react";
import { useLocation } from "react-router";

import { Actions, useAppDispatch } from "@app/store";

export function NavigationErrorReset() {
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();

  React.useEffect(() => {
    dispatch(Actions.solveError());
  }, [dispatch, pathname]);

  return null;
}
