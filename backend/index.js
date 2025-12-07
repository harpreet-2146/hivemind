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

let lastSearchResults = [];
let lastSearchQuery = '';

// Category mappings for strict filtering
const CATEGORY_KEYWORDS = {
  'quantum-physics': [
    'quantum', 'quantum mechanics', 'schrodinger', 'heisenberg', 'superposition',
    'entanglement', 'wavefunction', 'qubit', 'quantization', 'spin'
  ],
  'relativity': [
    'relativity', 'einstein', 'spacetime', 'general relativity', 'special relativity',
    'time dilation', 'gravity curvature'
  ],
  'thermodynamics': [
    'thermodynamics', 'entropy', 'enthalpy', 'heat transfer', 'temperature', 'laws of thermodynamics'
  ],
  'electromagnetism': [
    'electromagnetism', 'electric field', 'magnetic field', 'maxwell equations',
    'electrodynamics', 'charge', 'current'
  ],
  'particle-physics': [
    'particle physics', 'boson', 'fermion', 'quark', 'lepton', 'hadron', 'standard model'
  ],
  'nuclear-physics': [
    'nuclear physics', 'radioactivity', 'nuclear fission', 'nuclear fusion', 'isotope'
  ],
  'classical-mechanics': [
    'mechanics', 'newton laws', 'forces', 'motion', 'kinematics', 'dynamics'
  ],
  'astrophysics': [
    'astrophysics', 'stars', 'galaxies', 'cosmic', 'supernova', 'neutron star', 'space-time'
  ],
  'ai-deep-learning': [
    'deep learning', 'neural network', 'cnn', 'rnn', 'transformer', 'backpropagation'
  ],
  'ai-ml-basics': [
    'machine learning', 'supervised', 'unsupervised', 'reinforcement learning', 'model training'
  ],
  'nlp': [
    'nlp', 'language model', 'text processing', 'tokenization', 'embedding'
  ],
  'computer-vision': [
    'computer vision', 'image recognition', 'object detection', 'opencv'
  ],
  'reinforcement-learning': [
    'reinforcement learning', 'rl agent', 'reward function', 'q learning'
  ],
  'algorithms': [
    'algorithm', 'sorting', 'searching', 'complexity', 'big o'
  ],
  'data-structures': [
    'data structure', 'tree', 'graph', 'linked list', 'stack', 'queue'
  ],
  'databases': [
    'database', 'sql', 'nosql', 'mongodb', 'queries', 'schema'
  ],
  'operating-systems': [
    'operating system', 'process', 'thread', 'scheduling', 'memory management'
  ],
  'computer-networks': [
    'network', 'protocol', 'ip', 'tcp', 'router', 'http'
  ],
  'web-development': [
    'web development', 'frontend', 'backend', 'javascript', 'react', 'node', 'api'
  ],
  'calculus': [
    'calculus', 'derivative', 'integral', 'limits', 'rate of change'
  ],
  'linear-algebra': [
    'linear algebra', 'matrix', 'vector', 'eigenvalue', 'eigenvector'
  ],
  'probability-stats': [
    'probability', 'statistics', 'bayes', 'distribution', 'mean', 'variance'
  ],
  'number-theory': [
    'number theory', 'primes', 'modular arithmetic', 'gcd'
  ],
  'geometry': [
    'geometry', 'shapes', 'angles', 'triangles', 'polygons'
  ],
  'cell-biology': [
    'cell', 'organelles', 'mitochondria', 'cell membrane'
  ],
  'genetics': [
    'genetics', 'gene', 'dna', 'rna', 'mutation', 'heredity'
  ],
  'evolution': [
    'evolution', 'darwin', 'natural selection', 'adaptation', 'species'
  ],
  'microbiology': [
    'microbiology', 'virus', 'bacteria', 'pathogen'
  ],
  'organic-chemistry': [
    'organic chemistry', 'hydrocarbon', 'alkane', 'alkene', 'functional group'
  ],
  'inorganic-chemistry': [
    'inorganic chemistry', 'metal', 'ionic bond', 'coordination compound'
  ],
  'chemical-reactions': [
    'chemical reaction', 'oxidation', 'reduction', 'stoichiometry'
  ],
  'periodic-table': [
    'periodic table', 'elements', 'atomic number', 'groups', 'periods'
  ],
  'solar-system': [
    'solar system', 'sun', 'planet', 'orbit', 'moon', 'asteroid'
  ],
  'galaxies': [
    'galaxy', 'milky way', 'andromeda', 'spiral galaxy'
  ],
  'cosmology': [
    'cosmology', 'big bang', 'dark matter', 'dark energy', 'expansion'
  ],
  'space-exploration': [
    'nasa', 'spacex', 'iss', 'apollo', 'rocket'
  ],
  'world-war-1': [
    'world war i', 'ww1', 'allies', 'central powers', 'trench warfare'
  ],
  'world-war-2': [
    'world war ii', 'ww2', 'axis', 'allies', 'hitler', 'holocaust'
  ],
  'roman-empire': [
    'roman empire', 'rome', 'caesar', 'senate', 'roman army'
  ],
  'mughal-empire': [
    'mughal empire', 'akbar', 'shah jahan', 'taj mahal', 'aurangzeb'
  ],
  'industrial-revolution': [
    'industrial revolution', 'factories', 'steam engine', 'mass production'
  ],
  'american-revolution': [
    'american revolution', 'independence', 'colonies', 'george washington'
  ]
};

