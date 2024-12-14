import { FastifyInstance } from "fastify";
import { z } from "zod";
import AggregationService from "@/services/aggregation-service";

export const RequestSchema = z.object({
  countryCode: z.string(),
});

export type RequestType = z.infer<typeof RequestSchema>;

export const ResponseSchema = z.object({
  countryCode: z.string(),
  markdown: z.string(),
});

export type ResponseType = z.infer<typeof ResponseSchema>;

export default async function (fastify: FastifyInstance) {
  fastify.post("/countries", async (req, rep) => {
    const body = RequestSchema.parse(req.body);
    const countryCode = body.countryCode;

    const result = await AggregationService.aggregate(countryCode);

    return rep.send(ResponseSchema.parse({ countryCode, markdown: result }));
  });
}
