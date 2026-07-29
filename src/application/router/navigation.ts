import type { NavigateFunction, NavigateOptions, To } from "react-router";

let navigateImplementation: NavigateFunction | undefined;

export function bindAppNavigate(navigate: NavigateFunction): void {
  navigateImplementation = navigate;
}

export function navigate(to: To, options?: NavigateOptions): void {
  if (!navigateImplementation) {
    throw new Error("Application Router has not been initialized.");
  }

  void navigateImplementation(to, options);
}
