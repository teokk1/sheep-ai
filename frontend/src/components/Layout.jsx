import * as React from "react";
import "./layout.css";
import { Navigation } from "./Navigation";
import { Onboarding } from "./Onboarding";

export function Layout({ children }) {
  return (
    <div className="layout">
      <Navigation />
      <div className="layout-content">{children}</div>
    </div>
  );
}
