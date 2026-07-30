let navigateToNotificationResponseImplementation: (() => void) | undefined;

export function bindNotificationResponseNavigation(
  navigate: () => void
): void {
  navigateToNotificationResponseImplementation = navigate;
}

export function navigateToNotificationResponse(): void {
  if (!navigateToNotificationResponseImplementation) {
    throw new Error("Application Router has not been initialized.");
  }

  navigateToNotificationResponseImplementation();
}
