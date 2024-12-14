import { type FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import {
  type FastifyZodOpenApiTypeProvider,
  fastifyZodOpenApiPlugin,
  fastifyZodOpenApiTransform,
  fastifyZodOpenApiTransformObject,
  serializerCompiler,
  validatorCompiler,
} from "fastify-zod-openapi";

export default fp(async function (fastify: FastifyInstance) {
  fastify.log.info(`Registering openapi plugin 🗺️`);
  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);

  fastify.withTypeProvider<FastifyZodOpenApiTypeProvider>();

  await fastify.register(fastifyZodOpenApiPlugin, {});
  await fastify.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Aggregator API",
        version: "1.0.0",
      },
    },
    transform: fastifyZodOpenApiTransform,
    transformObject: fastifyZodOpenApiTransformObject,
  });
  await fastify.register(fastifySwaggerUI, {
    routePrefix: "/docs",
  });
});
