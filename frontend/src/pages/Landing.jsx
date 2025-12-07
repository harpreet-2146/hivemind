import React from 'react';
import { useNavigate } from 'react-router-dom';
import LiquidEther from '../components/LiquidEther';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full min-h-screen bg-[#080510] text-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        <LiquidEther
          colors={[ '#5227FF', '#FF9FFC', '#B19EEF' ]}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40 pointer-events-none" />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Playfair+Display:wght@700;900&display=swap');

        .landing-title {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          letter-spacing: -0.02em;
          line-height: 0.95;
          font-size: clamp(48px, 8vw, 120px);
          background: linear-gradient(90deg, #FFFFFF, #EDE7FF 20%, #FFEEF9 50%, #DCD3FF 80%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          display: inline-block;
          transform-origin: center;
          position: relative;
          text-align: center;
        }

        .landing-title::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 8px;
          background: radial-gradient(120px 60px at 10% 20%, rgba(255,255,255,0.06), transparent 12%),
                      linear-gradient(90deg, rgba(82,39,255,0.03), rgba(255,159,252,0.02));
          mix-blend-mode: overlay;
          pointer-events: none;
        }

        .title-glow {
          animation: title-pulse 3.8s ease-in-out infinite;
        }

        @keyframes title-pulse {
          0% { filter: blur(0px) saturate(1); transform: translateY(0) scale(1); opacity: 1; }
          40% { filter: blur(2px) saturate(1.05); transform: translateY(-6px) scale(1.01); opacity: 0.98; }
          100% { filter: blur(0px) saturate(1); transform: translateY(0) scale(1); opacity: 1; }
        }

        .faux-outline {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%) skewX(-6deg);
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: clamp(48px, 8vw, 120px);
          color: rgba(255,255,255,0.03);
          -webkit-text-stroke: 0.5px rgba(0,0,0,0.12);
          pointer-events: none;
          user-select: none;
          z-index: 1;
        }

        .get-started-pill {
          background: linear-gradient(90deg, rgba(82,39,255,0.18), rgba(255,159,252,0.12));
          border: 1px solid rgba(255,255,255,0.08);
        }

        .get-started-pill:hover {
          transform: translateY(-3px) scale(1.01);
        }

        .tag-pill {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 12px;
          color: #EDE7FF;
        }

        .content-wrap {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 32px;
          box-sizing: border-box;
        }

        @media (max-width: 768px) {
          .faux-outline { display: none; }
        }
      `}</style>

      <main className="content-wrap">
        <div className="w-full px-6 text-center">
          <div className="relative inline-block w-full">
            <h1 className="landing-title title-glow">HIVEMIND</h1>
          </div>

          <p className="mt-6 max-w-2xl mx-auto text-gray-200 text-lg md:text-xl leading-relaxed">
            A living knowledge graph — connect concepts, surface precise context, and ask AI with confidence.
            Fast, focused, and beautiful learning for curious minds.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/explore')}
              className="get-started-pill inline-flex items-center gap-3 px-8 py-3 rounded-[28px] text-base font-semibold shadow-lg transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400"
              aria-label="Get started — Explore Hivemind"
            >
              <span>Get started</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <a
              href="#features"
              className="text-sm text-gray-300 hover:text-white transition underline-offset-4"
            >
              Learn more
            </a>
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="tag-pill">Concept Map</div>
            <div className="tag-pill">AI Chat</div>
            <div className="tag-pill">Snippets</div>
          </div>
        </div>
      </main>
    </div>
  );
}
