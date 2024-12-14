function mockResponse(country, year) {
  return {
    country_code: "DE",
    markdown:
      "# VAT Rates and Exemptions\n\n## Standard VAT Rate\nThe standard VAT rate in the country is 20%.\n\n## Reduced VAT Rates\nYes, there are reduced VAT rates available:\n- 10% for basic food items, children's clothing, and pharmaceuticals.\n- 5% applicable to books, newspapers, and cultural services.\n\n## VAT Exemptions\nSeveral goods and services are exempt from VAT:\n- Financial services and insurance.\n- Educational services and healthcare.\n- Certain charitable activities and exports."
  };
}

export async function getTaxMarkdown(country, year) {
  return mockResponse(country, year)?.markdown;
}

// http://localhost:8080/countries
// body should look like this: {
//   "country_code": "DE"
// }
// Post

function remapCode(code) {
  if (code == "gb" || code == "GB") {
    return "UK";
  }

  return code;
}

export async function getCountryUpdates(countryCode) {
  return fetch("http://localhost:8080/updates", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      country_code: remapCode(countryCode)
    })
  });
}

export async function getCountryInfo(countryCode) {
  return fetch("http://localhost:8080/countries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      country_code: remapCode(countryCode)
    })
  });
}

export async function getChatResponse(country_code, query) {
  return fetch("http://localhost:8080/assistants/message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      country_code: remapCode(country_code),
      message: query
    })
  });
}
