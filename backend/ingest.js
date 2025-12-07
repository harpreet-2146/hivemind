require('dotenv').config();
const axios = require('axios');
const meilisearch = require('./services/meilisearch');
const qdrant = require('./services/qdrant');
const memgraph = require('./services/memgraph');
const gemini = require('./services/gemini');

const TOPICS_BY_CATEGORY = {
  'quantum-physics': [
    'Quantum mechanics',
    'Quantum computing',
    'Quantum entanglement',
    'Wave–particle duality',
    'Schrödinger equation',
    'Heisenberg uncertainty principle',
    'Quantum tunneling',
    'Quantum decoherence',
    'Quantum teleportation',
    'Quantum field theory'
  ],
  'relativity': [
    'General relativity',
    'Special relativity',
    'Spacetime',
    'Time dilation',
    'Gravitational waves',
    'Black hole'
  ],
  'thermodynamics': [
    'Laws of thermodynamics',
    'Entropy',
    'Enthalpy',
    'Heat transfer',
    'Thermal equilibrium'
  ],
  'electromagnetism': [
    'Maxwell\'s equations',
    'Electric field',
    'Magnetic field',
    'Electromagnetic radiation'
  ],
  'particle-physics': [
    'Standard Model',
    'Boson',
    'Fermion',
    'Quark',
    'Lepton',
    'Higgs boson'
  ],
  'nuclear-physics': [
    'Radioactivity',
    'Nuclear fission',
    'Nuclear fusion',
    'Isotopes'
  ],
  'classical-mechanics': [
    'Newton\'s laws',
    'Kinematics',
    'Dynamics',
    'Energy conservation'
  ],
  'astrophysics': [
    'Supernova',
    'Neutron star',
    'Pulsar',
    'Exoplanet'
  ],
  'ai-deep-learning': [
    'Neural network',
    'Convolutional neural network',
    'Recurrent neural network',
    'Transformer (machine learning model)'
  ],
  'ai-ml-basics': [
    'Machine learning',
    'Supervised learning',
    'Unsupervised learning',
    'Reinforcement learning'
  ],
  'nlp': [
    'Natural language processing',
    'Tokenization',
    'Large language model',
    'Word embeddings'
  ],
  'computer-vision': [
    'Image classification',
    'Object detection',
    'OpenCV',
    'Image segmentation'
  ],
  'reinforcement-learning': [
    'Q-learning',
    'Policy gradient',
    'Reward function',
    'Markov decision process'
  ],
  'algorithms': [
    'Sorting algorithm',
    'Searching algorithm',
    'Graph algorithm',
    'Dynamic programming'
  ],
  'data-structures': [
    'Tree (data structure)',
    'Graph (data structure)',
    'Linked list',
    'Stack',
    'Queue'
  ],
  'databases': [
    'SQL',
    'NoSQL',
    'MongoDB',
    'Database schema'
  ],
  'operating-systems': [
    'Process management',
    'Threads',
    'Scheduling algorithms',
    'Memory management'
  ],
  'computer-networks': [
    'TCP/IP',
    'HTTP',
    'Routing',
    'Packet switching'
  ],
  'web-development': [
    'Frontend and backend',
    'JavaScript',
    'React (web framework)',
    'Node.js'
  ],
  'calculus': [
    'Differentiation',
    'Integration',
    'Limits',
    'Multivariable calculus'
  ],
  'linear-algebra': [
    'Matrix',
    'Vector space',
    'Eigenvalue',
    'Eigenvector'
  ],
  'probability-stats': [
    'Bayes theorem',
    'Probability distributions',
    'Mean and variance',
    'Hypothesis testing'
  ],
  'number-theory': [
    'Prime number',
    'Modular arithmetic',
    'Greatest common divisor'
  ],
  'geometry': [
    'Triangles',
    'Circles',
    'Polygons',
    'Coordinate geometry'
  ],
  'cell-biology': [
    'Cell structure',
    'Mitochondria',
    'Nucleus',
    'Cell membrane'
  ],
  'genetics': [
    'DNA',
    'RNA',
    'Gene expression',
    'Mutation'
  ],
  'evolution': [
    'Natural selection',
    'Darwin\'s theory',
    'Speciation',
    'Adaptation'
  ],
  'microbiology': [
    'Virus',
    'Bacteria',
    'Fungi',
    'Microbial infection'
  ],
  'organic-chemistry': [
    'Hydrocarbon',
    'Functional group',
    'Alcohols',
    'Amines'
  ],
  'inorganic-chemistry': [
    'Metals',
    'Ionic bond',
    'Coordination compound'
  ],
  'chemical-reactions': [
    'Oxidation',
    'Reduction',
    'Reaction rate',
    'Stoichiometry'
  ],
  'periodic-table': [
    'Elements',
    'Atomic number',
    'Groups',
    'Periods'
  ],
  'solar-system': [
    'Sun',
    'Earth',
    'Mars',
    'Jupiter',
    'Moon'
  ],
  'galaxies': [
    'Milky Way',
    'Andromeda',
    'Spiral galaxy',
    'Elliptical galaxy'
  ],
  'cosmology': [
    'Big Bang',
    'Dark matter',
    'Dark energy',
    'Cosmic microwave background'
  ],
  'space-exploration': [
    'NASA',
    'SpaceX',
    'International Space Station',
    'Apollo program'
  ],
  'world-war-1': [
    'World War I',
    'Allied powers',
    'Central powers',
    'Trench warfare'
  ],
  'world-war-2': [
    'World War II',
    'Axis powers',
    'Allied forces',
    'Holocaust'
  ],
  'roman-empire': [
    'Roman Empire',
    'Julius Caesar',
    'Roman senate',
    'Gladiator games'
  ],
  'mughal-empire': [
    'Mughal Empire',
    'Akbar',
    'Shah Jahan',
    'Taj Mahal'
  ],
  'industrial-revolution': [
    'Industrial Revolution',
    'Steam engine',
    'Factories',
    'Urbanization'
  ],
  'american-revolution': [
    'American Revolution',
    'Declaration of Independence',
    'George Washington'
  ]
};

