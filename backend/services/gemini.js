const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });
const chatModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

const getEmbedding = async (text) => {
  const result = await embeddingModel.embedContent(text);
  return result.embedding.values;
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
  const prompt = `Analyze this article and return ONLY valid JSON, no other text.

Title: ${title}

Content: ${content.substring(0, 3000)}

Return this exact JSON structure:
{
  "summary": "2-3 sentence summary",
  "concepts": ["concept1", "concept2", "concept3", "concept4", "concept5"],
  "difficulty": "beginner" or "intermediate" or "advanced"
}

Rules:
- concepts: exactly 5 key concepts/topics as lowercase strings
- difficulty: based on technical complexity
- summary: clear and concise`;

  const result = await chatModel.generateContent(prompt);
  const text = result.response.text();
  
  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON found in response');
  }
  
  return JSON.parse(jsonMatch[0]);
};

const chat = async (message, context = []) => {
  const systemPrompt = `You are Hivemind AI, a helpful assistant for exploring knowledge connections. 
You help users understand concepts and how they relate to each other.
Keep responses concise but informative.

${context.length > 0 ? `Relevant articles for context:\n${context.map(c => `- ${c.title}: ${c.summary}`).join('\n')}` : ''}`;

  const chatSession = chatModel.startChat({
    history: [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: 'I understand. I\'m Hivemind AI, ready to help explore knowledge connections.' }] },
    ],
  });

  const result = await chatSession.sendMessage(message);
  return result.response.text();
};

module.exports = {
  getEmbedding,
  getEmbeddings,
  extractConcepts,
  chat,
};