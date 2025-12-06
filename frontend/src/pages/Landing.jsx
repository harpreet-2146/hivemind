// // src/pages/Landing.jsx
// import React from "react";
// import ColorBends from "../components/ColorBends"; // adjust path if needed
// import { useNavigate } from "react-router-dom";

// export default function Landing() {
//   const navigate = useNavigate();

//   function handleGetStarted() {
//     navigate("/onboard"); // adjust route
//   }

//   return (
//     <div className="min-h-screen relative overflow-hidden text-white bg-gradient-to-br from-[#08080b] via-[#0e0e16] to-[#06060a]">
//       {/* ========== FIXED BACKGROUND (prevents layout shifts) ========== */}
//       <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none" }}>
//         <ColorBends
//           colors={["#ff5c7a", "#8a5cff", "#00ffd1"]}
//           rotation={30}
//           speed={0.3}
//           scale={1.2}
//           frequency={1.4}
//           warpStrength={1.2}
//           mouseInfluence={0.8}
//           parallax={0.6}
//           noise={0.08}
//           transparent
//           className="w-full h-full"
//         />
//       </div>

//       {/* Background gradients & blobs (pure CSS; visual only) */}
//       <div aria-hidden className="absolute inset-0 -z-20">
//         <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/18 via-purple-800/08 to-blue-900/18 blur-3xl opacity-60 animate-bgPulse" />
//         <div className="absolute top-1/3 -left-20 w-[35rem] h-[35rem] rounded-full bg-indigo-600/28 blur-[160px] opacity-40" />
//         <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] rounded-full bg-purple-600/28 blur-[170px] opacity-40" />
//       </div>

//       {/* floating bubbles (pointer-events-none so background won't steal clicks) */}
//       <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
//         <style>{`
//           @keyframes floatUpA {
//             0% { transform: translateY(0) translateX(0) scale(1); opacity: 0.7; }
//             50% { transform: translateY(-40px) translateX(8px) scale(1.03); opacity: 0.85; }
//             100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.7; }
//           }
//           @keyframes floatUpB {
//             0% { transform: translateY(0) translateX(0) scale(1); opacity: 0.55; }
//             50% { transform: translateY(-80px) translateX(-18px) scale(1.06); opacity: 0.7; }
//             100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.55; }
//           }
//           @keyframes floatSlow {
//             0% { transform: translateY(0) translateX(0) rotate(0deg); }
//             50% { transform: translateY(-24px) translateX(12px) rotate(6deg); }
//             100% { transform: translateY(0) translateX(0) rotate(0deg); }
//           }
//           .bubble { position: absolute; border-radius: 9999px; filter: blur(10px); mix-blend-mode: screen; opacity: 0.75; }
//           .bubble-soft { filter: blur(14px); opacity: 0.45; }
//         `}</style>

//         <div className="bubble" style={{ width: 220, height: 220, left: '6%', top: '8%', background: 'radial-gradient(circle at 30% 30%, rgba(99,102,241,0.28), rgba(99,102,241,0.12) 40%, transparent 60%)', animation: 'floatUpA 9s ease-in-out infinite' }} />
//         <div className="bubble bubble-soft" style={{ width: 420, height: 200, right: '6%', top: '6%', background: 'radial-gradient(circle at 70% 30%, rgba(168,85,247,0.16), rgba(99,102,241,0.06) 45%, transparent 65%)', animation: 'floatUpB 14s ease-in-out infinite', animationDelay: '1.5s' }} />
//         <div className="bubble" style={{ width: 120, height: 120, left: '20%', bottom: '14%', background: 'radial-gradient(circle at 40% 40%, rgba(34,211,238,0.14), rgba(79,70,229,0.04) 50%, transparent 70%)', animation: 'floatUpA 11s ease-in-out infinite', animationDelay: '0.8s' }} />
//         <div className="bubble" style={{ width: 160, height: 160, right: '18%', bottom: '22%', background: 'radial-gradient(circle at 60% 40%, rgba(99,102,241,0.12), rgba(99,102,241,0.06) 60%, transparent 80%)', animation: 'floatUpB 10s ease-in-out infinite', animationDelay: '2.6s' }} />
//         <div className="bubble bubble-soft" style={{ width: 80, height: 80, left: '38%', top: '26%', background: 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.12), rgba(79,70,229,0.04) 60%, transparent 80%)', animation: 'floatSlow 12s ease-in-out infinite', animationDelay: '3.3s' }} />
//       </div>

//       {/* small embedded CSS for animations + button styles */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Inter:wght@400;500;600&display=swap');

//         * { font-family: 'Inter', system-ui, -apple-system, sans-serif; }

