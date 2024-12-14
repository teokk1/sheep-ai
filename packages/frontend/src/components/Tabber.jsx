import * as React from "react";

import "./tabber.css";

export function Tabber({ titles, children }) {
  const [activeTab, setActiveTab] = React.useState(0);

  return (
    <div className="tabber">
      <div className="tabber-tabs">
        {titles.map((title, index) => (
          <button
            key={index}
            className={`tabber-tab ${
              index === activeTab ? "tabber-tab-active" : ""
            }`}
            onClick={() => setActiveTab(index)}
          >
            {title}
          </button>
        ))}
      </div>
      <div className="tabber-content">{children[activeTab]}</div>
    </div>
  );
}
