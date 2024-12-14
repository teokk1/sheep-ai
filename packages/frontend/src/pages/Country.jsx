import * as React from "react";
import { getCountryInfo } from "../api";

import ReactMarkdown from "react-markdown";

import remarkGfm from "remark-gfm";

import "./markdown.css";

export function Country() {
  const [markdown, setMarkdown] = React.useState("");

  React.useEffect(() => {
    async function fetchData() {
      const countryCode = window.location.pathname.split("/")[2];

      console.log(countryCode);

      const response = await getCountryInfo(countryCode);

      console.log(response);
      const data = await response.json();

      console.log(data);
      setMarkdown(data.markdown);
    }

    fetchData();
  }, []);

  return (
    <div className="page">
      <h1>Country Tax Information</h1>
      <div className="markdown-body">
        {markdown ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
        ) : (
          <p>Navigating all the complex tax rules for you...</p>
        )}
      </div>
    </div>
  );
}
