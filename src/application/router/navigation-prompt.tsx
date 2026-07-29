import * as React from "react";
import {
  useBeforeUnload,
  useBlocker,
  type Location,
} from "react-router";

type PromptResult = string | boolean;

type Props = {
  message: string | ((location: Location) => PromptResult);
  when?: boolean;
};

function resolveMessage(message: Props["message"], location: Location): PromptResult {
  return typeof message === "function" ? message(location) : message;
}

/**
 * Preserve the old Prompt contract for the frozen class editor surface.
 * `true` allows navigation, `false` silently keeps the user on the page, and a
 * string asks the user for confirmation before continuing.
 */
export function NavigationPrompt({ message, when = true }: Props): null {
  // First put the Router navigation into a blocked state; the effect below
  // decides whether to continue or cancel that pending navigation.
  const blocker = useBlocker(({ nextLocation }) => {
    if (!when) {
      return false;
    }

    return resolveMessage(message, nextLocation) !== true;
  });

  React.useEffect(() => {
    if (blocker.state !== "blocked") {
      return;
    }

    const result = resolveMessage(message, blocker.location);
    if (result === false) {
      // Cancel only the pending navigation. This does not reset editor state.
      blocker.reset();
      return;
    }

    if (result === true || window.confirm(result)) {
      blocker.proceed();
    } else {
      blocker.reset();
    }
  }, [blocker, message]);

  useBeforeUnload(
    React.useCallback(
      (event) => {
        if (!when) {
          return;
        }

        // Refreshing or closing the tab cannot use the custom Router dialog;
        // ask the browser to show its native unsaved-changes confirmation.
        event.preventDefault();
        event.returnValue = "";
      },
      [when]
    )
  );

  return null;
}
