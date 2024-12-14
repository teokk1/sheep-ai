import RetrievalService from "@/services/retrieval-service";
import OpenAIService from "@/services/openai-service";

const AGGREGATION_SYSTEM_PROMPT = `
  You are a helpful assistant that summarizes information from a list of answers.
`;

const AGGREGATION_USER_PROMPT = `
  Summarize the following information in markdown format:
`;

const AGGREGATION_MODEL = "gpt-4o";

const MARKDOWN_FORMAT = `
  ### Standard VAT
  Have a simple bolded text "Standard VAT rate" and a percentage value that is applied

  Example:
  **Standard VAT rate:** 20%

  ### Reduced VAT rates
  A markdown table that has rows for each reduced VAT rate. In column 1 add a very short description of the case where reduced rate applies and in the second column show the actual rates as respective percentages. If there are no reduced rates, show the text "No reduced rates".

  Example:
  | Description | Rate |
  | --- | --- |
  | Food | 10% |
  | Books | 5% |

  ### VAT examptions
  A markdown table that has rows for each examption VAT rate. In column 1 add a very short description of the case where examption applies and in the second column show the actual rates as respective percentages. If there are no examptions, show the text "No tax examptions".
  
  ### VAT registration thresholds
  A markdown table that has a row for each specific threshold that exists. In column 1, name each case and in column 2 put the threshold in a local currency and explicitly name the currency. If there are no specific thresholds for some of the categories, skip it.

  Example:
  | Case | Threshold |
  | --- | --- |
  | Food | 1000 EUR |
  | Books | 1000 EUR |

  ### e-invoicing
  Show the text "Is e-Invoice Mandatory" and show bolded YES or NO based on the data you have. Below, put the bolded text "Mandatory fields on e-invoice" as a bullet point list show all the mandatory fields for the e-invoice.

  Example:
  **Is e-Invoice Mandatory:** YES
  **Mandatory fields on e-invoice:**
  - Invoice number
  - Invoice date
  - Invoice amount

  ### Invoice content
  Show the bullet list of mandatory invoice fields

  Example:
  - Invoice number
  - Invoice date
  - Invoice amount

  ### Tax Authority
  Create links that are represented with the website titles that are clickable and lead to those websites.
  They should lead to the official website of the tax authority of the country.

  Example:
  [Bundeszentralamt für Steuern](https://www.bzst.de)
`;

const MARKDOWN_SYSTEM_PROMPT = `
  You are a markdown formatter that formats a list of answers into a markdown article.
  Format the answers into a raw markdown string, dont wrap it in a codeblock or anything else.

  Use this markdown format:
  ${MARKDOWN_FORMAT}
`;

const MARKDOWN_USER_PROMPT = `
  Summarize the following information in markdown format:
`;

const MARKDOWN_MODEL = "gpt-4o-mini";

export const AggregationService = {
  aggregate: async (countryCode: string) => {
    const answers = await RetrievalService.getInfoForCountry(countryCode);

    if (answers.length === 0) {
      return "No information found";
    }

    const aggregation = await OpenAIService.getCompletion(
      AGGREGATION_SYSTEM_PROMPT,
      AGGREGATION_USER_PROMPT +
        answers
          .map((answer) =>
            typeof answer === "string" ? answer : JSON.stringify(answer)
          )
          .join("\n"),
      AGGREGATION_MODEL
    );

    if (!aggregation?.choices[0]?.message?.content) {
      console.error("No aggregation response found");
      return "No information found";
    }

    const markdown = await OpenAIService.getCompletion(
      MARKDOWN_SYSTEM_PROMPT,
      MARKDOWN_USER_PROMPT + aggregation.choices[0].message.content,
      MARKDOWN_MODEL
    );

    if (!markdown?.choices[0]?.message?.content) {
      console.error("No markdown responsefound");
      return "No information found";
    }

    return markdown.choices[0].message.content;
  },

  create: async (countryCode: string) => {
    const vectorStore = await OpenAIService.createVectorStore("");

    const answers = await RetrievalService.getInfoForCountry("US");
    console.log(answers);
  },
};

export default AggregationService;
