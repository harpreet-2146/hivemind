// function ResultCard({ doc, onConceptClick }) {
//   const getDifficultyColor = (difficulty) => {
//     switch (difficulty) {
//       case 'beginner':
//         return '#4ade80';
//       case 'intermediate':
//         return '#fbbf24';
//       case 'advanced':
//         return '#f87171';
//       default:
//         return '#94a3b8';
//     }
//   };

//   return (
//     <div className="result-card">
//       <div className="result-header">
//         <a href={doc.url} target="_blank" rel="noopener noreferrer">
//           <h3>{doc.title}</h3>
//         </a>
//         <span
//           className="difficulty-badge"
//           style={{ backgroundColor: getDifficultyColor(doc.difficulty) }}
//         >
//           {doc.difficulty}
//         </span>
//       </div>

//       {doc.summary && <p className="result-summary">{doc.summary}</p>}

//       <div className="concept-tags">
//         {doc.concepts?.map((concept) => (
//           <span
//             key={concept}
//             className="concept-tag"
//             onClick={() => onConceptClick(concept)}
//           >
//             {concept}
//           </span>
//         ))}
//       </div>

//       <div className="result-meta">
//         <span className="source">{doc.source}</span>
//       </div>
//     </div>
//   );
// }

// export default ResultCard;

import React from 'react';

function ResultCard({ doc, onConceptClick }) {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return '#4ade80';
      case 'intermediate':
        return '#fbbf24';
      case 'advanced':
        return '#f87171';
      default:
        return '#94a3b8';
    }
  };

  return (
    <div
      className="
        relative w-full rounded-2xl border border-white/8
        bg-gradient-to-b from-white/6 to-white/3/5
        backdrop-blur-lg px-5 py-4
        transition-transform transform hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(79,70,229,0.12)]
      "
      role="article"
      aria-label={doc.title}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <a
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <h3 className="text-lg font-semibold text-white truncate">
              {doc.title}
            </h3>
          </a>

          <div className="mt-1 flex items-center gap-3 text-sm">
            <span className="text-xs text-indigo-200/60">{doc.source}</span>
            {doc.difficulty && (
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${getDifficultyColor(doc.difficulty)}22`,
                  color: getDifficultyColor(doc.difficulty),
                  border: `1px solid ${getDifficultyColor(doc.difficulty)}40`,
                }}
              >
                {doc.difficulty}
              </span>
            )}
          </div>
        </div>

        <div className="flex-shrink-0">
          <a
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center justify-center px-3 py-1 rounded-md
              bg-indigo-600/80 hover:bg-indigo-500 text-white text-sm font-semibold
              border border-white/6 shadow-sm
            "
            aria-label={`Open ${doc.title}`}
          >
            Open
          </a>
        </div>
      </div>

      {doc.summary && (
        <p className="mt-4 text-sm text-slate-200 leading-relaxed max-w-full">
          {doc.summary}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {doc.concepts?.map((concept) => (
          <button
            key={concept}
            onClick={() => onConceptClick(concept)}
            className="
              cursor-pointer text-sm px-3 py-1 rounded-full
              bg-white/6 hover:bg-white/8 text-indigo-100/95
              border border-white/6 transition
            "
            aria-label={`Explore concept ${concept}`}
            type="button"
          >
            {concept}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-white/10" />
          <span>{doc.category || '—'}</span>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400">Source</span>
          <div className="text-xs text-indigo-200">{doc.source}</div>
        </div>
      </div>
    </div>
  );
}

export default ResultCard;
