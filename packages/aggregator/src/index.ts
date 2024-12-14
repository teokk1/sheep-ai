import Fastify from "fastify";
import autoload from "@fastify/autoload";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isDevelopment = process.env.NODE_ENV !== "production";

const loggerConfig = {
  level: "info",
  transport: isDevelopment
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
          singleLine: true,
          levelFirst: true,
        },
      }
    : undefined,
};

async function main() {
  const fastify = Fastify({
    logger: loggerConfig,
  });

  await fastify.register(autoload, {
    dir: join(__dirname, "plugins"),
  });
  await fastify.register(autoload, {
    dir: join(__dirname, "routes"),
  });
  const portEnv = process.env.PORT;
  const port: number = portEnv ? Number.parseInt(portEnv) : 8080;
  const host: string = process.env.HOST ?? "localhost";

  fastify.listen({ host, port }, (err, address) => {
    if (err) {
      fastify.log.error(err, "Failed to start server ⛔️");
      process.exit(1);
    }
    fastify.log.info(`Server launched, listening on ${address} ✅`);
  });
}

main();
