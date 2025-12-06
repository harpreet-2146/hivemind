// // src/pages/Landing.jsx
// import React from "react";
// import FaultyTerminal from "../components/FaultyTerminal"; // adjust if needed

// export default function Landing() {
//   return (
//     <div
//       className="w-screen h-screen overflow-hidden relative bg-black text-white"
//       style={{ margin: 0, padding: 0 }}
//     >
//       {/* === FULLSCREEN TERMINAL BACKGROUND === */}
//       <div
//         style={{
//           position: "absolute",
//           inset: 0,
//           width: "100%",
//           height: "100%",
//           overflow: "hidden",
//           zIndex: 1
//         }}
//       >
//         <FaultyTerminal
//           scale={1.5}
//           gridMul={[2, 1]}
//           digitSize={1.2}
//           timeScale={1}
//           pause={false}
//           scanlineIntensity={1}
//           glitchAmount={1}
//           flickerAmount={1}
//           noiseAmp={1}
//           chromaticAberration={0}
//           dither={0}
//           curvature={0.15}
//           tint="#bb1b68"
//           mouseReact={true}
//           mouseStrength={0.5}
//           pageLoadAnimation={false}
//           brightness={1}
//         />
//       </div>

//       {/* === OVERLAY CONTENT (centered) === */}
//       <div
//         style={{
//           position: "relative",
//           zIndex: 10,
//           width: "100%",
//           height: "100%",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           textAlign: "center",
//           padding: "0 20px"
//         }}
//       >
//         <h1
//           style={{
//             fontSize: "5rem",
//             fontWeight: 800,
//             marginBottom: "20px",
//             textShadow: "0 0 40px rgba(255,255,255,0.3)"
//           }}
//         >
//           HIVEMIND
//         </h1>

//         <p
//           style={{
//             fontSize: "1.3rem",
//             maxWidth: "800px",
//             lineHeight: 1.5,
//             marginBottom: "40px",
//             color: "rgba(255,255,255,0.85)"
//           }}
//         >
//           A distributed cyber-mesh intelligence — powered by glitch-reactive computation.
//         </p>

//         <button
//           style={{
//             padding: "14px 32px",
//             borderRadius: "12px",
//             fontSize: "1.2rem",
//             fontWeight: 600,
//             background: "rgba(255,255,255,0.12)",
//             border: "1px solid rgba(255,255,255,0.2)",
//             color: "#fff",
//             backdropFilter: "blur(8px)",
//             cursor: "pointer"
//           }}
//         >
//           Get Started
//         </button>
//       </div>
//     </div>
//   );
// }


// src/pages/Landing.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import FaultyTerminal from "../components/FaultyTerminal";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div
      className="w-screen h-screen overflow-hidden relative bg-black text-white"
      style={{ margin: 0, padding: 0 }}
    >
      {/* Fullscreen terminal background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden",
          zIndex: 1
        }}
      >
        <FaultyTerminal
          scale={1.5}
          gridMul={[2, 1]}
          digitSize={1.2}
          timeScale={1}
          pause={false}
          scanlineIntensity={1}
          glitchAmount={1}
          flickerAmount={1}
          noiseAmp={1}
          chromaticAberration={0}
          dither={0}
          curvature={0.15}
          tint="#bb1b68"
          mouseReact={true}
          mouseStrength={0.5}
          pageLoadAnimation={false}
          brightness={1}
        />
      </div>

      {/* Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700;800&family=Inter:wght@400;600&display=swap');

        .title-font {
          font-family: 'Poppins', 'Inter', system-ui, -apple-system, sans-serif;
          font-weight: 800;
          -webkit-font-smoothing: antialiased;
        }

        /* gentle float like Devlance */
        @keyframes floaty {
          0% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0); }
        }
        .float-slow { animation: floaty 6.5s ease-in-out infinite; }

        /* CTA white pill */
        .cta-white {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 14px 30px;
          border-radius: 999px;
          background: #ffffff;
          color: #000000;
          font-weight: 700;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          border: none;
          cursor: pointer;
          transition: transform .22s cubic-bezier(.2,.9,.3,1), box-shadow .22s;
          box-shadow: 0 8px 30px rgba(0,0,0,0.35);
        }
        .cta-white:hover { transform: translateY(-4px); box-shadow: 0 18px 60px rgba(0,0,0,0.40); }

        /* subtle secondary (ghost) */
        .btn-ghost {
          padding: 12px 22px;
          border-radius: 999px;
          background: rgba(255,255,255,0.06);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.08);
          font-weight: 600;
          cursor: pointer;
          backdrop-filter: blur(6px);
          transition: transform .22s;
        }
        .btn-ghost:hover { transform: translateY(-3px); }

        /* title styling */
        .hero-title {
          color: #ffffff;
          font-size: 6rem;
          line-height: 0.95;
          margin: 0;
          text-shadow: 0 8px 40px rgba(0,0,0,0.6);
          letter-spacing: -0.02em;
        }

        .hero-desc {
          color: #ffffff;
          opacity: 1;
          margin-top: 18px;
          margin-bottom: 34px;
          font-size: 1.15rem;
          font-weight: 500;
        }

        @media (max-width: 720px) {
          .hero-title { font-size: 3rem; }
          .hero-desc { font-size: 1rem; max-width: 92%; }
        }
      `}</style>

      {/* Overlay content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 28px"
        }}
      >
        <div style={{ maxWidth: 990 }}>
          <div style={{ position: "relative" }}>
            <h1 className="title-font hero-title float-slow">HIVEMIND</h1>
          </div>

          <p className="hero-desc" style={{ maxWidth: 8200, marginInline: "auto" }}>
            A distributed cyber-mesh intelligence — model fusion, mesh routing, and auditable on-chain provenance.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
            <button
              className="cta-white"
              onClick={() => navigate("/dashboard")}
              aria-label="Go to dashboard"
            >
              Get Started
            </button>

            
          </div>
        </div>
      </div>
    </div>
  );
}
