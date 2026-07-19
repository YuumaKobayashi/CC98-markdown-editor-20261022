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

/** Preserve the old Prompt contract for the frozen class editor surface. */
export function NavigationPrompt({ message, when = true }: Props): null {
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

        event.preventDefault();
        event.returnValue = "";
      },
      [when]
    )
  );

  return null;
}
