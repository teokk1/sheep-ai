import { FastifyInstance } from "fastify";
import { z } from "zod";
import OpenAIService from "@/services/openai-service";
import RetrievalService from "@/services/retrieval-service";

export const CreateAssistantRequestSchema = z.object({
  country_code: z.string(),
});

export type CreateAssistantRequestType = z.infer<
  typeof CreateAssistantRequestSchema
>;

export const CreateAssistantResponseSchema = z.object({
  country_code: z.string(),
  assistant_id: z.string(),
});

export const GetAssistantForCountryRequestSchema = z.object({
  country_code: z.string(),
});

export type GetAssistantForCountryRequestType = z.infer<
  typeof GetAssistantForCountryRequestSchema
>;

export const GetAssistantForCountryResponseSchema = z.object({
  country_code: z.string(),
  assistant_id: z.string(),
});

export type GetAssistantForCountryResponseType = z.infer<
  typeof GetAssistantForCountryResponseSchema
>;

export const MessageRequestSchema = z.object({
  country_code: z.string(),
  message: z.string(),
});

export type MessageRequestType = z.infer<typeof MessageRequestSchema>;

export const MessageResponseSchema = z.object({
  message: z.string(),
});

export type MessageResponseType = z.infer<typeof MessageResponseSchema>;

export default async function (fastify: FastifyInstance) {
  fastify.post("/assistants/create", async (req, rep) => {
    const countryCode = CreateAssistantRequestSchema.parse(
      req.body
    ).country_code;

    const result = await RetrievalService.createAssistantForCountry(
      countryCode
    );

    return rep.send(
      CreateAssistantResponseSchema.parse({
        country_code: countryCode,
        assistant_id: result.id,
      })
    );
  });

  fastify.post("/assistants/country", async (req, rep) => {
    const body = GetAssistantForCountryRequestSchema.parse(req.body);
    const countryCode = body.country_code;

    const result = await RetrievalService.getAssistantForCountry(countryCode);

    return rep.send(
      GetAssistantForCountryResponseSchema.parse({
        country_code: countryCode,
        assistant_id: result.id,
      })
    );
  });

  fastify.post("/assistants/message", async (req, rep) => {
    const body = MessageRequestSchema.parse(req.body);
    const countryCode = body.country_code;

    try {
      const assistant = await RetrievalService.getAssistantForCountry(
        countryCode
      );

      if (!assistant) {
        throw new Error(`No assistant found for country ${countryCode}`);
      }

      const processQuestion = async (question: string) => {
        try {
          const response = await OpenAIService.getAssistantCompletion(
            assistant.id,
            question
          );

          if (response) {
            return response;
          }

          console.warn(
            `No information found for question: ${question} in country ${countryCode}`
          );
          return "No information found for your question";
        } catch (error) {
          console.error(
            `Error processing question: ${question} for country ${countryCode}:`,
            error
          );
          return "Error retrieving information. Please try again later.";
        }
      };

      const result = await processQuestion(body.message);

      return rep.send(
        MessageResponseSchema.parse({
          message: result || "No response generated",
        })
      );
    } catch (error) {
      console.error(`Error handling message request:`, error);
      return rep.status(500).send({
        message: "An error occurred while processing your request",
      });
    }
  });
}
