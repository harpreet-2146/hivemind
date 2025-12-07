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
  // --- ADVANCED PHYSICS ---
  'quantum-physics': [
    'quantum', 'quantum mechanics', 'wave function', 'schrodinger',
    'heisenberg', 'uncertainty principle', 'superposition',
    'entanglement', 'qubit', 'quantization', 'decoherence',
    'quantum field theory'
  ],

  'relativity': [
    'relativity', 'einstein', 'spacetime', 'time dilation',
    'general relativity', 'special relativity', 'gravity curvature',
    'lorentz', 'mass energy', 'gravitational waves'
  ]

  // 'thermodynamics': [
  //   'thermodynamics', 'entropy', 'enthalpy', 'heat', 'temperature',
  //   'thermal equilibrium', 'carnot cycle'
  // ],

  // 'electromagnetism': [
  //   'electromagnetism', 'electric field', 'magnetic field',
  //   'maxwell equations', 'lorentz force', 'electrodynamics'
  // ],

  // 'particle-physics': [
  //   'particle physics', 'boson', 'fermion', 'quark', 'lepton',
  //   'standard model', 'higgs boson', 'neutrino'
  // ],

  // 'nuclear-physics': [
  //   'nuclear physics', 'radioactive', 'isotope', 'nuclear fission',
  //   'nuclear fusion', 'binding energy'
  // ],

  // 'classical-mechanics': [
  //   'mechanics', 'newton laws', 'force', 'motion',
  //   'kinematics', 'dynamics', 'momentum'
  // ],

  // 'astrophysics': [
  //   'astrophysics', 'supernova', 'neutron star', 'pulsar',
  //   'exoplanet', 'accretion disk', 'cosmic'
  // ],

  // // --- AI + MACHINE LEARNING ---
  // 'machine-learning': [
  //   'machine learning', 'supervised', 'unsupervised', 'reinforcement',
  //   'gradient descent', 'loss function', 'model training',
  //   'overfitting', 'regularization', 'evaluation metrics'
  // ],

  // 'deep-learning': [
  //   'deep learning', 'neural network', 'cnn', 'rnn', 'transformer',
  //   'attention mechanism', 'backpropagation', 'activation function',
  //   'batch norm', 'dropout', 'autoencoder', 'gan'
  // ],

  // 'nlp': [
  //   'nlp', 'natural language', 'large language model', 'llm',
  //   'tokenization', 'semantic similarity', 'text processing',
  //   'embedding', 'classification', 'sentiment analysis'
  // ],

  // 'computer-vision': [
  //   'computer vision', 'opencv', 'image classification',
  //   'object detection', 'segmentation', 'pose estimation'
  // ],

  // 'reinforcement-learning': [
  //   'reinforcement learning', 'rl', 'reward', 'policy', 'q learning',
  //   'mdp', 'value iteration'
  // ],

  // // --- COMPUTER SCIENCE ---
  // 'algorithms': [
  //   'algorithm', 'sorting', 'searching', 'graph algorithm',
  //   'dynamic programming', 'complexity', 'big o'
  // ],

  // 'data-structures': [
  //   'data structure', 'tree', 'graph', 'linked list',
  //   'stack', 'queue', 'hash table'
  // ],

  // 'databases': [
  //   'database', 'sql', 'nosql', 'mongodb',
  //   'query', 'indexing', 'schema'
  // ],

  // 'operating-systems': [
  //   'operating system', 'process', 'thread',
  //   'scheduling', 'memory management', 'interrupt'
  // ],

  // 'computer-networks': [
  //   'network', 'protocol', 'ip', 'tcp', 'routing',
  //   'http', 'packet switching'
  // ],

  // 'web-development': [
  //   'web dev', 'frontend', 'backend',
  //   'javascript', 'react', 'node', 'api', 'full stack'
  // ],

  // // --- MATHEMATICS ---
  // 'calculus': [
  //   'calculus', 'derivative', 'integral', 'limit',
  //   'rate of change', 'multivariable'
  // ],

  // 'linear-algebra': [
  //   'linear algebra', 'matrix', 'vector',
  //   'eigenvalue', 'eigenvector', 'linear transformation'
  // ],

  // 'probability-stats': [
  //   'probability', 'statistics', 'bayes theorem',
  //   'distribution', 'variance', 'hypothesis testing'
  // ],

  // 'number-theory': [
  //   'number theory', 'prime', 'modular arithmetic', 'gcd',
  //   'diophantine'
  // ],

  // 'geometry': [
  //   'geometry', 'circle', 'triangle',
  //   'polygon', 'coordinate geometry'
  // ],

  // // --- BIOLOGY ---
  // 'cell-biology': [
  //   'cell', 'organelle', 'mitochondria', 'nucleus',
  //   'cell membrane', 'cell cycle'
  // ],

  // 'genetics': [
  //   'genetics', 'gene', 'dna', 'rna',
  //   'mutation', 'inheritance'
  // ],

  // 'evolution': [
  //   'evolution', 'darwin', 'natural selection',
  //   'adaptation', 'speciation'
  // ],

  // 'microbiology': [
  //   'microbiology', 'virus', 'bacteria',
  //   'fungi', 'infection'
  // ],

  // // --- CHEMISTRY ---
  // 'organic-chemistry': [
  //   'organic chemistry', 'hydrocarbon',
  //   'functional group', 'alcohol', 'amine', 'carboxyl'
  // ],

  // 'inorganic-chemistry': [
  //   'inorganic chemistry', 'metal', 'ionic bond',
  //   'coordination compound', 'transition metal'
  // ],

  // 'chemical-reactions': [
  //   'chemical reaction', 'oxidation', 'reduction',
  //   'reaction rate', 'stoichiometry'
  // ],

  // 'periodic-table': [
  //   'periodic table', 'element', 'atomic number',
  //   'group', 'period', 'electron configuration'
  // ],

  // // --- SPACE ---
  // 'solar-system': [
  //   'solar system', 'planet', 'sun', 'orbit',
  //   'moon', 'asteroid'
  // ],

  // 'galaxies': [
  //   'galaxy', 'milky way', 'andromeda',
  //   'spiral galaxy', 'elliptical galaxy'
  // ],

  // 'cosmology': [
  //   'cosmology', 'big bang', 'dark matter',
  //   'dark energy', 'cmb', 'expansion'
  // ],

  // 'space-exploration': [
  //   'space exploration', 'nasa', 'spacex',
  //   'iss', 'apollo', 'rocket launch'
  // ],

  // // --- HISTORY ---
  // 'world-war-1': [
  //   'world war 1', 'ww1', 'allies', 'central powers',
  //   'trench warfare', 'armistice'
  // ],

  // 'world-war-2': [
  //   'world war 2', 'ww2', 'axis', 'allies',
  //   'hitler', 'holocaust'
  // ],

  // 'roman-empire': [
  //   'roman empire', 'rome', 'caesar',
  //   'senate', 'roman army'
  // ],

  // 'mughal-empire': [
  //   'mughal empire', 'akbar', 'shah jahan',
  //   'taj mahal', 'aurangzeb'
  // ],

  // 'industrial-revolution': [
  //   'industrial revolution', 'factories',
  //   'steam engine', 'innovation', 'urbanization'
  // ],

  // 'american-revolution': [
  //   'american revolution', 'independence',
  //   'colonies', 'george washington', 'british'
  // ]
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