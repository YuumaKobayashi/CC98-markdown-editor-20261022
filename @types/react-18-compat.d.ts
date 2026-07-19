import type { FunctionComponent, ReactNode } from "react";

declare module "react" {
  /** React 18 compatibility alias for legacy presentation components. */
  type SFC<P = {}> = FunctionComponent<P>;

}

declare module "react-router-dom" {
  interface BrowserRouterProps {
    children?: ReactNode;
  }
}

declare module "react-router-redux" {
  interface ConnectedRouterProps<State> {
    children?: ReactNode;
  }
}