const DIFFICULTY_MAP = {
  'quantum-physics': 'advanced',
  'relativity': 'advanced',
  'thermodynamics': 'advanced',
  'electromagnetism': 'advanced',
  'particle-physics': 'advanced',
  'nuclear-physics': 'advanced',
  'classical-mechanics': 'intermediate',
  'astrophysics': 'advanced',
  'ai-deep-learning': 'advanced',
  'ai-ml-basics': 'intermediate',
  'nlp': 'intermediate',
  'computer-vision': 'intermediate',
  'reinforcement-learning': 'advanced',
  'algorithms': 'intermediate',
  'data-structures': 'intermediate',
  'databases': 'intermediate',
  'operating-systems': 'intermediate',
  'computer-networks': 'intermediate',
  'web-development': 'intermediate',
  'calculus': 'advanced',
  'linear-algebra': 'advanced',
  'probability-stats': 'intermediate',
  'number-theory': 'advanced',
  'geometry': 'beginner',
  'cell-biology': 'intermediate',
  'genetics': 'intermediate',
  'evolution': 'beginner',
  'microbiology': 'intermediate',
  'organic-chemistry': 'intermediate',
  'inorganic-chemistry': 'intermediate',
  'chemical-reactions': 'intermediate',
  'periodic-table': 'beginner',
  'solar-system': 'beginner',
  'galaxies': 'intermediate',
  'cosmology': 'advanced',
  'space-exploration': 'beginner',
  'world-war-1': 'beginner',
  'world-war-2': 'beginner',
  'roman-empire': 'beginner',
  'mughal-empire': 'beginner',
  'industrial-revolution': 'beginner',
  'american-revolution': 'beginner'
};


const fetchWikipediaArticle = async (title) => {
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Hivemind/1.0 (hackathon project)',
      },
    });
    
    return {
      title: response.data.title,
      url: response.data.content_urls.desktop.page,
      content: response.data.extract,
    };
  } catch (error) {
    return null;
  }
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const ingest = async () => {
  console.log('🚀 Starting Hivemind ingestion...\n');

  console.log('📡 Connecting to services...');
  await meilisearch.initIndex();
  await qdrant.initCollection();
  await memgraph.initGraph();
  console.log('');

  const documents = [];
  let docId = 1;

  for (const [category, topics] of Object.entries(TOPICS_BY_CATEGORY)) {
    console.log(`\n📂 Category: ${category.toUpperCase()}`);
    
    for (const topic of topics) {
      console.log(`   📖 Fetching: ${topic}`);
      
      const article = await fetchWikipediaArticle(topic);
      if (!article) {
        console.log(`   ⚠️ Skipped: ${topic}`);
        continue;
      }

      try {
        const extracted = await gemini.extractConcepts(article.title, article.content);
        
        const doc = {
          id: `doc_${String(docId).padStart(3, '0')}`,
          title: article.title,
          url: article.url,
          summary: extracted.summary,
          concepts: extracted.concepts,
          difficulty: DIFFICULTY_MAP[category] || 'intermediate',
          category: category,
          source: 'wikipedia',
        };

        documents.push(doc);
        console.log(`   ✅ ${doc.title} [${doc.difficulty}]`);

        docId++;
        await delay(400);
      } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`);
      }
    }
  }

  console.log(`\n📦 Processed ${documents.length} documents\n`);

  console.log('📤 Uploading to Meilisearch...');
  await meilisearch.addDocuments(documents);
  console.log('   ✅ Done\n');

  console.log('📤 Uploading to Qdrant...');
  for (const doc of documents) {
    const text = `${doc.title}. ${doc.summary}. ${doc.concepts.join(', ')}`;
    const vector = await gemini.getEmbedding(text);
    
    await qdrant.upsertDocuments([{
      id: parseInt(doc.id.split('_')[1]),
      vector,
      payload: {
        docId: doc.id,
        title: doc.title,
        concepts: doc.concepts,
        difficulty: doc.difficulty,
        category: doc.category,
      },
    }]);
  }
  console.log('   ✅ Done\n');

  console.log('📤 Building graph in Memgraph...');
  for (const doc of documents) {
    await memgraph.addDocumentWithConcepts(doc);
  }
  console.log('   ✅ Done\n');

  console.log('🎉 Ingestion complete!');
  console.log(`   📚 ${documents.length} documents indexed`);
  
  await memgraph.close();
  process.exit(0);
};

ingest().catch(error => {
  console.error('❌ Failed:', error);
  process.exit(1);
});