const getQueryCategory = (query) => {
  const q = query.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(k => q.includes(k))) {
      return category;
    }
  }
  return null;
};

const isRelevant = (doc, query, category) => {
  const q = query.toLowerCase();
  const title = doc.title?.toLowerCase() || '';
  const summary = doc.summary?.toLowerCase() || '';
  const concepts = doc.concepts?.map(c => c.toLowerCase()) || [];
  const docCategory = doc.category?.toLowerCase() || '';
  
  // Check direct query match
  const queryWords = q.split(/\s+/).filter(w => w.length > 2);
  const directMatch = queryWords.some(word => 
    title.includes(word) || 
    concepts.some(c => c.includes(word)) ||
    summary.includes(word)
  );
  
  if (directMatch) return true;
  
  // Check category match
  if (category && docCategory === category) return true;
  
  // Check if doc belongs to same category based on keywords
  if (category) {
    const categoryKeywords = CATEGORY_KEYWORDS[category] || [];
    const docText = `${title} ${summary} ${concepts.join(' ')}`;
    if (categoryKeywords.some(k => docText.includes(k))) return true;
  }
  
  return false;
};

app.get('/health', (req, res) => {
  res.json({ status: 'ok', name: 'Hivemind API' });
});

app.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Query required' });
    }

    // Get category for query
    const category = getQueryCategory(q);
    
    // Search with high limit
    const allResults = await meilisearch.search(q, {});
    
    // Filter to only relevant results
    const relevantResults = allResults.filter(doc => isRelevant(doc, q, category));
    
    // Sort by relevance score
    const queryWords = q.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const scoredResults = relevantResults.map(doc => {
      let score = 0;
      const title = doc.title?.toLowerCase() || '';
      const concepts = doc.concepts?.map(c => c.toLowerCase()) || [];
      
      queryWords.forEach(word => {
        if (title.includes(word)) score += 10;
        if (concepts.some(c => c.includes(word))) score += 5;
      });
      
      // Boost same category
      if (category && doc.category === category) score += 3;
      
      return { ...doc, relevanceScore: score };
    });
    
    // Sort and take top results (minimum 10 if available)
    const sortedResults = scoredResults
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 15);

    // Store for chat
    lastSearchResults = sortedResults;
    lastSearchQuery = q;

    res.json({ results: sortedResults });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: error.message });
  }
});

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

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    const context = lastSearchResults.slice(0, 5);
    const response = await gemini.chat(message, context, lastSearchQuery);

    res.json({ response, context });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

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