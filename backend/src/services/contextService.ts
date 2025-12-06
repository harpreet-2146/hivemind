import fetch from "node-fetch";

export async function generateContextForConcept(concept: any) {
  return {
    conceptId: concept.id,
    generatedAt: new Date().toISOString(),
    cards: {
      examples: [
        `Example of ${concept.name}: A car moving in a straight line.`,
        `Example 2: Dropping a ball changes its ${concept.name.toLowerCase()}.`
      ],
      analogies: [
        `${concept.name} is like watching how fast your YouTube buffer moves.`
      ],
      mistakes: [
        `People often confuse ${concept.name.toLowerCase()} with speed.`
      ],
      applications: [
        "Self-driving cars, physics engines, GPS tracking"
      ],
      history: `Historical context for ${concept.name} (placeholder).`,
      formula_breakdown: "Formula explanation placeholder.",
      practice: [
        `Easy: Create a question about ${concept.name}`,
        `Medium: Combine ${concept.name} with acceleration`
      ]
    }
  };
}
