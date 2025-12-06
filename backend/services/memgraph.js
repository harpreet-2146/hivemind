const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
  process.env.MEMGRAPH_URI,
  neo4j.auth.basic(process.env.MEMGRAPH_USERNAME, process.env.MEMGRAPH_PASSWORD)
);

const initGraph = async () => {
  const session = driver.session();
  try {
    // Create indexes for faster lookups
    await session.run('CREATE INDEX ON :Concept(name)');
    await session.run('CREATE INDEX ON :Document(id)');
    console.log('✅ Memgraph ready');
  } catch (error) {
    // Indexes might already exist, that's fine
    console.log('✅ Memgraph connected');
  } finally {
    await session.close();
  }
};

const addDocumentWithConcepts = async (doc) => {
  const session = driver.session();
  try {
    // Create document node
    await session.run(
      `MERGE (d:Document {id: $id})
       SET d.title = $title, d.difficulty = $difficulty, d.url = $url`,
      { id: doc.id, title: doc.title, difficulty: doc.difficulty, url: doc.url }
    );

    // Create concept nodes and link to document
    for (const concept of doc.concepts) {
      await session.run(
        `MERGE (c:Concept {name: $concept})
         SET c.difficulty = $difficulty
         MERGE (d:Document {id: $docId})
         MERGE (d)-[:COVERS]->(c)`,
        { concept: concept.toLowerCase(), difficulty: doc.difficulty, docId: doc.id }
      );
    }

    // Link related concepts (concepts in same doc are related)
    if (doc.concepts.length > 1) {
      for (let i = 0; i < doc.concepts.length; i++) {
        for (let j = i + 1; j < doc.concepts.length; j++) {
          await session.run(
            `MATCH (c1:Concept {name: $concept1})
             MATCH (c2:Concept {name: $concept2})
             MERGE (c1)-[:RELATED_TO]-(c2)`,
            { 
              concept1: doc.concepts[i].toLowerCase(), 
              concept2: doc.concepts[j].toLowerCase() 
            }
          );
        }
      }
    }
  } finally {
    await session.close();
  }
};

const getConceptGraph = async (conceptName) => {
  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (c:Concept {name: $concept})-[r:RELATED_TO]-(related:Concept)
       RETURN c, related, r
       LIMIT 50`,
      { concept: conceptName.toLowerCase() }
    );

    const nodes = new Map();
    const edges = [];

    result.records.forEach(record => {
      const source = record.get('c').properties;
      const target = record.get('related').properties;

      nodes.set(source.name, { id: source.name, difficulty: source.difficulty });
      nodes.set(target.name, { id: target.name, difficulty: target.difficulty });
      edges.push({ from: source.name, to: target.name, relation: 'RELATED_TO' });
    });

    return {
      nodes: Array.from(nodes.values()),
      edges,
    };
  } finally {
    await session.close();
  }
};

const getFullGraph = async (limit = 100) => {
  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (c1:Concept)-[r:RELATED_TO]-(c2:Concept)
       RETURN c1, c2, r
       LIMIT $limit`,
      { limit: neo4j.int(limit) }
    );

    const nodes = new Map();
    const edges = [];

    result.records.forEach(record => {
      const c1 = record.get('c1').properties;
      const c2 = record.get('c2').properties;

      nodes.set(c1.name, { id: c1.name, difficulty: c1.difficulty });
      nodes.set(c2.name, { id: c2.name, difficulty: c2.difficulty });
      edges.push({ from: c1.name, to: c2.name });
    });

    return {
      nodes: Array.from(nodes.values()),
      edges,
    };
  } finally {
    await session.close();
  }
};

const close = async () => {
  await driver.close();
};

module.exports = {
  driver,
  initGraph,
  addDocumentWithConcepts,
  getConceptGraph,
  getFullGraph,
  close,
};