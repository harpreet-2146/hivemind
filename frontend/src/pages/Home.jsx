// import { useState, useEffect } from 'react';
// import SearchBar from '../components/SearchBar';
// import ConstellationGraph from '../components/ConstellationGraph';
// import ChatSidebar from '../components/ChatSidebar';
// import ResultCard from '../components/ResultCard';
// import { searchDocuments, getGraph } from '../services/api';

// function Home() {
//   const [searchResults, setSearchResults] = useState([]);
//   const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
//   const [selectedConcept, setSelectedConcept] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     loadInitialGraph();
//   }, []);

//   const loadInitialGraph = async () => {
//     try {
// //       const data = await getGraph();
// //       setGraphData(data);
// //     } catch (error) {
// //       console.error('Failed to load graph:', error);
// //     }
// //   };

// //   const handleSearch = async (query) => {
// //     if (!query.trim()) return;

// //     setLoading(true);
// //     try {
// //       const results = await searchDocuments(query);
// //       setSearchResults(results);
// //     } catch (error) {
// //       console.error('Search failed:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleNodeClick = async (concept) => {
// //     setSelectedConcept(concept);
// //     try {
// //       const data = await getGraph(concept);
// //       setGraphData(data);
// //     } catch (error) {
// //       console.error('Failed to load concept graph:', error);
// //     }
// //   };

// //   const handleConceptTag = (concept) => {
// //     handleNodeClick(concept);
// //   };

// //   return (
// //     <div className="home">
// //       <header className="home-header">
// //         <h1>🐝 Hivemind</h1>
// //         <SearchBar onSearch={handleSearch} loading={loading} />
// //       </header>

// //       <main className="home-main">
// //         <aside className="results-panel">
// //           <h2>Results</h2>
// //           {searchResults.length === 0 ? (
// //             <p className="empty">Search to discover knowledge</p>
// //           ) : (
// //             <div className="results-list">
// //               {searchResults.map((doc) => (
// //                 <ResultCard
// //                   key={doc.id}
// //                   doc={doc}
// //                   onConceptClick={handleConceptTag}
// //                 />
// //               ))}
// //             </div>
// //           )}
// //         </aside>

// //         <section className="graph-panel">
// //           <ConstellationGraph
// //             data={graphData}
// //             onNodeClick={handleNodeClick}
// //             selectedConcept={selectedConcept}
// //           />
// //           {selectedConcept && (
// //             <div className="selected-concept">
// //               Viewing: <strong>{selectedConcept}</strong>
// //               <button onClick={loadInitialGraph}>Reset</button>
// //             </div>
// //           )}
// //         </section>

// //         <aside className="chat-panel">
// //           <ChatSidebar context={searchResults} />
// //         </aside>
// //       </main>
// //     </div>
// //   );
// // }

// // export default Home;
// import { useState } from 'react';
// import SearchBar from '../components/SearchBar';
// import ConstellationGraph from '../components/ConstellationGraph';
// import ChatSidebar from '../components/ChatSidebar';
// import DetailPanel from '../components/DetailPanel';
// import { searchDocuments, buildGraphFromResults } from '../services/api';

// function Home() {
//   const [searchResults, setSearchResults] = useState([]);
//   const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
//   const [selectedNode, setSelectedNode] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [chatOpen, setChatOpen] = useState(false);
//   const [currentQuery, setCurrentQuery] = useState('');

//   const handleSearch = async (query) => {
//     if (!query.trim()) return;

//     setLoading(true);
//     setCurrentQuery(query);
//     setSelectedNode(null);

//     try {
//       const results = await searchDocuments(query);
//       setSearchResults(results);

//       // Build graph directly from search results
//       const graph = buildGraphFromResults(results);
//       setGraphData(graph);
//     } catch (error) {
//       console.error('Search failed:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleNodeClick = (nodeData) => {
//     // nodeData comes from graph click - find full doc
//     const doc = searchResults.find((d) => d.id === nodeData.id);
    
//     if (doc) {
//       setSelectedNode({
//         id: doc.id,
//         label: doc.title,
//         difficulty: doc.difficulty,
//         order: nodeData.order,
//         doc: doc,
//       });
//     } else {
//       setSelectedNode({
//         ...nodeData,
//         doc: null,
//       });
//     }
//   };

//   const handleCloseDetail = () => {
//     setSelectedNode(null);
//   };

//   return (
//     <div className="h-screen w-screen bg-gray-950 text-white flex flex-col overflow-hidden">
//       {/* Header */}
//       <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
//         <div className="flex items-center gap-2">
//           <span className="text-2xl">🐝</span>
//           <h1 className="text-xl font-bold">Hivemind</h1>
//         </div>

