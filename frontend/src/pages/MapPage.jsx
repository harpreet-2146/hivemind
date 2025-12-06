import React, { useEffect, useState } from "react";
import GraphCanvas from "../components/GraphCanvas";
import { getConcepts, getContextExplosion } from "../services/apiClient";
import { motion } from "framer-motion";

export default function MapPage() {
  const [concepts, setConcepts] = useState([]);
  const [focus, setFocus] = useState(null);
  const [context, setContext] = useState(null);

  // Load real backend concepts on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await getConcepts();
        // add random XYZ positions here
        const positioned = data.map(c => ({
          ...c,
          x: (Math.random() - 0.5) * 120,
          y: (Math.random() - 0.5) * 120,
          z: (Math.random() - 0.5) * 120
        }));
        setConcepts(positioned);
      } catch (err) {
        console.error("Backend fetch failed:", err);
      }
    })();
  }, []);

  async function onNodeClick(node) {
    setFocus(node.id);
    const ctx = await getContextExplosion(node.id);
    setContext(ctx);
  }

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative", background: "#050506" }}>
      <GraphCanvas data={concepts} focusId={focus} onNodeSelect={onNodeClick} />

      {context && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="context-explosion"
          style={{
            position: "absolute",
            right: 20,
            top: 20,
            width: 360,
            padding: 20,
            borderRadius: 16,
            background: "rgba(10,10,10,0.85)",
            backdropFilter: "blur(10px)",
            color: "white",
          }}
        >
          <h2>🔥 {focus} Context</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {Object.entries(context.cards).map(([key, value]) => (
              <div key={key} style={{ padding: 10, borderRadius: 10, border: "1px solid #222" }}>
                <strong style={{ fontSize: 13 }}>{key}</strong>
                <div style={{ fontSize: 12, marginTop: 5 }}>
                  {Array.isArray(value)
                    ? value.slice(0, 2).join(" • ")
                    : JSON.stringify(value)}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setContext(null)}
            style={{
              marginTop: 15,
              padding: "8px 12px",
              background: "#222",
              color: "white",
              borderRadius: 8
            }}
          >
            Close
          </button>
        </motion.div>
      )}
    </div>
  );
}
