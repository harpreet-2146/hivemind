const { QdrantClient } = require('@qdrant/js-client-rest');

const client = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

const COLLECTION_NAME = 'documents';
const VECTOR_SIZE = 768; // Gemini embedding size

const initCollection = async () => {
  try {
    const collections = await client.getCollections();
    const exists = collections.collections.some(c => c.name === COLLECTION_NAME);

    if (!exists) {
      await client.createCollection(COLLECTION_NAME, {
        vectors: {
          size: VECTOR_SIZE,
          distance: 'Cosine',
        },
      });
      console.log('✅ Qdrant collection created');
    } else {
      console.log('✅ Qdrant collection exists');
    }
  } catch (error) {
    console.error('❌ Qdrant init error:', error.message);
    throw error;
  }
};

const upsertDocuments = async (docs) => {
  // docs should be array of { id, vector, payload }
  const points = docs.map(doc => ({
    id: doc.id,
    vector: doc.vector,
    payload: doc.payload,
  }));

  await client.upsert(COLLECTION_NAME, { points });
  return points.length;
};

const searchSimilar = async (vector, limit = 10) => {
  const results = await client.search(COLLECTION_NAME, {
    vector,
    limit,
    with_payload: true,
  });

  return results.map(r => ({
    id: r.id,
    score: r.score,
    ...r.payload,
  }));
};

module.exports = {
  client,
  initCollection,
  upsertDocuments,
  searchSimilar,
};