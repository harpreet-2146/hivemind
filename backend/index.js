require('dotenv').config();
const express = require('express');
const cors = require('cors');
const meilisearch = require('./services/meilisearch');
const qdrant = require('./services/qdrant');
const memgraph = require('./services/memgraph');
const gemini = require('./services/gemini');

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', name: 'Hivemind API' });
});

// Search endpoint - combines Meilisearch + Qdrant
app.get('/search', async (req, res) => {
  try {
    const { q, difficulty } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Query required' });
    }

    // Step 1: Meilisearch lexical search
    const lexicalResults = await meilisearch.search(q, { difficulty });

    // Step 2: Qdrant semantic search
    const queryEmbedding = await gemini.getEmbedding(q);
    const semanticResults = await qdrant.searchSimilar(queryEmbedding, 10);

    // Step 3: Merge and dedupe results
    const seen = new Set();
    const merged = [];

    // Add lexical results first (higher priority)
    for (const doc of lexicalResults) {
      if (!seen.has(doc.id)) {
        seen.add(doc.id);
        merged.push({ ...doc, source: 'lexical' });
      }
    }

    // Add semantic results
    for (const doc of semanticResults) {
      if (!seen.has(doc.docId)) {
        seen.add(doc.docId);
        merged.push({
          id: doc.docId,
          title: doc.title,
          concepts: doc.concepts,
          difficulty: doc.difficulty,
          score: doc.score,
          source: 'semantic',
        });
      }
    }

    res.json({ results: merged });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get concept graph
app.get('/graph', async (req, res) => {
  try {
    const { concept } = req.query;

    let graph;
    if (concept) {
      graph = await memgraph.getConceptGraph(concept);
    } else {
      graph = await memgraph.getFullGraph(100);
    }

    res.json(graph);
  } catch (error) {
    console.error('Graph error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Chat endpoint
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    // Get relevant context from search
    const queryEmbedding = await gemini.getEmbedding(message);
    const context = await qdrant.searchSimilar(queryEmbedding, 3);

    // Generate response
    const response = await gemini.chat(message, context);

    res.json({ response, context });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;

const start = async () => {
  await meilisearch.initIndex();
  await qdrant.initCollection();
  await memgraph.initGraph();

  app.listen(PORT, () => {
    console.log(`🚀 Hivemind API running on http://localhost:${PORT}`);
  });
};

start().catch(console.error);