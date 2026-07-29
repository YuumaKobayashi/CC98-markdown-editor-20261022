import * as React from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  type NavigateFunction,
  type To,
} from "react-router";

export type match<Params = Record<string, string | undefined>> = {
  params: Params;
};

export type LegacyHistory = {
  readonly length: number;
  push(to: To, state?: unknown): void;
  replace(to: To, state?: unknown): void;
};

export type LegacyLocation = {
  pathname: string;
  search: string;
};

export type RouteComponentProps<
  Params = Record<string, string | undefined>
> = {
  history: LegacyHistory;
  location: LegacyLocation;
  match: match<Params extends null ? Record<string, never> : Params>;
};

function createLegacyHistory(navigate: NavigateFunction): LegacyHistory {
  return {
    get length() {
      return window.history.length;
    },
    push(to, state) {
      void navigate(to, { state });
    },
    replace(to, state) {
      void navigate(to, { replace: true, state });
    },
  };
}

/**
 * P14 bridge for class components that still consume Router 4 route props.
 *
 * This deliberately implements only the capabilities proven live in P13.5.
 * P15 removes the bridge while converting the remaining route-aware classes.
 */
export function withRouter(Component: React.ComponentType<any>): React.ComponentType<any> {
  function LegacyRoutePropsBridge(props: Record<string, unknown>) {
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const history = React.useMemo(() => createLegacyHistory(navigate), [navigate]);
    const legacyMatch = React.useMemo(() => ({ params }), [params]);
    const legacyLocation = React.useMemo(
      () => ({ pathname: location.pathname, search: location.search }),
      [location.pathname, location.search]
    );

    return (
      <Component
        {...props}
        history={history}
        location={legacyLocation}
        match={legacyMatch}
      />
    );
  }

  LegacyRoutePropsBridge.displayName = `withLegacyRouteProps(${Component.displayName || Component.name || "Component"})`;
  return LegacyRoutePropsBridge;
}
