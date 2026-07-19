import * as React from "react";
import { connect } from "react-redux";
import { Outlet, useLocation } from "react-router";

import { Header } from "@legacy/Components/Header";
import { Footer } from "@legacy/Components/Footer";
import ErrorControl from "@legacy/Components/ErrorControl";
import * as Status from "@legacy/Components/Status";
import type { errorKeys } from "@legacy/Reducers/Error";
import type { RootState } from "@app/store";

type Props = {
  isError: boolean;
  errorMessage: errorKeys;
};

function PersistentHeader() {
  const { pathname } = useLocation();
  return <Header pathname={pathname} />;
}

function AppShellBeforeConnect({ isError, errorMessage }: Props) {
  const ErrorStatus = Status[errorMessage];

  return (
    <div className="main-container">
      <PersistentHeader />
      <ErrorControl />
      {!isError ? <Outlet /> : <ErrorStatus />}
      <Footer />
      {/* <NotificationController />*/}
    </div>
  );
}

function mapState(state: RootState): Props {
  return {
    isError: state.error.isError,
    errorMessage: state.error.errorMessage,
  };
}

export const AppShell = connect(mapState)(AppShellBeforeConnect);
