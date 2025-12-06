import { FastifyReply, FastifyRequest } from "fastify";
import { SAMPLE_CONCEPTS } from "../data/sampleConcepts";
import { generateContextForConcept } from "../services/contextService";

export async function getConcepts(req: FastifyRequest, reply: FastifyReply) {
  return reply.send(
    SAMPLE_CONCEPTS.map(c => ({
      id: c.id,
      name: c.name,
      definition: c.definition.slice(0, 150),
      category: c.category,
      importance: c.importance
    }))
  );
}

export async function getConceptById(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  const concept = SAMPLE_CONCEPTS.find(c => c.id === req.params.id);
  if (!concept) return reply.status(404).send({ error: "Concept not found" });
  return reply.send(concept);
}

export async function getContext(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  const concept = SAMPLE_CONCEPTS.find(c => c.id === req.params.id);
  if (!concept) return reply.status(404).send({ error: "Concept not found" });

  const cards = await generateContextForConcept(concept);
  return reply.send(cards);
}
