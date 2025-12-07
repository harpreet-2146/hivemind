import { useRef, useEffect, useState } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import Galaxy from '../components/Galaxy';

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
        shape: 'ellipse',              // 🔵 circular node
        'background-color': 'data(color)',
        'background-opacity': 0.95,
        label: 'data(label)',
        color: '#ffffff',
        'text-valign': 'center',
        'text-halign': 'center',
        'font-size': 18,
        'font-weight': '700',
        width: 80,                      // 🔵 bigger node
        height: 80,
        'border-width': 3,
        'border-color': 'rgba(255,255,255,0.35)',
        'text-outline-color': 'rgba(0,0,0,0.55)',
        'text-outline-width': 6,
      },
    },
    {
      selector: 'node:hover',
      style: {
        width: 95,                    
        height: 95,
        'border-color': '#ffffff',
        'border-width': 4,
        'font-size': 20,
      },
    },
    {
      selector: 'node:selected',
      style: {
        width: 105,
        height: 105,
        'border-color': '#ffffff',
        'border-width': 4,
        'font-size': 22,
      },
    },
    {
      selector: 'edge',
      style: {
        width: 2.5,
        'line-color': 'rgba(148, 163, 184, 0.45)',
        'curve-style': 'bezier',
        opacity: 1,
      },
    },
    {
      selector: 'edge.highlight',
      style: {
        'line-color': '#fff',
        width: 3.5,
      },
    },
  ];

  // 🔵 UI tweak: bring nodes closer together
  const layout = {
    name: 'cose',
    animate: true,
    animationDuration: 600,

    nodeRepulsion: () => 6000,    // closer
    idealEdgeLength: () => 80,    // closer graph spacing
    gravity: 1,                   // pull inward more
    numIter: 800,
    padding: 20,                 // less padding → zoomed-in feel
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
      n.connectedEdges().addClass('highlight');
    });

    cy.on('mouseout', 'node', (e) => {
      const n = e.target;
      n.style('label', n.data('label'));
      n.connectedEdges().removeClass('highlight');
    });
  };

  useEffect(() => {
    if (cyRef.current && data.nodes?.length > 0) {
      const cy = cyRef.current;

      cy.layout(layout).run();
      setInitialized(true);

      // 🔵 auto zoom-in for closer view (safe)
      cy.zoom({
        level: 1.2,
        renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 }
      });

      // optional: focus selected node slightly
      if (selectedId) {
        const node = cy.$id(selectedId);
        if (node && node.length) {
          cy.animate({
            fit: { eles: node, padding: 120 },
            duration: 400,
          });
        }
      }
    }
  }, [data.nodes?.length]);

  return (
    <div className="w-full h-full relative">
      <div className="absolute inset-0 z-0">
        <Galaxy
          mouseRepulsion={false}
          mouseInteraction={false}
          density={0.9}
          glowIntensity={0.25}
          saturation={0.7}
          hueShift={220}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/42 via-transparent to-black/30 pointer-events-none" />
      </div>

      <div className="absolute inset-0 z-10 rounded-lg overflow-hidden">
        <CytoscapeComponent
          elements={elements}
          stylesheet={stylesheet}
          layout={initialized ? { name: 'preset' } : layout}
          style={{ width: '100%', height: '100%' }}
          cy={handleCyInit}
          wheelSensitivity={0.18}
          boxSelectionEnabled={false}
        />
      </div>
    </div>
  );
}

export default ConstellationGraph;
