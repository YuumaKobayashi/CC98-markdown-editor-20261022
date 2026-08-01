import * as React from "react";
import { Outlet } from "react-router";

import { Footer } from "@application/layouts/footer";
import { Header } from "@application/layouts/header";
import { useApplicationError } from "@application/providers/application-error";
import { NavigationErrorReset } from "@application/providers/navigation-error-reset";
import * as Status from "@application/routes/status";

export function AppShell() {
  const error = useApplicationError();
  const ErrorStatus = error ? Status[error] : null;

  return (
    <div className="main-container">
      <Header />
      <NavigationErrorReset />
      {!ErrorStatus ? <Outlet /> : <ErrorStatus />}
      <Footer />
    </div>
  );
}