//         @keyframes bgPulse { 0% { opacity: 0.45; } 50% { opacity: 0.65; } 100% { opacity: 0.45; } }
//         .animate-bgPulse { animation: bgPulse 8s ease-in-out infinite; }

//         /* Title blur -> clear over 3s */
//         @keyframes blurToClear {
//           0% { filter: blur(12px); opacity: 0; transform: translateY(-6px); }
//           60% { filter: blur(3px); opacity: 0.9; transform: translateY(-2px); }
//           100% { filter: blur(0px); opacity: 1; transform: translateY(0); }
//         }

//         .hivemind-title {
//           animation: blurToClear 3s cubic-bezier(.2,.9,.3,1) both;
//           will-change: filter, opacity, transform;
//           text-shadow: 0 2px 40px rgba(0,0,0,0.8), 0 0 80px rgba(138,92,255,0.18);
//         }

//         /* gentle float for CTA */
//         @keyframes floaty { 0% { transform: translateY(0);} 50% { transform: translateY(-6px);} 100% { transform: translateY(0);} }
//         .float-slow { animation: floaty 4.5s ease-in-out infinite; }

//         .title-font { font-family: 'Poppins', 'Inter', sans-serif; font-weight: 700; }

//         .btn-primary {
//           background: linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(139, 92, 246, 0.12));
//           backdrop-filter: blur(14px);
//           border: 2px solid rgba(255,255,255,0.12);
//           box-shadow: 0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04);
//           transition: all 0.32s cubic-bezier(.2,.9,.3,1);
//           position: relative; overflow: hidden;
//         }
//         .btn-primary::before {
//           content: '';
//           position: absolute; top: 0; left: -120%; width: 120%; height: 100%;
//           background: linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent);
//           transition: left 0.6s;
//         }
//         .btn-primary:hover::before { left: 120%; }
//         .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 14px 48px rgba(99,102,241,0.28); border-color: rgba(255,255,255,0.22); }
//       `}</style>

//       {/* dark vignette overlay */}
//       <div className="fixed inset-0 pointer-events-none z-5 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.35)_70%)]" />

//       {/* Main content (z-index above fixed background) */}
//       <main className="relative z-10 flex items-center justify-center min-h-screen px-6 py-24">
//         <div className="max-w-4xl w-full text-center space-y-10">
//           {/* Beta pill */}
//           <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-black/30 border border-white/18 backdrop-blur-xl mx-auto">
//             <span className="relative flex h-2.5 w-2.5">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
//               <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-400"></span>
//             </span>
//             <span className="text-sm font-semibold tracking-widest text-white uppercase">Beta • Mesh</span>
//           </div>

//           {/* Title */}
//           <div className="relative">
//             <h1
//               className="hivemind-title title-font text-[5.5rem] md:text-[7rem] lg:text-[8rem] leading-[0.9] tracking-tight mx-auto"
//               style={{ color: "#ffffff" }}
//             >
//               HIVEMIND
//             </h1>
//           </div>

//           {/* Subtitle */}
//           <p className="text-lg md:text-xl leading-relaxed max-w-3xl mx-auto font-medium" style={{ color: '#ffffff', textShadow: '0 2px 30px rgba(0,0,0,0.85)' }}>
//             Collective intelligence for smarter decisions — mesh networks, model fusion, and on-chain provenance.
//           </p>

//           {/* Feature pills */}
//           <div className="flex flex-wrap items-center justify-center gap-4 text-base md:text-lg" style={{ color: '#fff' }}>
//             <span className="px-4 py-2 rounded-full bg-black/30 border border-white/12 backdrop-blur-md font-medium">Mesh-native</span>
//             <span className="px-4 py-2 rounded-full bg-black/30 border border-white/12 backdrop-blur-md font-medium">Model orchestration</span>
//             <span className="px-4 py-2 rounded-full bg-black/30 border border-white/12 backdrop-blur-md font-medium">On-chain audit</span>
//           </div>

//           {/* CTAs */}
//           <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-5">
//             <button
//               onClick={handleGetStarted}
//               className="btn-primary px-12 py-5 rounded-2xl text-lg font-bold text-white flex items-center justify-center gap-3 min-w-[220px] float-slow"
//             >
//               Get started
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5-5 5M6 12h12" />
//               </svg>
//             </button>

//             <button
//               onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
//               className="px-10 py-4 rounded-2xl text-lg font-semibold text-white bg-[rgba(255,255,255,0.03)] border border-white/12 backdrop-blur-md"
//             >
//               Learn more
//             </button>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// // src/pages/Landing.jsx
// import React from "react";
// import ColorBends from "../components/ColorBends"; // adjust path if needed
// import { useNavigate } from "react-router-dom";

