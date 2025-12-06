import { FastifyInstance } from "fastify";
import { getConcepts, getConceptById, getContext } from "./controllers/concepts";

export default async function routes(app: FastifyInstance) {
  app.get("/concepts", getConcepts);
  app.get("/concepts/:id", getConceptById);
  app.get("/context/:id", getContext);
}
