import * as React from "react";
import { ComplexityMap } from "../components/Map/ComplexityMap";
import { DateMap } from "../components/Map/DateMap";

// import { Tabber } from "../components/Tabber";

const normalizedDistanceToToday = (date) => {
  const today = new Date();

  const distance = Math.abs(date - today);

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));

  const maxDays = 365 * 4;

  return (days / maxDays) * 100;
};

export function Alerts() {
  return (
    <div className="page">
      <h1>Tax Alerts</h1>

      <DateMap />
    </div>
  );
}
