import * as React from "react";

export type ApplicationErrorKey =
  | "LogOut"
  | "TopicDeleted"
  | "Disconnected"
  | "UnauthorizedBoard"
  | "UnauthorizedTopic"
  | "UnauthorizedOperation"
  | "NotFoundBoard"
  | "NotFoundTopic"
  | "CannotPost"
  | "NotFoundUser"
  | "ServerError"
  | "ContentNeeded"
  | "OperationForbidden"
  | "PageNotFound"
  | "TooFrequentSearch";

type ApplicationErrorCommand =
  | { type: "report"; error: ApplicationErrorKey }
  | { type: "clear" };

type ApplicationErrorCommandListener = (
  command: ApplicationErrorCommand
) => void;

const ApplicationErrorContext =
  React.createContext<ApplicationErrorKey | null | undefined>(undefined);

const commandListeners = new Set<ApplicationErrorCommandListener>();
let pendingCommand: ApplicationErrorCommand | null = null;

function publishApplicationErrorCommand(
  command: ApplicationErrorCommand
): void {
  if (commandListeners.size === 0) {
    pendingCommand = command;
    return;
  }
  commandListeners.forEach((listener) => listener(command));
}

export function reportApplicationError(error: ApplicationErrorKey): void {
  publishApplicationErrorCommand({ type: "report", error });
}

export function clearApplicationError(): void {
  publishApplicationErrorCommand({ type: "clear" });
}

export function ApplicationErrorProvider({
  children,
}: React.PropsWithChildren<{}>) {
  const [error, setError] = React.useState<ApplicationErrorKey | null>(null);

  React.useLayoutEffect(() => {
    const handleCommand: ApplicationErrorCommandListener = (command) => {
      setError(command.type === "report" ? command.error : null);
    };
    commandListeners.add(handleCommand);
    if (pendingCommand) {
      handleCommand(pendingCommand);
      pendingCommand = null;
    }
    return () => {
      commandListeners.delete(handleCommand);
    };
  }, []);

  return (
    <ApplicationErrorContext.Provider value={error}>
      {children}
    </ApplicationErrorContext.Provider>
  );
}

export function useApplicationError(): ApplicationErrorKey | null {
  const error = React.useContext(ApplicationErrorContext);
  if (error === undefined) {
    throw new Error(
      "useApplicationError must be used within ApplicationErrorProvider"
    );
  }
  return error;
}
