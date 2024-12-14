import * as React from "react";

import { useState } from "react";

import WorldMap from "react-svg-worldmap";
import "./map.css";

export const upcomingTaxChangeDates = [
  { country: "de", date: Date.parse("2025-01-01") },
  { country: "gb", date: Date.parse("2026-06-01") },
  { country: "hr", date: Date.parse("2030-04-04") },
  { country: "at", date: Date.parse("2028-01-01") }
];

const minValue = new Date();
const maxValue = Math.max(...Object.values(upcomingTaxChangeDates));

const justColor = "#833c54";

function hexToRGB(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
      ]
    : null;
}

function makeTransparent(hex, opacity) {
  return `rgba(${hexToRGB(hex)}, ${opacity})`;
}

function distanceToToday(date) {
  const today = new Date();

  const distance = Math.abs(date - today);

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));

  const maxDays = 365 * 4;
  return (days / maxDays) * 100;
}

export function DateMap() {
  const [selectedCountry, setSelectedCountry] = useState("");

  React.useEffect(() => {
    console.log(selectedCountry);
  }, [selectedCountry]);

  return (
    <>
      <div className="world-map-wrapper">
        <div className="world-map">
          <WorldMap
            color={justColor}
            title="Upcoming tax urgency index"
            backgroundColor="transparent"
            value-suffix="people"
            size="xl"
            data={upcomingTaxChangeDates.map((d) => ({
              country: d.country,
              value: distanceToToday(d.date)
            }))}
            onClickFunction={(e) => setSelectedCountry(e)}
          />
        </div>
        <div className="info-panel">
          {selectedCountry && (
            <>
              <h2>{selectedCountry?.countryName}</h2>
              <p>Expected Date of proposed changes: </p>
              <p>
                {new Date(
                  upcomingTaxChangeDates.find(
                    (d) =>
                      d.country === selectedCountry?.countryCode?.toLowerCase()
                  )?.date
                ).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </p>
              <p>Expected changes: </p>
              <p>The UK parliament is discussing the following changes:</p>
              <ul>
                <li>Reducing the tax burden on the self-employed</li>
                <li>Reducing the tax burden on small businesses</li>
                <li>Reducing the tax burden on businesses with employees</li>
                <li>
                  Increasing the tax burden on businesses with fewer than 10
                  employees
                </li>
              </ul>
              <button className="button" onClick={() => {}}>
                Details
              </button>
            </>
          )}
        </div>
      </div>

      <div
        className="world-map-legend"
        style={{
          background: `linear-gradient(to right, ${makeTransparent(
            justColor,
            minValue / maxValue
          )}, ${justColor})`
        }}
      >
        <div className="legend-labels">
          <span className="legend-label">{0}</span>
          <span className="legend-label">{100}</span>
        </div>
      </div>
    </>
  );
}
