import { GoogleGenAI } from "@google/genai";

const EMBEDDING_MODEL = "gemini-embedding-2";
const EMBEDDING_DIMENSIONS = 768;

// Create Gemini client only when needed
const createAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing. Check your server .env file.");
  }

  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      timeout: 30000,
    },
  });
};

// Generate embedding for one text chunk
export const generateEmbedding = async (text) => {
  if (!text || typeof text !== "string" || !text.trim()) {
    throw new Error("Valid text is required to generate an embedding.");
  }

  const ai = createAIClient();

  const response = await ai.models.embedContent({
    model: EMBEDDING_MODEL,
    contents: text.trim(),
    config: {
      outputDimensionality: EMBEDDING_DIMENSIONS,
    },
  });

  const embedding = response.embeddings?.[0]?.values;

  if (!embedding || embedding.length !== EMBEDDING_DIMENSIONS) {
    throw new Error("Invalid embedding returned by Gemini.");
  }

  return embedding;
};

// Generate embeddings for multiple chunks
export const generateChunkEmbeddings = async (chunks) => {
  const results = [];

  for (const chunk of chunks) {
    const embedding = await generateEmbedding(chunk.text);

    results.push({
      ...chunk,
      embedding,
    });
  }

  return results;
};
