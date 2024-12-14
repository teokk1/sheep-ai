import RetrievalService from "@/services/retrieval-service";
import OpenAIService from "@/services/openai-service";

const AGGREGATION_SYSTEM_PROMPT = `
  You are a helpful assistant that summarizes information from a list of answers.
`;

const AGGREGATION_USER_PROMPT = `
  Summarize the following information in markdown format:
`;

const AGGREGATION_MODEL = "gpt-4o";

const MARKDOWN_SYSTEM_PROMPT = `
  You are a markdown formatter that formats a list of answers into a markdown article.
  Format the answers into a raw markdown string, dont wrap it in a codeblock or anything else.
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
