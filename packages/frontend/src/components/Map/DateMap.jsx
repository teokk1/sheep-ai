import * as React from "react";

import { useState } from "react";

import WorldMap from "react-svg-worldmap";
import "./map.css";

import lookup from "country-code-lookup";

import remarkGfm from "remark-gfm";

import ReactMarkdown from "react-markdown";

import { getCountryUpdates, getChatResponse } from "../../api";

export const upcomingTaxChangeDates = [
  { name: "Germany", country: "de", date: Date.parse("2025-01-01") },
  { name: "United Kingdom", country: "gb", date: Date.parse("2026-06-01") },
  { name: "Croatia", country: "hr", date: Date.parse("2030-04-04") },
  { name: "Austria", country: "at", date: Date.parse("2028-01-01") }
];

const justColor = "#F43F5E";

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

  const maxDays = 365 * 2;
  return 100 - (days / maxDays) * 100;
}

export function DateMap() {
  const [selectedCountry, setSelectedCountry] = useState("");

  const [countryUpdates, setCountryUpdates] = useState([]);

  React.useEffect(() => {
    async function fetchData() {
      if (!selectedCountry) {
        return;
      }

      const response = await getCountryUpdates(selectedCountry?.countryCode);

      console.log(response);
      const data = await response.json();

      console.log(data);
      setCountryUpdates(data);
    }

    fetchData();
  }, [selectedCountry]);

  const [loading, setLoading] = useState(false);

  const [chatResponse, setChatResponse] = useState("");

  const sendChatQuery = async (query) => {
    console.log("Sending query");
    setLoading(true);

    const response = await getChatResponse(selectedCountry?.countryCode, query);

    console.log(response);
    const data = await response.json();

    console.log(data);
    setChatResponse(data?.markdown);

    setLoading(false);
  };

  return (
    <>
      <div className="world-map-wrapper">
        <div className="world-map">
          <WorldMap
            color={justColor}
            title="Upcoming tax urgency index"
            backgroundColor="transparent"
            valuePrefix="🚨"
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
              {countryUpdates?.length ? (
                <div className="updates">
                  {countryUpdates?.map((update) => (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {update?.markdown}
                    </ReactMarkdown>
                  ))}
                </div>
              ) : (
                <div className="spinner" />
              )}
              <a
                className="button"
                href={`/country/${selectedCountry?.countryCode}`}
              >
                Details
              </a>
            </>
          )}
        </div>
      </div>

      <div className="table-wrapper">
        <div className="grid">
          <div className="grid-header">
            <div className="grid-header-title">Country</div>
            <div className="grid-header-subtitle">
              Expected Date of proposed changes
            </div>
          </div>
          <div className="grid-body">
            {upcomingTaxChangeDates.map((d) => (
              <div className="grid-item" key={d.country}>
                <div className="grid-item-title">{d.name}</div>
                <div className="grid-item-subtitle">
                  {new Date(d.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="chat-wrapper">
        <h2>
          Ask anything about the tax rules in {selectedCountry?.countryName}
        </h2>

        <form onSubmit={(e) => e.preventDefault()}>
          <textarea placeholder="Chat query" id="query" />

          <button
            className="button"
            onClick={() =>
              sendChatQuery(document.querySelector("#query").value)
            }
            style={{ width: "fit-content" }}
          >
            Ask AI
          </button>
        </form>

        <div className="divider" />

        <div className="chat-response" style={{ paddingBottom: 100 }}>
          <div className="chat-response-body">
            {loading ? (
              <div className="spinner" />
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {chatResponse?.markdown}
              </ReactMarkdown>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
