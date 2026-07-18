import {
  createListenerMiddleware,
  TypedStartListening,
} from "@reduxjs/toolkit";

import type { RootState } from "./legacy-types";
import type { AppDispatch } from "./store";

/**
 * P09 installs the application listener infrastructure without registering
 * business listeners. Domain phases add listeners only with their owner.
 */
export const listenerMiddleware = createListenerMiddleware();

export type AppStartListening = TypedStartListening<RootState, AppDispatch>;

export const startAppListening =
  listenerMiddleware.startListening as AppStartListening;
