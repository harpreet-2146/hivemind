const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const getEmbedding = async (text) => {
  const embedding = new Array(768).fill(0);
  const words = text.toLowerCase().split(/\s+/);
  
  for (let i = 0; i < words.length; i++) {
    for (let j = 0; j < words[i].length; j++) {
      const idx = (i * 7 + j * 13 + words[i].charCodeAt(j)) % 768;
      embedding[idx] += 1;
    }
  }
  
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0)) || 1;
  return embedding.map((val) => val / magnitude);
};

const getEmbeddings = async (texts) => {
  const embeddings = [];
  for (const text of texts) {
    const embedding = await getEmbedding(text);
    embeddings.push(embedding);
  }
  return embeddings;
};

const extractConcepts = async (title, content) => {
  const advancedKeywords = ['quantum', 'relativity', 'thermodynamics', 'electromagnetism', 'particle', 'dark matter', 'string theory', 'nuclear', 'calculus', 'algebra', 'probability', 'differential', 'number theory', 'cryptography', 'biochemistry', 'organic chemistry'];
  const beginnerKeywords = ['history', 'war', 'ancient', 'renaissance', 'solar system', 'mars', 'economics', 'inflation', 'supply'];
  
  const titleLower = title.toLowerCase();
  
  let forcedDifficulty = 'intermediate';
  if (advancedKeywords.some(k => titleLower.includes(k))) {
    forcedDifficulty = 'advanced';
  } else if (beginnerKeywords.some(k => titleLower.includes(k))) {
    forcedDifficulty = 'beginner';
  }

  const prompt = `Analyze this article and return ONLY valid JSON.

Title: ${title}
Content: ${content.substring(0, 2500)}

Return:
{
  "summary": "2-3 sentence summary",
  "concepts": ["concept1", "concept2", "concept3", "concept4", "concept5"],
  "difficulty": "${forcedDifficulty}"
}`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2,
  });

  const text = response.choices[0]?.message?.content || '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON found');
  }

  const result = JSON.parse(jsonMatch[0]);
  result.difficulty = forcedDifficulty;
  
  return result;
};

const chat = async (message, context = [], searchQuery = '') => {
  const contextText = context.length > 0 
    ? context.map(c => `- ${c.title} (${c.difficulty}): ${c.summary}`).join('\n')
    : 'No specific articles loaded.';

  const systemPrompt = `You are Hivemind AI. You ONLY answer questions about the currently loaded articles.

Current search: "${searchQuery}"

Loaded articles:
${contextText}

Rules:
1. ONLY discuss topics from the loaded articles above
2. If asked about something not in the articles, say "That topic isn't in the current search results. Try searching for it!"
3. Keep responses concise and helpful
4. Reference specific articles when answering`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message },
    ],
    temperature: 0.7,
    max_tokens: 400,
  });

  return response.choices[0]?.message?.content || 'Sorry, could not generate response.';
};

module.exports = {
  getEmbedding,
  getEmbeddings,
  extractConcepts,
  chat,
};