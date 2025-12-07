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
    <div className="result-card">
      <div className="result-header">
        <a href={doc.url} target="_blank" rel="noopener noreferrer">
          <h3>{doc.title}</h3>
        </a>
        <span
          className="difficulty-badge"
          style={{ backgroundColor: getDifficultyColor(doc.difficulty) }}
        >
          {doc.difficulty}
        </span>
      </div>

      {doc.summary && <p className="result-summary">{doc.summary}</p>}

      <div className="concept-tags">
        {doc.concepts?.map((concept) => (
          <span
            key={concept}
            className="concept-tag"
            onClick={() => onConceptClick(concept)}
          >
            {concept}
          </span>
        ))}
      </div>

      <div className="result-meta">
        <span className="source">{doc.source}</span>
      </div>
    </div>
  );
}

export default ResultCard;