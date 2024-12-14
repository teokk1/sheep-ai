import fp from "fastify-plugin";
import cors from "@fastify/cors";
import { FastifyInstance } from "fastify";

export default fp(async function (fastify: FastifyInstance) {
  fastify.log.info(`Registering cors plugin 🌐`);
  fastify.register(cors, {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  });
});
