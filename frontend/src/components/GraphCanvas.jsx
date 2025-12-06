import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import * as d3 from "d3-force-3d";

function Node({ node, onClick, isFocus }) {
  const ref = useRef();

  // Smooth node movement (lerp)
  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.x += (node.x - ref.current.position.x) * 0.15;
    ref.current.position.y += (node.y - ref.current.position.y) * 0.15;
    ref.current.position.z += (node.z - ref.current.position.z) * 0.15;
  });

  return (
    <mesh
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        onClick(node);
      }}
    >
      <sphereGeometry args={[isFocus ? 1.2 : 0.8, 16, 16]} />
      <meshStandardMaterial
        color={isFocus ? "#00eaff" : "#444"}
        emissive={isFocus ? "#0099ff" : "#222"}
      />

      <Html distanceFactor={10} center>
        <div style={{ color: "white", fontSize: "12px", textAlign: "center", pointerEvents: "none" }}>
          {node.name}
        </div>
      </Html>
    </mesh>
  );
}

function ForceGraph({ nodes, links, onNodeClick, focusId }) {
  const simulation = useRef(null);

  // Run d3 force simulation
  useEffect(() => {
    if (!nodes.length) return;

    const sim = d3
      .forceSimulation(nodes)
      .force("charge", d3.forceManyBody().strength(-80))
      .force("link", d3.forceLink(links).distance(40).strength(0.4))
      .force("center", d3.forceCenter(0, 0, 0))
      .stop();

    // Pre-tick so positions stabilize
    for (let i = 0; i < 120; i++) sim.tick();

    simulation.current = sim;

    return () => sim.stop();
  }, [nodes, links]);

  return (
    <>
      {/* Render links */}
      {links.map((l, i) => (
        <line key={i}>
          <bufferGeometry
            attach="geometry"
            onUpdate={(geometry) => {
              const positions = new Float32Array([
                l.source.x,
                l.source.y,
                l.source.z,
                l.target.x,
                l.target.y,
                l.target.z,
              ]);
              geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
              geometry.computeBoundingSphere();
            }}
          />
          <lineBasicMaterial attach="material" color="#555" />
        </line>
      ))}

      {/* Render Nodes */}
      {nodes.map((node) => (
        <Node
          key={node.id}
          node={node}
          onClick={onNodeClick}
          isFocus={focusId === node.id}
        />
      ))}
    </>
  );
}

export default function GraphCanvas({ data, onNodeSelect, focusId }) {
  // Auto-generate simple synthetic links for now
  const links = data.slice(1).map((n, i) => ({
    source: data[i],
    target: n,
  }));

  return (
    <Canvas camera={{ position: [0, 0, 120], fov: 55 }}>
      <ambientLight intensity={0.6} />
      <pointLight position={[30, 30, 30]} />

      <ForceGraph
        nodes={data}
        links={links}
        onNodeClick={onNodeSelect}
        focusId={focusId}
      />

      <OrbitControls enableZoom={true} />
    </Canvas>
  );
}
