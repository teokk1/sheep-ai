function mockResponse(country, year) {
  return {
    country_code: "DE",
    markdown:
      "# VAT Rates and Exemptions\n\n## Standard VAT Rate\nThe standard VAT rate in the country is 20%.\n\n## Reduced VAT Rates\nYes, there are reduced VAT rates available:\n- 10% for basic food items, children's clothing, and pharmaceuticals.\n- 5% applicable to books, newspapers, and cultural services.\n\n## VAT Exemptions\nSeveral goods and services are exempt from VAT:\n- Financial services and insurance.\n- Educational services and healthcare.\n- Certain charitable activities and exports."
  };
}

export async function getTaxMarkdown(country, year) {
  return mockResponse(country, year)?.markdown;

  return fetch(
    `https://raw.githubusercontent.com/shesek/tax-rates-data/main/data/${countryToCode(
      country
    )}/${year}.md`
  );
}
