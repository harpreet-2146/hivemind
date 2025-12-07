function DetailPanel({ node, onClose, onAskAI }) {
  const doc = node.doc;

  const getDifficultyStyle = (difficulty) => {
    switch (difficulty) {
      case "beginner":
        return "bg-emerald-500 text-white";
      case "intermediate":
        return "bg-amber-400 text-black";
      case "advanced":
        return "bg-rose-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <aside className="w-96 h-full relative z-40">
      {/* Glass Background */}
      <div
        className="
          absolute inset-0 bg-white/5 backdrop-blur-xl
          border-l border-white/10 shadow-xl
        "
      />

      <div className="relative z-10 h-full flex flex-col">
        {/* HEADER */}
        <header className="px-5 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div
              className={`
                w-10 h-10 rounded-full flex items-center justify-center
                text-sm font-semibold shadow
                ${getDifficultyStyle(node.difficulty)}
              `}
            >
              {node.order}
            </div>

            <div>
              <h2 className="text-white text-sm font-bold truncate max-w-[180px]">
                {node.label}
              </h2>
              <span
                className={`
                  text-xs px-2 py-0.5 rounded-full mt-1 inline-block 
                  ${getDifficultyStyle(node.difficulty)}
                `}
              >
                {node.difficulty}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="
              w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20
              flex items-center justify-center text-white transition
            "
          >
            ✕
          </button>
        </header>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          {/* Title */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">{node.label}</h3>
            <p className="text-slate-300 leading-relaxed">
              {doc?.summary || "No summary available."}
            </p>
          </div>

          {/* Concepts */}
          {doc?.concepts?.length > 0 && (
            <div>
              <h4 className="text-xs text-slate-400 mb-2">Related Concepts</h4>
              <div className="flex flex-wrap gap-2">
                {doc.concepts.map((concept) => (
                  <span
                    key={concept}
                    className="
                      text-xs px-3 py-1 rounded-full
                      bg-white/10 border border-white/10
                      text-indigo-200 hover:bg-white/20 transition
                    "
                  >
                    {concept}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Source */}
          <div>
            <h4 className="text-xs text-slate-400 mb-2">Source</h4>
            <span className="text-xs px-2 py-1 rounded bg-indigo-900/40 text-indigo-200">
              {doc?.source || "Unknown"}
            </span>
          </div>

          <hr className="border-white/10" />

          {/* Read Article Button — GLASSY INDIGO */}
          {doc?.url && (
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="
                block w-full text-center py-3 rounded-lg font-semibold
                bg-gradient-to-br from-indigo-500/60 to-violet-500/60
                hover:from-indigo-600 hover:to-violet-600
                backdrop-blur-xl text-white shadow-lg border border-white/10
                transition
              "
            >
              Read Full Article →
            </a>
          )}
        </div>
      </div>

      <style>{`
        aside ::-webkit-scrollbar { width: 8px; }
        aside ::-webkit-scrollbar-thumb {
          background: rgba(120, 120, 255, 0.25);
          border-radius: 999px;
        }
      `}</style>
    </aside>
  );
}

export default DetailPanel;
