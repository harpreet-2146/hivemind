# HIVEMIND

> **Knowledge Constellation Platform** - Transform any topic into a visual learning journey

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)

## The Problem

- **Information Overload**: Google returns 10 blue links, YouTube suggests random videos
- **No Learning Path**: Learners don't know what to study first
- **No Connections**: Concepts are learned in isolation

## Our Solution

Hivemind transforms any topic into a **visual knowledge constellation** that shows:

- **10+ connected nodes** per search
- **Learning order** (1 → 2 → 3 → ...)
- **Difficulty levels** (Beginner → Intermediate → Advanced)
- **Context-aware AI chat**
- **Multilingual voice support** (12+ languages)

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React + Vite | Modern UI framework |
| Tailwind CSS | Utility-first styling |
| Cytoscape.js | Graph visualization |
| Web Speech API | Voice input/output |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + Express | REST API server |
| Groq API (Llama 3.1) | LLM inference |
| Wikipedia API | Knowledge source |

### Databases
| Technology | Purpose |
|------------|---------|
| Meilisearch | Full-text search |
| Qdrant | Vector embeddings |

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/hivemind.git
cd hivemind
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create `.env` file:
```env
# Meilisearch
MEILI_HOST=your_meilisearch_host
MEILI_API_KEY=your_meilisearch_key

# Qdrant
QDRANT_URL=your_qdrant_url
QDRANT_API_KEY=your_qdrant_key

# Groq
GROQ_API_KEY=your_groq_key
```

### 3. Ingest Data
```bash
node ingest.js
```
This fetches 100+ Wikipedia articles across 8 categories.

### 4. Start Backend
```bash
node index.js
```
Server runs on `http://localhost:3000`

### 5. Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```
App runs on `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/search?q=query` | Search documents |
| POST | `/chat` | Send chat message |

### Example: Search
```bash
curl "http://localhost:3000/search?q=quantum%20physics"
```

### Example: Chat
```bash
curl -X POST "http://localhost:3000/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "Explain quantum entanglement"}'
```

## Features

### Knowledge Constellation
- Interactive graph visualization
- Numbered nodes showing learning order
- Color-coded difficulty levels
- Hover for details, click for full info

### AI Chat
- Context-aware responses using Llama 3.1
- Only answers from loaded articles
- Prevents off-topic hallucinations

### Multilingual Voice
- Speech-to-text input
- Text-to-speech output
- 12+ languages: English, Hindi, Spanish, French, German, Chinese, Japanese, Korean, Arabic, Portuguese, Russian, Italian

## Knowledge Categories

| Category | Topics |
|----------|--------|
| Physics | Quantum mechanics, Relativity, Thermodynamics |
| AI/ML | Neural networks, NLP, Deep learning |
| History | World War II, Mughal Empire, Renaissance |
| CS | Algorithms, Databases, Web development |
| Math | Calculus, Linear algebra, Probability |
| Biology | Genetics, Evolution, Neuroscience |
| Chemistry | Organic chemistry, Biochemistry |
| Space | Solar system, Black holes, Big Bang |

## Deployment

### Backend (Railway)
1. Connect GitHub repo
2. Set environment variables
3. Deploy with `node index.js`

### Frontend (Vercel)
1. Connect GitHub repo
2. Update `API_URL` in `src/services/api.js`
3. Deploy automatically

## Roadmap

| Phase | Features |
|-------|----------|
| MVP | Constellation, AI chat, Voice |
| Q1 2025 | User accounts, Save paths |
| Q2 2025 | Upload PDFs, YouTube integration |
| Q3 2025 | Quiz generation, Flashcards |
| Q4 2025 | Enterprise API, White-label |

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

## Team

**Team EclipseX**
- Harpreet Kaur Gothra

---

Built for **Open Innovation Hackathon '25**