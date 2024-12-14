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
  if (countryCode == "gb" || countryCode == "GB") {
    return `I'll provide a comprehensive markdown overview of UK tax codes:

# UK Tax Codes: A Comprehensive Guide

## What is a Tax Code?

A tax code is a combination of numbers and letters that tells employers how much tax-free income an employee should receive before being taxed. The most common tax code for the 2024/2025 tax year is **1257L**.

## Basic Components of a Tax Code

### Number Component
- The numbers in a tax code represent your tax-free Personal Allowance
- For 2024/2025, the standard Personal Allowance is £12,570
- This means you can earn £12,570 before paying income tax

### Letter Component
- Letters provide additional information about your tax situation

## Common Tax Code Letters

| Letter | Meaning |
|--------|---------|
| L | Standard tax-free Personal Allowance |
| M | Marriage Allowance recipient |
| N | Marriage Allowance transferred to spouse |
| T | Other calculations used to work out your Personal Allowance |
| 0T | No tax-free Personal Allowance |
| BR | All income is taxed at the basic rate |
| D0 | All income is taxed at the higher rate |
| D1 | All income is taxed at the additional rate |
| K | Indicates additional income that cannot be taxed through your wages |

## Tax Rates for 2024/2025

### Income Tax Bands (England and Northern Ireland)
- **Basic Rate**: 20% (£12,571 to £50,270)
- **Higher Rate**: 40% (£50,271 to £125,140)
- **Additional Rate**: 45% (Over £125,140)

### Scotland (Different Bands)
- **Starter Rate**: 19% (£12,571 to £14,732)
- **Basic Rate**: 20% (£14,733 to £26,423)
- **Intermediate Rate**: 21% (£26,424 to £43,662)
- **Higher Rate**: 41% (£43,663 to £75,000)
- **Top Rate**: 46% (Over £125,140)

## How to Check Your Tax Code

### Online Methods
1. Personal HMRC Online Account
2. Government Gateway
3. Payslip from employer
4. P60 end-of-year tax document

## Common Tax Code Scenarios

### Example 1: 1257L
- Standard tax-free allowance
- Can earn £12,570 before paying tax

### Example 2: 0T
- No tax-free allowance
- Might occur if:
  - You've changed jobs
  - Started a new job without P45
  - Earnings exceed £125,140

## Potential Tax Code Adjustments

Reasons your tax code might change:
- Receiving taxable benefits
- Claiming tax relief
- Previous year's over/underpayment
- Starting/stopping pension contributions
- Marriage Allowance transfer

## How to Correct Incorrect Tax Codes

1. Contact HMRC directly
2. Use online HMRC services
3. Speak with your employer's payroll department
4. Request a new tax code if circumstances change

## Important Considerations

- Tax codes are updated annually
- Always verify your current tax code
- Incorrect codes can lead to over or underpayment of tax

## Useful HMRC Contact Information

- **HMRC Income Tax Helpline**: 0300 200 3300
- **Online Services**: www.gov.uk/hmrc

**Disclaimer**: Tax regulations can change. Always consult official HMRC sources or a qualified tax professional for the most up-to-date and personalized advice.
`;
  }

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
