import * as React from "react";
import { connect } from "react-redux";
import { Outlet } from "react-router";

import { Footer } from "@application/layouts/footer";
import { Header } from "@application/layouts/header";
import { NavigationErrorReset } from "@application/providers/navigation-error-reset";
import * as Status from "@legacy/Components/Status";
import type { errorKeys } from "@legacy/Reducers/Error";
import type { RootState } from "@application/store";

type Props = {
  isError: boolean;
  errorMessage: errorKeys;
};

function AppShellBeforeConnect({ isError, errorMessage }: Props) {
  const ErrorStatus = Status[errorMessage];

  return (
    <div className="main-container">
      <Header />
      <NavigationErrorReset />
      {!isError ? <Outlet /> : <ErrorStatus />}
      <Footer />
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
