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

//       const graph = buildGraphFromResults(results);
//       setGraphData(graph);
//     } catch (error) {
//       console.error('Search failed:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleNodeClick = (nodeData) => {
//     // Find full doc from search results
//     const doc = searchResults.find((d) => d.id === nodeData.id);

//     setSelectedNode({
//       id: nodeData.id,
//       label: nodeData.label || doc?.title || nodeData.id,
//       difficulty: nodeData.difficulty || doc?.difficulty,
//       order: nodeData.order,
//       doc: doc || null,
//     });
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
//         <div className={`flex-1 relative transition-all duration-300 ${selectedNode ? 'mr-96' : ''}`}>
//           {currentQuery && (
//             <div className="absolute top-4 left-4 z-10 bg-gray-900/80 px-3 py-1 rounded-full text-sm">
//               Results for: <span className="font-semibold text-yellow-400">{currentQuery}</span>
//               <span className="ml-2 text-gray-400">({searchResults.length} found)</span>
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

//           {/* Click hint */}
//           {searchResults.length > 0 && !selectedNode && (
//             <div className="absolute bottom-4 right-4 z-10 bg-gray-900/80 px-3 py-2 rounded-lg text-sm text-gray-400">
//               👆 Click a node to see details
//             </div>
//           )}
//         </div>

//         {/* Detail Panel - Fixed Right Side */}
//         {selectedNode && (
//           <div className="absolute top-0 right-0 h-full w-96 z-20">
//             <DetailPanel node={selectedNode} onClose={handleCloseDetail} />
//           </div>
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

import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import ConstellationGraph from '../components/ConstellationGraph';
import ChatSidebar from '../components/ChatSidebar';
import DetailPanel from '../components/DetailPanel';
import Galaxy from '../components/Galaxy';
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
    <div className="min-h-screen w-full bg-gradient-to-b from-[#070417] to-[#060612] text-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="z-30 relative flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600/40 to-violet-500/20 border border-white/6 shadow-sm">
            <span className="text-lg">🐝</span>
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight">Hivemind</h1>
            <div className="text-xs text-indigo-200/60 -mt-0.5">Explore. Connect. Understand.</div>
          </div>
        </div>

        <div className="flex-1 max-w-2xl mx-6">
          <div className="bg-white/3 backdrop-blur-md border border-white/6 rounded-2xl px-4 py-2 shadow-[0_8px_30px_rgba(79,70,229,0.12)]">
            <SearchBar onSearch={handleSearch} loading={loading} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-slate-300 hidden sm:block">Context: {searchResults.length}</div>
          <button
            className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600/30 to-violet-500/20 border border-white/6 flex items-center justify-center text-lg shadow hover:translate-y-[-2px] transition-transform"
            onClick={() => setChatOpen(!chatOpen)}
            aria-label="Toggle chat sidebar"
          >
            💬
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 relative flex overflow-hidden">
        {/* Graph area */}
        <div className={`flex-1 relative transition-all duration-300 ${selectedNode ? 'pr-96' : ''}`}>
          {/* Galaxy background fills the graph area */}
          <div className="absolute inset-0 z-0">
            <Galaxy
              mouseRepulsion={true}
              mouseInteraction={true}
              density={1.2}
              glowIntensity={0.45}
              saturation={0.8}
              hueShift={240}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30 pointer-events-none" />
          </div>

          {/* Overlay container for content */}
          <div className="relative z-10 w-full h-full flex flex-col">
            {/* Top badge / query info */}
            {currentQuery && (
              <div className="absolute top-5 left-5 z-20">
                <div className="inline-flex items-center gap-3 bg-white/4 backdrop-blur-md border border-white/8 px-3 py-2 rounded-full text-sm">
                  <span className="text-indigo-200/90 font-medium">Results for</span>
                  <span className="font-semibold text-yellow-400">{currentQuery}</span>
                  <span className="text-gray-300">({searchResults.length})</span>
                </div>
              </div>
            )}

            {/* Empty state */}
            {searchResults.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center px-6 text-center">
                <div className="text-indigo-300/70 text-7xl mb-4">🔎</div>
                <div className="text-lg font-semibold text-slate-200 mb-2">Search to begin exploring ideas</div>
                <div className="text-sm text-slate-400 max-w-xl">
                  Try queries like <span className="text-indigo-200 font-medium">"machine learning"</span>, <span className="text-indigo-200 font-medium">"quantum entanglement"</span>, or <span className="text-indigo-200 font-medium">"calculus"</span>.
                </div>

                <div className="mt-6 flex gap-3">
                  <div className="px-3 py-1 rounded-full bg-white/5 text-xs">Concept Map</div>
                  <div className="px-3 py-1 rounded-full bg-white/5 text-xs">AI Chat</div>
                  <div className="px-3 py-1 rounded-full bg-white/5 text-xs">Snippets</div>
                </div>
              </div>
            ) : (
              <div className="h-full">
                <ConstellationGraph
                  data={graphData}
                  onNodeClick={handleNodeClick}
                  selectedId={selectedNode?.id}
                />
              </div>
            )}

            {/* Legend */}
            {searchResults.length > 0 && (
              <div className="absolute bottom-6 left-6 z-20">
                <div className="flex items-center gap-3 bg-white/6 backdrop-blur rounded-lg px-3 py-2 border border-white/8 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 shadow" />
                    <span className="text-slate-200">Beginner</span>
                  </div>
                  <div className="flex items-center gap-3 pl-4">
                    <span className="w-3 h-3 rounded-full bg-yellow-400 shadow" />
                    <span className="text-slate-200">Intermediate</span>
                  </div>
                  <div className="flex items-center gap-3 pl-4">
                    <span className="w-3 h-3 rounded-full bg-rose-400 shadow" />
                    <span className="text-slate-200">Advanced</span>
                  </div>
                </div>
              </div>
            )}

            {/* Click hint */}
            {searchResults.length > 0 && !selectedNode && (
              <div className="absolute bottom-6 right-6 z-20">
                <div className="bg-white/6 backdrop-blur-md border border-white/8 px-3 py-2 rounded-lg text-sm text-gray-200">
                  👆 Click any node to open details
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Detail Panel */}
        {selectedNode && (
          <div className="absolute top-0 right-0 h-full w-96 z-30">
            <div className="h-full bg-gradient-to-b from-white/3 to-white/2 backdrop-blur-lg border-l border-white/8 shadow-xl">
              <DetailPanel node={selectedNode} onClose={handleCloseDetail} />
            </div>
          </div>
        )}
      </main>

      {/* Chat Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 z-40 transform transition-transform duration-300 ${
          chatOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full bg-gradient-to-b from-[#0b0a12]/90 to-[#070617]/95 border-l border-white/6 shadow-2xl">
          <ChatSidebar context={searchResults} onClose={() => setChatOpen(false)} />
        </div>
      </div>

      {/* Overlay when chat open */}
      {chatOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setChatOpen(false)}
        />
      )}
    </div>
  );
}

export default Home;
