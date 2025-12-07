import { useRef, useEffect, useState } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';

const DIFF_COLOR = {
  beginner: '#22c55e',
  intermediate: '#eab308',
  advanced: '#ef4444',
};

function ConstellationGraph({ data, onNodeClick, selectedId }) {
  const cyRef = useRef(null);
  const [initialized, setInitialized] = useState(false);

  const elements = [
    ...(data.nodes || []).map((node) => ({
      data: {
        id: node.id,
        label: String(node.order),
        title: node.label,
        difficulty: node.difficulty,
        order: node.order,
        color: DIFF_COLOR[node.difficulty] || '#64748b',
      },
    })),
    ...(data.edges || []).map((edge, i) => ({
      data: {
        id: `e${i}`,
        source: edge.from,
        target: edge.to,
        weight: edge.weight || 1,
      },
    })),
  ];

  const stylesheet = [
    {
      selector: 'node',
      style: {
        'background-color': 'data(color)',
        'background-opacity': 0.9,
        label: 'data(label)',
        color: '#fff',
        'text-valign': 'center',
        'text-halign': 'center',
        'font-size': 16,
        'font-weight': 'bold',
        width: 50,
        height: 50,
        'border-width': 3,
        'border-color': 'rgba(255,255,255,0.4)',
      },
    },
    {
      selector: 'node:hover',
      style: {
        width: 60,
        height: 60,
        'border-color': '#fff',
        'border-width': 4,
      },
    },
    {
      selector: 'node:selected',
      style: {
        width: 65,
        height: 65,
        'border-color': '#fff',
        'border-width': 5,
      },
    },
    {
      selector: 'edge',
      style: {
        width: 2,
        'line-color': 'rgba(148, 163, 184, 0.5)',
        'curve-style': 'bezier',
      },
    },
  ];

  const layout = {
    name: 'cose',
    animate: true,
    animationDuration: 600,
    nodeRepulsion: () => 10000,
    idealEdgeLength: () => 150,
    gravity: 0.3,
    numIter: 800,
    padding: 60,
  };

  const handleCyInit = (cy) => {
    cyRef.current = cy;

    cy.on('tap', 'node', (e) => {
      const n = e.target;
      onNodeClick({
        id: n.data('id'),
        label: n.data('title'),
        difficulty: n.data('difficulty'),
        order: n.data('order'),
      });
    });

    cy.on('mouseover', 'node', (e) => {
      const n = e.target;
      n.style('label', n.data('title'));
      n.connectedEdges().style({ 'line-color': '#fff', width: 3 });
    });

    cy.on('mouseout', 'node', (e) => {
      const n = e.target;
      n.style('label', n.data('label'));
      n.connectedEdges().style({ 'line-color': 'rgba(148, 163, 184, 0.5)', width: 2 });
    });
  };

  // Only run layout when data changes (new search), not on click
  useEffect(() => {
    if (cyRef.current && data.nodes?.length > 0) {
      cyRef.current.layout(layout).run();
      setInitialized(true);
    }
  }, [data.nodes?.length]); // Only re-layout when node count changes

  return (
    <div className="w-full h-full bg-gradient-to-b from-gray-950 to-gray-900">
      <CytoscapeComponent
        elements={elements}
        stylesheet={stylesheet}
        layout={initialized ? { name: 'preset' } : layout}
        style={{ width: '100%', height: '100%' }}
        cy={handleCyInit}
        wheelSensitivity={0.2}
        boxSelectionEnabled={false}
      />
    </div>
  );
}

export default ConstellationGraph;