const BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:4000/api/v1";

// Fetch list of concepts
export async function getConcepts() {
  const res = await fetch(`${BASE_URL}/concepts`);
  if (!res.ok) throw new Error("Failed to fetch concepts");
  return res.json();
}

// Fetch a single concept
export async function getConcept(id) {
  const res = await fetch(`${BASE_URL}/concepts/${id}`);
  if (!res.ok) throw new Error("Concept not found");
  return res.json();
}

// Fetch context explosion
export async function getContextExplosion(id) {
  const res = await fetch(`${BASE_URL}/context/${id}`);
  if (!res.ok) throw new Error("Failed to get context");
  return res.json();
}