//         <div className="flex-1 max-w-xl mx-8">
//           <SearchBar onSearch={handleSearch} loading={loading} />
//         </div>

//         <button
//           className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-lg"
//           onClick={() => setChatOpen(!chatOpen)}
//         >
//           💬
//         </button>
//       </header>

//       {/* Main Content */}
//       <main className="flex-1 flex relative overflow-hidden">
//         {/* Graph Area */}
//         <div className="flex-1 relative">
//           {currentQuery && (
//             <div className="absolute top-4 left-4 z-10 bg-gray-900/80 px-3 py-1 rounded-full text-sm">
//               Results for: <span className="font-semibold text-yellow-400">{currentQuery}</span>
//             </div>
//           )}

//           {searchResults.length === 0 ? (
//             <div className="h-full flex flex-col items-center justify-center text-gray-500">
//               <span className="text-6xl mb-4">🔍</span>
//               <p className="text-lg">Search for a topic to explore</p>
//               <p className="text-sm mt-2">Try: "machine learning", "neural networks", "deep learning"</p>
//             </div>
//           ) : (
//             <ConstellationGraph
//               data={graphData}
//               onNodeClick={handleNodeClick}
//               selectedId={selectedNode?.id}
//             />
//           )}

//           {/* Legend */}
//           {searchResults.length > 0 && (
//             <div className="absolute bottom-4 left-4 z-10 flex gap-4 bg-gray-900/80 px-4 py-2 rounded-lg text-sm">
//               <div className="flex items-center gap-2">
//                 <span className="w-3 h-3 rounded-full bg-green-500"></span>
//                 <span>Beginner</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
//                 <span>Intermediate</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="w-3 h-3 rounded-full bg-red-500"></span>
//                 <span>Advanced</span>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Detail Panel - Right Side */}
//         {selectedNode && (
//           <DetailPanel node={selectedNode} onClose={handleCloseDetail} />
//         )}
//       </main>

//       {/* Chat Sidebar */}
//       <div
//         className={`fixed top-0 right-0 h-full w-80 bg-gray-900 border-l border-gray-800 transform transition-transform duration-300 z-50 ${
//           chatOpen ? 'translate-x-0' : 'translate-x-full'
//         }`}
//       >
//         <ChatSidebar context={searchResults} onClose={() => setChatOpen(false)} />
//       </div>

//       {/* Overlay */}
//       {chatOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 z-40"
//           onClick={() => setChatOpen(false)}
//         />
//       )}
//     </div>
//   );
// }

// export default Home;

// import { useState, useEffect } from 'react';
// import SearchBar from '../components/SearchBar';
// import ConstellationGraph from '../components/ConstellationGraph';
// import ChatSidebar from '../components/ChatSidebar';
// import DetailPanel from '../components/DetailPanel';
// import { searchDocuments, getGraph } from '../services/api';

// function Home() {
//   const [searchResults, setSearchResults] = useState([]);
//   const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
//   const [selectedNode, setSelectedNode] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [chatOpen, setChatOpen] = useState(false);
//   const [currentQuery, setCurrentQuery] = useState('');

//   useEffect(() => {
//     loadInitialGraph();
//   }, []);

//   const loadInitialGraph = async () => {
//     try {
//       const data = await getGraph();
//       setGraphData(data);
//     } catch (error) {
//       console.error('Failed to load graph:', error);
//     }
//   };

//   const handleSearch = async (query) => {
//     if (!query.trim()) return;

//     setLoading(true);
//     setCurrentQuery(query);
//     setSelectedNode(null);

//     try {
//       const results = await searchDocuments(query);
//       setSearchResults(results);

//       // Also refresh graph based on search
//       const graphResults = await getGraph();
//       setGraphData(graphResults);
//     } catch (error) {
//       console.error('Search failed:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleNodeClick = (nodeData) => {
//     // Find the full document info from search results
//     const doc = searchResults.find(
//       (d) => d.title.toLowerCase() === nodeData.label.toLowerCase() ||
//              d.concepts?.some(c => c.toLowerCase() === nodeData.label.toLowerCase())
//     );

//     setSelectedNode({
//       ...nodeData,
//       doc: doc || null,
//     });
//   };

//   const handleCloseDetail = () => {
//     setSelectedNode(null);
//   };

//   return (
//     <div className="home-container">
//       {/* Header */}
//       <header className="home-header">
//         <div className="logo">
//           <span className="logo-icon">🐝</span>
//           <h1>Hivemind</h1>
//         </div>

//         <div className="search-wrapper">
//           <SearchBar onSearch={handleSearch} loading={loading} />
//         </div>

//         <button
//           className="chat-toggle"
//           onClick={() => setChatOpen(!chatOpen)}
//         >
//           💬
//         </button>
//       </header>

