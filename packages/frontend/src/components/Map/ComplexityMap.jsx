import * as React from "react";

import { useState } from "react";

import WorldMap from "react-svg-worldmap";
import "./map.css";

const dataPerCode = [
  { country: "ar", value: 309 },
  { country: "am", value: 376 },
  { country: "au", value: 368 },
  { country: "at", value: 330 },
  { country: "be", value: 445 },
  { country: "br", value: 424 },
  { country: "bg", value: 396 },
  { country: "ca", value: 460 },
  { country: "cl", value: 422 },
  { country: "cn", value: 404 },
  { country: "co", value: 408 },
  { country: "cr", value: 412 },
  { country: "hr", value: 396 },
  { country: "cy", value: 361 },
  { country: "cz", value: 434 },
  { country: "dk", value: 359 },
  { country: "ee", value: 227 },
  { country: "fi", value: 300 },
  { country: "fr", value: 385 },
  { country: "de", value: 385 },
  { country: "gr", value: 402 },
  { country: "hk", value: 269 },
  { country: "hu", value: 356 },
  { country: "in", value: 420 },
  { country: "id", value: 442 },
  { country: "ie", value: 330 },
  { country: "il", value: 479 },
  { country: "it", value: 452 },
  { country: "jp", value: 378 },
  { country: "kz", value: 355 },
  { country: "ke", value: 366 },
  { country: "kr", value: 319 },
  { country: "lv", value: 326 },
  { country: "lt", value: 287 },
  { country: "lu", value: 358 },
  { country: "my", value: 394 },
  { country: "mt", value: 330 },
  { country: "mx", value: 392 },
  { country: "nl", value: 353 },
  { country: "nz", value: 320 },
  { country: "ng", value: 394 },
  { country: "no", value: 299 },
  { country: "pk", value: 444 },
  { country: "pe", value: 508 },
  { country: "ph", value: 421 },
  { country: "pl", value: 497 },
  { country: "pt", value: 414 },
  { country: "pr", value: 396 },
  { country: "ro", value: 442 },
  { country: "sg", value: 263 },
  { country: "sk", value: 361 },
  { country: "si", value: 324 },
  { country: "za", value: 334 },
  { country: "es", value: 381 },
  { country: "se", value: 292 },
  { country: "ch", value: 233 },
  { country: "tw", value: 385 },
  { country: "th", value: 414 },
  { country: "tr", value: 423 },
  { country: "ua", value: 326 },
  { country: "gb", value: 392 },
  { country: "us", value: 397 },
  { country: "uy", value: 206 },
  { country: "vn", value: 291 },
  { country: "by", value: 284 },
  { country: "kh", value: 422 },
  { country: "ec", value: 415 },
  { country: "gt", value: 342 },
  { country: "mu", value: 179 },
  { country: "ru", value: 364 },
  { country: "ug", value: 365 },
  { country: "af", value: 403 },
  { country: "al", value: 502 },
  { country: "az", value: 374 },
  { country: "bd", value: 349 },
  { country: "bb", value: 356 },
  { country: "bw", value: 335 },
  { country: "do", value: 327 },
  { country: "eg", value: 509 },
  { country: "sv", value: 326 },
  { country: "et", value: 401 },
  { country: "gh", value: 475 },
  { country: "jm", value: 329 },
  { country: "je", value: 192 },
  { country: "xk", value: 406 },
  { country: "la", value: 372 },
  { country: "lb", value: 421 },
  { country: "li", value: 260 },
  { country: "mk", value: 344 },
  { country: "mg", value: 369 },
  { country: "mn", value: 450 },
  { country: "ni", value: 205 },
  { country: "om", value: 296 },
  { country: "qa", value: 328 },
  { country: "sa", value: 438 },
  { country: "rs", value: 401 },
  { country: "lk", value: 405 },
  { country: "tz", value: 471 },
  { country: "tn", value: 302 },
  { country: "ve", value: 354 },
  { country: "ye", value: 228 },
  { country: "zm", value: 486 }
];

const easeOfDoingBusiness = [
  { country: "bd", value: 56.36 },
  { country: "bb", value: 52.34 },
  { country: "ba", value: 46.92 },
  { country: "bw", value: 50.88 },
  { country: "bg", value: 59.96 },
  { country: "kh", value: 58.6 },
  { country: "cf", value: 23.28 },
  { country: "td", value: 43.39 },
  { country: "co", value: 57.71 },
  { country: "cr", value: 42.22 },
  { country: "ci", value: 53.39 },
  { country: "hr", value: 39.86 },
  { country: "sv", value: 43.03 },
  { country: "ee", value: 70.72 },
  { country: "gm", value: 39.01 },
  { country: "ge", value: 68.51 },
  { country: "gh", value: 56.78 },
  { country: "gr", value: 56.02 },
  { country: "hk", value: 70.56 },
  { country: "hu", value: 59.35 },
  { country: "id", value: 59.91 },
  { country: "iq", value: 29.4 },
  { country: "kg", value: 46.59 },
  { country: "ls", value: 60.19 },
  { country: "mg", value: 51.66 },
  { country: "mu", value: 69.22 },
  { country: "mx", value: 65.56 },
  { country: "me", value: 44.04 },
  { country: "ma", value: 47.69 },
  { country: "np", value: 57.99 },
  { country: "nz", value: 71.74 },
  { country: "mk", value: 46.84 },
  { country: "pk", value: 57.48 },
  { country: "py", value: 55.27 },
  { country: "pe", value: 49.97 },
  { country: "ph", value: 56.66 },
  { country: "pt", value: 52.86 },
  { country: "ro", value: 50.61 },
  { country: "rw", value: 66.31 },
  { country: "ws", value: 56.94 },
  { country: "sc", value: 58.35 },
  { country: "sl", value: 41.45 },
  { country: "sg", value: 70.39 },
  { country: "sk", value: 49.85 },
  { country: "tz", value: 61.57 },
  { country: "tl", value: 48.89 },
  { country: "tg", value: 58.68 },
  { country: "vu", value: 50.21 },
  { country: "vn", value: 56.46 },
  { country: "ps", value: 33.09 }
];

const minValue = Math.min(...Object.values(dataPerCode).map((d) => d.value));
const maxValue = Math.max(...Object.values(dataPerCode).map((d) => d.value));

const justColor = "#3c8354";

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

function getComplexityIndex(countryCode) {
  return (
    dataPerCode.find((d) => d.country === countryCode?.toLowerCase())?.value ||
    0
  );
}

function colorValue(value) {
  // 0 is green, 100 is red
  const colorRange = 100;
  const greenRange = colorRange / 2;
  const redRange = colorRange - greenRange;
  const normalizedValue = value / 100;
  const green = Math.round(greenRange * normalizedValue);
  const red = Math.round(redRange * normalizedValue);
  return `rgb(${green}, ${green}, ${red})`;
}

export function ComplexityMap() {
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
            title="Tax complexity index"
            backgroundColor="transparent"
            value-suffix="people"
            size="xl"
            data={dataPerCode}
            onClickFunction={(e) => setSelectedCountry(e)}
          />
        </div>
        <div className="info-panel">
          {selectedCountry && (
            <>
              <h2>{selectedCountry?.countryName}</h2>
              <p>
                Tax complexity index:{" "}
                {(
                  (getComplexityIndex(selectedCountry?.countryCode) /
                    maxValue) *
                  100
                ).toFixed(2)}
              </p>
              <p>
                Ease of doing business:{" "}
                {easeOfDoingBusiness.find(
                  (d) =>
                    d.country === selectedCountry?.countryCode?.toLowerCase()
                )?.value || 0}
              </p>

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
