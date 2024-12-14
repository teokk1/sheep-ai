import { FastifyInstance } from "fastify";
import { z } from "zod";
import AggregationService from "@/services/aggregation-service";

export const RequestSchema = z.object({
  country_code: z.string(),
});

export type RequestType = z.infer<typeof RequestSchema>;

export const ResponseSchema = z.object({
  country_code: z.string(),
  markdown: z.string(),
});

export type ResponseType = z.infer<typeof ResponseSchema>;

export default async function (fastify: FastifyInstance) {
  fastify.post("/countries", async (req, rep) => {
    const countryCode = RequestSchema.parse(req.body).country_code;

    const result = await AggregationService.aggregate(countryCode);

    return rep.send(
      ResponseSchema.parse({ country_code: countryCode, markdown: result })
    );
  });
}