//       {/* Main Content */}
//       <main className="home-main">
//         {/* Constellation Graph - Center */}
//         <div className="graph-container">
//           <ConstellationGraph
//             data={graphData}
//             onNodeClick={handleNodeClick}
//             selectedConcept={selectedNode?.id}
//           />

//           {currentQuery && (
//             <div className="search-info">
//               Showing results for: <strong>{currentQuery}</strong>
//             </div>
//           )}
//         </div>

//         {/* Detail Panel - Bottom */}
//         {selectedNode && (
//           <DetailPanel
//             node={selectedNode}
//             onClose={handleCloseDetail}
//           />
//         )}
//       </main>

//       {/* Chat Sidebar - Slides from right */}
//       <div className={`chat-container ${chatOpen ? 'open' : ''}`}>
//         <ChatSidebar
//           context={searchResults}
//           onClose={() => setChatOpen(false)}
//         />
//       </div>

//       {/* Overlay when chat is open */}
//       {chatOpen && (
//         <div className="overlay" onClick={() => setChatOpen(false)} />
//       )}
//     </div>
//   );
// }

// export default Home;

import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import ConstellationGraph from '../components/ConstellationGraph';
import ChatSidebar from '../components/ChatSidebar';
import DetailPanel from '../components/DetailPanel';
import { searchDocuments, buildGraphFromResults } from '../services/api';

function Home() {
  const [searchResults, setSearchResults] = useState([]);
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');

  const handleSearch = async (query) => {
    if (!query.trim()) return;

    setLoading(true);
    setCurrentQuery(query);
    setSelectedNode(null);

    try {
      const results = await searchDocuments(query);
      setSearchResults(results);

      const graph = buildGraphFromResults(results);
      setGraphData(graph);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNodeClick = (nodeData) => {
    // Find full doc from search results
    const doc = searchResults.find((d) => d.id === nodeData.id);

    setSelectedNode({
      id: nodeData.id,
      label: nodeData.label || doc?.title || nodeData.id,
      difficulty: nodeData.difficulty || doc?.difficulty,
      order: nodeData.order,
      doc: doc || null,
    });
  };

  const handleCloseDetail = () => {
    setSelectedNode(null);
  };

  return (
    <div className="h-screen w-screen bg-gray-950 text-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐝</span>
          <h1 className="text-xl font-bold">Hivemind</h1>
        </div>

        <div className="flex-1 max-w-xl mx-8">
          <SearchBar onSearch={handleSearch} loading={loading} />
        </div>

        <button
          className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-lg"
          onClick={() => setChatOpen(!chatOpen)}
        >
          💬
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex relative overflow-hidden">
        {/* Graph Area */}
        <div className={`flex-1 relative transition-all duration-300 ${selectedNode ? 'mr-96' : ''}`}>
          {currentQuery && (
            <div className="absolute top-4 left-4 z-10 bg-gray-900/80 px-3 py-1 rounded-full text-sm">
              Results for: <span className="font-semibold text-yellow-400">{currentQuery}</span>
              <span className="ml-2 text-gray-400">({searchResults.length} found)</span>
            </div>
          )}

          {searchResults.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <span className="text-6xl mb-4">🔍</span>
              <p className="text-lg">Search for a topic to explore</p>
              <p className="text-sm mt-2">Try: "machine learning", "neural networks", "deep learning"</p>
            </div>
          ) : (
            <ConstellationGraph
              data={graphData}
              onNodeClick={handleNodeClick}
              selectedId={selectedNode?.id}
            />
          )}

          {/* Legend */}
          {searchResults.length > 0 && (
            <div className="absolute bottom-4 left-4 z-10 flex gap-4 bg-gray-900/80 px-4 py-2 rounded-lg text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span>Beginner</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span>Intermediate</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span>Advanced</span>
              </div>
            </div>
          )}

          {/* Click hint */}
          {searchResults.length > 0 && !selectedNode && (
            <div className="absolute bottom-4 right-4 z-10 bg-gray-900/80 px-3 py-2 rounded-lg text-sm text-gray-400">
              👆 Click a node to see details
            </div>
          )}
        </div>

        {/* Detail Panel - Fixed Right Side */}
        {selectedNode && (
          <div className="absolute top-0 right-0 h-full w-96 z-20">
            <DetailPanel node={selectedNode} onClose={handleCloseDetail} />
          </div>
        )}
      </main>

      {/* Chat Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-gray-900 border-l border-gray-800 transform transition-transform duration-300 z-50 ${
          chatOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <ChatSidebar context={searchResults} onClose={() => setChatOpen(false)} />
      </div>

      {/* Overlay */}
      {chatOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setChatOpen(false)}
        />
      )}
    </div>
  );
}

export default Home;