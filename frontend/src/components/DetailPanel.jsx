// function DetailPanel({ node, onClose }) {
//   const getDifficultyColor = (difficulty) => {
//     switch (difficulty) {
//       case 'beginner':
//         return '#22c55e';
//       case 'intermediate':
//         return '#eab308';
//       case 'advanced':
//         return '#ef4444';
//       default:
//         return '#64748b';
//     }
//   };

//   const doc = node.doc;

//   return (
//     <div className="detail-panel">
//       <button className="detail-close" onClick={onClose}>
//         ✕
//       </button>

//       <div className="detail-header">
//         <span
//           className="detail-order"
//           style={{ backgroundColor: getDifficultyColor(node.difficulty) }}
//         >
//           #{node.order}
//         </span>
//         <h2>{node.label}</h2>
//         <span
//           className="detail-badge"
//           style={{ backgroundColor: getDifficultyColor(node.difficulty) }}
//         >
//           {node.difficulty}
//         </span>
//       </div>

//       {doc ? (
//         <div className="detail-content">
//           <p className="detail-summary">{doc.summary}</p>

//           <div className="detail-concepts">
//             <strong>Related concepts:</strong>
//             <div className="concept-list">
//               {doc.concepts?.map((concept) => (
//                 <span key={concept} className="concept-chip">
//                   {concept}
//                 </span>
//               ))}
//             </div>
//           </div>

//           <div className="detail-source">
//             <span>Source: {doc.source}</span>
//           </div>

//           <a
//             href={doc.url}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="detail-link"
//           >
//             Read full article →
//           </a>
//         </div>
//       ) : (
//         <div className="detail-content">
//           <p className="detail-empty">
//             Search for this topic to see more details.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default DetailPanel;

function DetailPanel({ node, onClose }) {
  const doc = node.doc;

  const getDifficultyStyle = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-500 text-white';
      case 'intermediate':
        return 'bg-yellow-500 text-black';
      case 'advanced':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="w-96 h-full bg-gray-900 border-l border-gray-800 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <span
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${getDifficultyStyle(node.difficulty)}`}
          >
            {node.order}
          </span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyStyle(node.difficulty)}`}>
            {node.difficulty}
          </span>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Title */}
        <h2 className="text-xl font-bold mb-4">{node.label}</h2>

        {doc ? (
          <>
            {/* Summary */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">Summary</h3>
              <p className="text-gray-300 leading-relaxed">{doc.summary}</p>
            </div>

            {/* Concepts */}
            {doc.concepts && doc.concepts.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-400 mb-2">Related Concepts</h3>
                <div className="flex flex-wrap gap-2">
                  {doc.concepts.map((concept) => (
                    <span
                      key={concept}
                      className="px-2 py-1 bg-gray-800 rounded-full text-xs text-gray-300"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Source */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">Source</h3>
              <span className="px-2 py-1 bg-blue-900/50 text-blue-400 rounded text-xs">
                {doc.source}
              </span>
            </div>

            {/* Divider */}
            <hr className="border-gray-800 my-4" />

            {/* Link */}
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 rounded-lg text-center font-medium transition-colors"
            >
              Read Full Article →
            </a>
          </>
        ) : (
          <div className="text-gray-500 text-center py-8">
            <p>No additional details available.</p>
            <p className="text-sm mt-2">Try searching for this topic.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DetailPanel;