import * as React from "react";
import { getCountryInfo } from "../api";

import ReactMarkdown from "react-markdown";

export function Country({}) {
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

      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  );
}
