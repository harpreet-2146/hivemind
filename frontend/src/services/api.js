const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const searchDocuments = async (query) => {
  const res = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`);
  const data = await res.json();
  return data.results || [];
};

export const sendChatMessage = async (message) => {
  const res = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  return res.json();
};

export const buildGraphFromResults = (results) => {
  if (!results || results.length === 0) {
    return { nodes: [], edges: [] };
  }

  const nodes = [];
  const edges = [];
  const addedEdges = new Set();

  const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
  const sorted = [...results].sort(
    (a, b) => (difficultyOrder[a.difficulty] || 2) - (difficultyOrder[b.difficulty] || 2)
  );

  sorted.forEach((doc, index) => {
    nodes.push({
      id: doc.id,
      label: doc.title,
      difficulty: doc.difficulty,
      summary: doc.summary,
      url: doc.url,
      concepts: doc.concepts,
      source: doc.source,
      category: doc.category,
      order: index + 1,
    });
  });

  for (let i = 0; i < nodes.length - 1; i++) {
    edges.push({
      from: nodes[i].id,
      to: nodes[i + 1].id,
      weight: 2,
    });
  }

  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 2; j < sorted.length; j++) {
      const doc1 = sorted[i];
      const doc2 = sorted[j];

      const shared = doc1.concepts?.filter((c) =>
        doc2.concepts?.some((c2) => c2.toLowerCase() === c.toLowerCase())
      );

      if (shared && shared.length >= 2) {
        const edgeKey = `${doc1.id}-${doc2.id}`;
        if (!addedEdges.has(edgeKey)) {
          edges.push({
            from: doc1.id,
            to: doc2.id,
            weight: shared.length,
          });
          addedEdges.add(edgeKey);
        }
      }
    }
  }

  return { nodes, edges };
};

// const API_URL = 'http://localhost:3000';

// export const searchDocuments = async (query) => {
//   const res = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`);
//   const data = await res.json();
//   return data.results || [];
// };

// export const getGraph = async (concept = null) => {
//   const url = concept
//     ? `${API_URL}/graph?concept=${encodeURIComponent(concept)}`
//     : `${API_URL}/graph`;
//   const res = await fetch(url);
//   return res.json();
// };

// export const sendChatMessage = async (message) => {
//   const res = await fetch(`${API_URL}/chat`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ message }),
//   });
//   return res.json();
// };

// export const buildGraphFromResults = (results) => {
//   if (!results || results.length === 0) {
//     return { nodes: [], edges: [] };
//   }

//   const nodes = [];
//   const edges = [];
//   const addedEdges = new Set();

//   // Sort by difficulty: beginner -> intermediate -> advanced
//   const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
//   const sorted = [...results].sort(
//     (a, b) => (difficultyOrder[a.difficulty] || 2) - (difficultyOrder[b.difficulty] || 2)
//   );

//   // Create nodes
//   sorted.forEach((doc, index) => {
//     nodes.push({
//       id: doc.id,
//       label: doc.title,
//       difficulty: doc.difficulty,
//       summary: doc.summary,
//       url: doc.url,
//       concepts: doc.concepts,
//       source: doc.source,
//       category: doc.category,
//       order: index + 1,
//     });
//   });

//   // Create SEQUENTIAL edges (1->2->3->4...)
//   for (let i = 0; i < nodes.length - 1; i++) {
//     edges.push({
//       from: nodes[i].id,
//       to: nodes[i + 1].id,
//       weight: 2,
//     });
//   }

//   // Also connect nodes that share concepts
//   for (let i = 0; i < sorted.length; i++) {
//     for (let j = i + 2; j < sorted.length; j++) {
//       const doc1 = sorted[i];
//       const doc2 = sorted[j];

//       const shared = doc1.concepts?.filter((c) =>
//         doc2.concepts?.some((c2) => c2.toLowerCase() === c.toLowerCase())
//       );

//       if (shared && shared.length >= 2) {
//         const edgeKey = `${doc1.id}-${doc2.id}`;
//         if (!addedEdges.has(edgeKey)) {
//           edges.push({
//             from: doc1.id,
//             to: doc2.id,
//             weight: shared.length,
//           });
//           addedEdges.add(edgeKey);
//         }
//       }
//     }
//   }

//   return { nodes, edges };
// };