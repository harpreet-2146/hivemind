const { MeiliSearch } = require('meilisearch');

const client = new MeiliSearch({
  host: process.env.MEILI_HOST,
  apiKey: process.env.MEILI_API_KEY,
});

const INDEX_NAME = 'documents';

const initIndex = async () => {
  try {
    const index = client.index(INDEX_NAME);
    
    await index.updateSettings({
      searchableAttributes: ['title', 'summary', 'concepts'],
      filterableAttributes: ['difficulty', 'source', 'concepts', 'category'],
      sortableAttributes: ['title'],
    });
    
    console.log('✅ Meilisearch index ready');
    return index;
  } catch (error) {
    console.error('❌ Meilisearch init error:', error.message);
    throw error;
  }
};

const addDocuments = async (docs) => {
  const index = client.index(INDEX_NAME);
  const result = await index.addDocuments(docs);
  return result;
};

const search = async (query, filters = {}) => {
  const index = client.index(INDEX_NAME);
  
  const searchParams = {
    limit: 20,
    attributesToRetrieve: ['id', 'title', 'url', 'summary', 'concepts', 'difficulty', 'category', 'source'],
  };
  
  if (filters.difficulty) {
    searchParams.filter = `difficulty = "${filters.difficulty}"`;
  }
  
  if (filters.category) {
    searchParams.filter = `category = "${filters.category}"`;
  }
  
  const results = await index.search(query, searchParams);
  return results.hits;
};

module.exports = {
  client,
  initIndex,
  addDocuments,
  search,
};