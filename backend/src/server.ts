import Fastify from "fastify";
import cors from "@fastify/cors";
import routes from "./routes";
import dotenv from "dotenv";

dotenv.config();
const PORT = Number(process.env.PORT || 4000);

const fastify = Fastify({ logger: true });

fastify.register(cors, { origin: true });
fastify.register(routes, { prefix: "/api/v1" });

const start = async () => {
  try {
    await fastify.listen({
      port: PORT,
      host: "0.0.0.0"
    });
    console.log(`🚀 Backend running on port ${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
