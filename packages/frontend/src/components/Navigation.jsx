import * as React from "react";
import { useEffect, useState } from "react";

import "./navigation.css";

import logo from "../../res/logo.svg";

import analytics from "../../res/IDV-analytics-blue.svg";
import transactions from "../../res/IDV-transactions.svg";

function linkClass(link, activeLink) {
  if (link === activeLink) {
    return `navigation-item active`;
  }
  return `navigation-item`;
}

export function Navigation() {
  const [activeLink, setActiveLink] = useState("dashboard");

  useEffect(() => {
    const path = window.location.pathname;

    if (path === "/") {
      setActiveLink("dashboard");
    } else if (path === "/expansion") {
      setActiveLink("expansion");
    } else if (path === "/health") {
      setActiveLink("health");
    }
  }, []);

  return (
    <nav className="navigation">
      <div className="navigation-logo">
        <a href="/">
          <img src={logo} alt="logo" />
        </a>
      </div>
      <div className="navigation-items">
        <div className={linkClass(activeLink, "expansion")}>
          <a href="/guide">
            <img src={analytics} />
            Tax guide
          </a>
        </div>
        <div className={linkClass(activeLink, "health")}>
          <a href="/alerts">
            <img src={transactions} />
            Tax alerts
          </a>
        </div>
      </div>
    </nav>
  );
}