// export default function Landing() {
//   const navigate = useNavigate();

//   function handleGetStarted() {
//     navigate("/onboard"); // adjust route
//   }

//   return (
//     <div className="min-h-screen relative overflow-hidden text-white bg-black">
//       {/* ========== FIXED, OPAQUE BACKGROUND (made vivid) ========== */}
//       <div
//         style={{
//           position: "fixed",
//           inset: 0,
//           zIndex: 10, // canvas visible below content but above subtle backgrounds
//           pointerEvents: "none"
//         }}
//       >
//         <ColorBends
//           colors={["#ff2d6f", "#7a2bff", "#00ffd1"]} // punchier colors
//           rotation={30}
//           speed={0.45}          // a little faster
//           scale={1.05}          // slightly tighter to make colors denser
//           frequency={1.8}      // more structure
//           warpStrength={1.6}   // stronger warp for clearer blobs
//           mouseInfluence={1.0}
//           parallax={0.6}
//           noise={0.02}         // low noise for cleaner colors
//           transparent={false}  // <-- IMPORTANT: render opaque so colors don't get washed out
//           className="w-full h-full"
//         />
//       </div>

//       {/* toned-down background accents (kept behind canvas) */}
//       <div aria-hidden className="absolute inset-0 -z-20">
//         <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/12 via-purple-800/06 to-blue-900/12 opacity-50" />
//         {/* subtle blobs but reduced opacity so they don't fight canvas */}
//         <div className="absolute top-1/3 -left-20 w-[30rem] h-[30rem] rounded-full bg-indigo-600/12 blur-[120px]" />
//         <div className="absolute bottom-0 right-0 w-[26rem] h-[26rem] rounded-full bg-purple-600/12 blur-[130px]" />
//       </div>

//       {/* Remove heavy vignette and other opaque overlays that darkened the canvas */}
//       {/* Main content sits ABOVE the canvas (higher z-index) */}
//       <main className="relative z-20 flex items-center justify-center min-h-screen px-6 py-24">
//         <div className="max-w-4xl w-full text-center space-y-8">
//           <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-black/20 border border-white/12 backdrop-blur-md mx-auto">
//             <span className="relative flex h-2.5 w-2.5">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-70"></span>
//               <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-400"></span>
//             </span>
//             <span className="text-sm font-semibold tracking-widest text-white uppercase">Beta • Mesh</span>
//           </div>

//           <h1
//             className="title-font text-[5.5rem] md:text-[7rem] lg:text-[8rem] leading-[0.9] tracking-tight mx-auto"
//             style={{
//               color: "#fff",
//               textShadow: "0 2px 40px rgba(0,0,0,0.6), 0 0 60px rgba(122,43,255,0.18)"
//             }}
//           >
//             HIVEMIND
//           </h1>

//           <p className="text-lg md:text-xl leading-relaxed max-w-3xl mx-auto font-medium" style={{ color: "#fff" }}>
//             Collective intelligence for smarter decisions — mesh networks, model fusion, and on-chain provenance.
//           </p>

//           <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-5">
//             <button
//               onClick={handleGetStarted}
//               className="px-12 py-4 rounded-2xl text-lg font-bold text-white backdrop-blur-md bg-[rgba(255,255,255,0.06)] border border-white/10"
//             >
//               Get started
//             </button>

//             <button
//               onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
//               className="px-10 py-4 rounded-2xl text-lg font-semibold text-white bg-[rgba(255,255,255,0.03)] border border-white/8"
//             >
//               Learn more
//             </button>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
import React from "react";
import ColorBends from '../components/ColorBends';

export default function Landing() {
  return (
    <div className="relative w-full min-h-screen">
      <div className="fixed inset-0 z-0">
        <ColorBends
          colors={["#ff1744", "#651fff", "#00e5ff", "#76ff03"]}
          rotation={30}
          speed={0.4}
          scale={1.0}
          frequency={1.6}
          warpStrength={1.5}
          mouseInfluence={1.2}
          parallax={0.8}
          noise={0.05}
          transparent={false}
        />
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-20">
          <h1 className="text-6xl font-bold text-white text-center mb-6">
            Welcome to Your Landing Page
          </h1>
          <p className="text-xl text-white text-center max-w-2xl mx-auto mb-8">
            This is a test to see if the ColorBends background is working properly.
          </p>
          <div className="flex justify-center">
            <button className="px-8 py-3 bg-white text-black rounded-lg hover:opacity-90 transition-opacity">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}