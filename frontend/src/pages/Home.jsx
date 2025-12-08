import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import ConstellationGraph from '../components/ConstellationGraph';
import ChatSidebar from '../components/ChatSidebar';
import VoiceChat from '../components/VoiceChat';
import LiquidEther from '../components/LiquidEther';
import DetailPanel from '../components/DetailPanel';

import { searchDocuments, buildGraphFromResults } from '../services/api';

function Home() {
  const [searchResults, setSearchResults] = useState([]);
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(false);

  // chat UI state (purely UI)
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMode, setChatMode] = useState('text'); // 'text' | 'voice'

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
          <div>
            <h1 onClick={() => window.location.href = '/'} className="text-lg font-extrabold tracking-tight">Hivemind</h1>
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

          {/* --- AI CHAT BUTTON (more descriptive + visible) --- */}
          <button
            onClick={() => {
              // open chat and default mode to text
              setChatMode('text');
              setChatOpen((s) => !s);
            }}
            aria-label="Open AI Chat"
            className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-gradient-to-br from-indigo-600/40 to-violet-500/20 border border-white/6 hover:scale-[1.02] transition transform shadow"
            title="Open AI Chat"
          >
            <span className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow">💬</span>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs text-indigo-100 font-semibold leading-tight">AI Chat</span>
              <span className="text-[11px] text-indigo-200/60">Ask Hivemind anything</span>
            </div>
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 relative flex overflow-hidden">
        {/* Graph area */}
        <div className={`flex-1 relative transition-all duration-300 ${selectedNode ? 'pr-96' : ''}`}>
          <div className="absolute inset-0 z-0">
                  <LiquidEther
                    colors={[ '#5227FF', '#FF9FFC', '#B19EEF' ]}
                    mouseForce={20}
                    cursorSize={100}
                    isViscous={false}
                    viscous={30}
                    iterationsViscous={32}
                    iterationsPoisson={32}
                    resolution={0.5}
                    isBounce={false}
                    autoDemo={true}
                    autoSpeed={0.5}
                    autoIntensity={2.2}
                    takeoverDuration={0.25}
                    autoResumeDelay={3000}
                    autoRampDuration={0.6}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40 pointer-events-none" />
                </div>

          <div className="relative z-10 w-full h-full flex flex-col">
            {currentQuery && (
              <div className="absolute top-5 left-5 z-20">
                <div className="inline-flex items-center gap-3 bg-white/4 backdrop-blur-md border border-white/8 px-3 py-2 rounded-full text-sm">
                  <span className="text-indigo-200/90 font-medium">Results for</span>
                  <span className="font-semibold text-yellow-400">{currentQuery}</span>
                  <span className="text-gray-300">({searchResults.length})</span>
                </div>
              </div>
            )}

            {searchResults.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center px-6 text-center">
                {/* <div className="text-lg font-semibold text-slate-200 mb-2">Search to begin exploring ideas</div>
                <div className="text-sm text-slate-400 max-w-xl">
                  Try queries like <span className="text-indigo-200 font-medium">"machine learning"</span>, <span className="text-indigo-200 font-medium">"quantum entanglement"</span>, or <span className="text-indigo-200 font-medium">"calculus"</span>.
                </div>

                <div className="mt-6 flex gap-3">
                  <div className="px-3 py-1 rounded-full bg-white/5 text-xs">Concept Map</div>
                  <div className="px-3 py-1 rounded-full bg-white/5 text-xs">AI Chat</div>
                  <div className="px-3 py-1 rounded-full bg-white/5 text-xs">Snippets</div>
                </div> */}
                
<div className="mt-6 flex gap-3">
  <div className="px-3 py-1 rounded-full bg-white/5 text-xs">Concept Map</div>
  <div className="px-3 py-1 rounded-full bg-white/5 text-xs">AI Chat</div>
  <div className="px-3 py-1 rounded-full bg-white/5 text-xs">Snippets</div>
</div>
<div className="text-2xl text-slate-400 max-w-xl">
  SEARCH THESE TOPICS IN THE SEARCH BAR
</div>

{/* <div className="mt-6 flex gap-3">
  <div className="px-3 py-1 rounded-full bg-white/5 text-xs">Concept Map</div>
  <div className="px-3 py-1 rounded-full bg-white/5 text-xs">AI Chat</div>
  <div className="px-3 py-1 rounded-full bg-white/5 text-xs">Snippets</div>
</div> */}

{/* --- TOPIC GRID --- */}
<div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-sm">
  {[
    "Quantum Physics",
    "Relativity",
    "Thermodynamics",
    "Electromagnetism",
    "Particle Physics",
    "Nuclear Physics",
    "Classical Mechanics",
    "Astrophysics",

    "Machine Learning",
    "Deep Learning",
    "NLP",
    "Computer Vision",
    "Reinforcement Learning",

    "Algorithms",
    "Data Structures",
    "Databases",
    "Operating Systems",
    "Computer Networks",
    "Web Development",

    "Calculus",
    "Linear Algebra",
    "Probability & Statistics",
    "Number Theory",
    "Geometry",

    "Cell Biology",
    "Genetics",
    "Evolution",
    "Microbiology",

    "Organic Chemistry",
    "Inorganic Chemistry",
    "Chemical Reactions",
    "Periodic Table",

    "Solar System",
    "Galaxies",
    "Cosmology",
    "Space Exploration",

    "World War I",
    "World War II",
    "Roman Empire",
    "Mughal Empire",
    "Industrial Revolution",
    "American Revolution",
  ].map(topic => (
    <div
      key={topic}
      className="px-3 py-2 rounded-md bg-white/5 hover:bg-white/10 
                 transition cursor-pointer text-slate-300"
    >
      {topic}
    </div>
  ))}
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

      {/* Chat / Voice Panel (UI-only) */}
      <div
        className={`fixed top-0 right-0 h-full z-40 transform transition-transform duration-300 ${
          chatOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ width: chatOpen ? 420 : 0 }} // wider panel when open (420px)
      >
        {chatOpen && (
          <div className="h-full bg-gradient-to-b from-[#0b0a12]/90 to-[#070617]/95 border-l border-white/6 shadow-2xl">
            {/* Panel Header (UI) */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-700 flex items-center justify-center text-white">AI</div>
                <div>
                  <div className="text-sm font-semibold">Hivemind AI Chat</div>
                  <div className="text-xs text-indigo-200/60">Text & Voice assistant</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Mode toggle — UI-only, uses existing components */}
                <div className="bg-white/5 rounded-full flex overflow-hidden text-xs">
                  <button
                    onClick={() => setChatMode('text')}
                    className={`px-3 py-1 ${chatMode === 'text' ? 'bg-white/10 font-semibold' : 'text-indigo-200/60'}`}
                  >
                    Text
                  </button>
                  <button
                    onClick={() => setChatMode('voice')}
                    className={`px-3 py-1 ${chatMode === 'voice' ? 'bg-white/10 font-semibold' : 'text-indigo-200/60'}`}
                  >
                    Voice
                  </button>
                </div>

                <button
                  onClick={() => setChatOpen(false)}
                  className="w-9 h-9 rounded-lg bg-white/4 hover:bg-white/6 transition flex items-center justify-center border border-white/8"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Render selected mode component (UI only) */}
            <div className="h-[calc(100%-64px)]">
              {chatMode === 'text' ? (
                <ChatSidebar context={searchResults} onClose={() => setChatOpen(false)} />
              ) : (
                <VoiceChat context={searchResults} onClose={() => setChatOpen(false)} />
              )}
            </div>
          </div>
        )}
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
