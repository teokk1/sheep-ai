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

export type CreateAssistantResponseType = z.infer<
  typeof CreateAssistantResponseSchema
>;

export default async function (fastify: FastifyInstance) {
  fastify.post("/assistants/create", async (req, rep) => {
    const body = CreateAssistantRequestSchema.parse(req.body);
    const countryCode = body.country_code;

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
      GetAssistantForCountryRequestSchema.parse({
        country_code: countryCode,
        assistant_id: result.id,
      })
    );
  });
}
