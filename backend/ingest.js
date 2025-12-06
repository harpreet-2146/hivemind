require('dotenv').config();
const axios = require('axios');
const meilisearch = require('./services/meilisearch');
const qdrant = require('./services/qdrant');
const memgraph = require('./services/memgraph');
const gemini = require('./services/gemini');

// Seed topics to fetch from Wikipedia
const SEED_TOPICS = [
  'Machine learning',
  'Neural network',
  'Deep learning',
  'Artificial intelligence',
  'Natural language processing',
  'Computer vision',
  'Reinforcement learning',
  'Gradient descent',
  'Backpropagation',
  'Convolutional neural network',
  'Recurrent neural network',
  'Transformer (machine learning model)',
  'GPT',
  'BERT (language model)',
  'Data science',
  'Python (programming language)',
  'TensorFlow',
  'PyTorch',
  'Supervised learning',
  'Unsupervised learning',
];

const fetchWikipediaArticle = async (title) => {
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Hivemind/1.0 (hackathon project; contact@example.com)',
      },
    });
    
    return {
      title: response.data.title,
      url: response.data.content_urls.desktop.page,
      content: response.data.extract,
    };
  } catch (error) {
    console.log(`⚠️ Could not fetch: ${title} - ${error.message}`);
    return null;
  }
};
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const ingest = async () => {
  console.log('🚀 Starting Hivemind ingestion...\n');

  // Initialize all services
  console.log('📡 Connecting to services...');
  await meilisearch.initIndex();
  await qdrant.initCollection();
  await memgraph.initGraph();
  console.log('');

  const documents = [];
  let docId = 1;

  // Fetch and process each article
  for (const topic of SEED_TOPICS) {
    console.log(`📖 Fetching: ${topic}`);
    
    const article = await fetchWikipediaArticle(topic);
    if (!article) continue;

    console.log(`🧠 Extracting concepts...`);
    
    try {
      const extracted = await gemini.extractConcepts(article.title, article.content);
      
      const doc = {
        id: `doc_${String(docId).padStart(3, '0')}`,
        title: article.title,
        url: article.url,
        summary: extracted.summary,
        concepts: extracted.concepts,
        difficulty: extracted.difficulty,
        source: 'wikipedia',
      };

      documents.push(doc);
      console.log(`   ✅ ${doc.title} [${doc.difficulty}]`);
      console.log(`   📌 Concepts: ${doc.concepts.join(', ')}\n`);

      docId++;
      
      // Rate limiting for Gemini API
      await delay(1000);
    } catch (error) {
      console.log(`   ❌ Failed to process: ${error.message}\n`);
    }
  }

  console.log(`\n📦 Processed ${documents.length} documents\n`);

  // Push to Meilisearch
  console.log('📤 Uploading to Meilisearch...');
  await meilisearch.addDocuments(documents);
  console.log('   ✅ Done\n');

  // Generate embeddings and push to Qdrant
  console.log('📤 Generating embeddings & uploading to Qdrant...');
  for (const doc of documents) {
    const text = `${doc.title}. ${doc.summary}. Concepts: ${doc.concepts.join(', ')}`;
    const vector = await gemini.getEmbedding(text);
    
    await qdrant.upsertDocuments([{
      id: parseInt(doc.id.split('_')[1]),
      vector,
      payload: {
        docId: doc.id,
        title: doc.title,
        concepts: doc.concepts,
        difficulty: doc.difficulty,
      },
    }]);
    
    await delay(500);
  }
  console.log('   ✅ Done\n');

  // Push to Memgraph
  console.log('📤 Building knowledge graph in Memgraph...');
  for (const doc of documents) {
    await memgraph.addDocumentWithConcepts(doc);
  }
  console.log('   ✅ Done\n');

  console.log('🎉 Hivemind ingestion complete!');
  console.log(`   📚 ${documents.length} documents indexed`);
  
  await memgraph.close();
  process.exit(0);
};

ingest().catch(error => {
  console.error('❌ Ingestion failed:', error);
  process.exit(1);
});