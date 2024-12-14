import { FastifyInstance } from "fastify";
import { z } from "zod";

export const schema = z.object({
  countryCode: z.string(),
});

export default async function (fastify: FastifyInstance) {
  fastify.post("/countries", async (req, rep) => {
    const body = schema.parse(req.body);
    return rep.send({ message: `Hello ${body.countryCode}` });
  });
}
