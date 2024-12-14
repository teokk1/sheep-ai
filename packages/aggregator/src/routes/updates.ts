import { FastifyInstance } from "fastify";
import { z } from "zod";
import OpenAIService from "@/services/openai-service";
import RetrievalService from "@/services/retrieval-service";

export const RequestSchema = z.object({
  country_code: z.string(),
});

export type RequestType = z.infer<typeof RequestSchema>;

export const ResponseSchema = z.object({
  date: z.date(),
  country_code: z.string(),
  markdown: z.string(),
});

export type ResponseType = z.infer<typeof ResponseSchema>;

const QUESTION = `
  Only give me future updates, do not include past updates.
  Right now the month is ${new Date().getMonth()}, and the year is ${new Date().getFullYear()}.
  Get updates for the years ${new Date().getFullYear()}, ${
  new Date().getFullYear() + 1
}, 
  ${new Date().getFullYear() + 2} 
  and ${new Date().getFullYear() + 3}.

  Only give me updates that are relevant to the country you have been instructed to get updates for.
`;

const PARSING_SYSTEM_PROMPT = `
  You are given a list of updates to the regulations of the given country in natural language.
  The response comes from an LLM that has access to a RAG pipeline of crawled data from government websites.
  You will parse the updates into the ResponseSchema object and return a list of the objects.
  Only reply in JSON, never include any other text.
  Only return future updates, do not include past updates.
  Do not format the json object into a markdown code block, just return the json object as a string.

  The current date is ${new Date().toISOString()}.

  If there are no updates, return the object with the date set to the current date and the text set to "No updates found".

  Example:
  {
    "date": "2024-01-01", // The date of the update, if not exact use arbitrary, but make sure its a valid zod date (ISO 8601, YYYY-MM-DD)
    "country_code": "DE", // The country code of the update
    "markdown": "The standard VAT rate will increase to 19%." // The markdown of the update, feel free to format accordingly
  }
`;

const MODEL = "gpt-4o";

export default async function (fastify: FastifyInstance) {
  fastify.post("/updates", async (req, rep) => {
    const countryCode = RequestSchema.parse(req.body).country_code;

    const assistant = await RetrievalService.createAssistantForCountry(
      countryCode
    );

    const updates = await OpenAIService.getAssistantCompletion(
      assistant.id,
      `
        Give me a list of upcoming changes to the regulations of the country with country code ${countryCode}.
        ${QUESTION}
      `
    );

    const parsedUpdates = await OpenAIService.getCompletion(
      PARSING_SYSTEM_PROMPT,
      updates,
      MODEL
    );

    if (!parsedUpdates?.choices[0]?.message?.content) {
      return rep.send([]);
    }

    return rep.send(parsedUpdates.choices[0].message.content);
  });
}
