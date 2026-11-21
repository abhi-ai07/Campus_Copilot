import { GoogleGenAI } from "@google/genai";
import { retrieveRelevantChunks } from "../services/knowledgeService.js";

// Retry configuration
const MAX_RETRIES = 2;
const INITIAL_RETRY_DELAY = 1500;
const RETRYABLE_STATUS_CODES = [429, 500, 502, 503, 504];

const MIN_RELEVANCE_SCORE = 0.7;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Greetings: RAG is not required
const GREETING_PATTERN =
  /^(hi+|hello+|hey+|hii+|good morning|good afternoon|good evening|namaste)[!.?,\s]*$/i;

// Clearly general academic questions: RAG is not required
const GENERAL_ACADEMIC_PATTERN =
  /^(what is|what are|define|explain|describe|meaning of|difference between|differentiate)\s+(dbms|normalization|data structure|operating system|computer network|artificial intelligence|machine learning|data mining|programming|python|java|javascript|html|css|sql|algorithm|compiler|database)\b/i;

// GEHU-first retrieval decision
const shouldRetrieveCollegeKnowledge = (message) => {
  const question = message.trim();

  if (GREETING_PATTERN.test(question)) {
    return false;
  }

  if (GENERAL_ACADEMIC_PATTERN.test(question)) {
    return false;
  }

  // All other questions use GEHU knowledge by default.
  return true;
};

// Generate response using Gemini
const generateGeminiResponse = async (message, relevantChunks = []) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Gemini API key is missing.");
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      timeout: 20000,
    },
  });

  const knowledgeContext = relevantChunks.length
    ? relevantChunks
        .map(
          (chunk, index) => `
SOURCE ${index + 1}
Document: ${chunk.documentTitle}
Category: ${chunk.category || "General"}
Page: ${chunk.pageNumber}
Content:
${chunk.text}
`,
        )
        .join("\n")
    : "No relevant GEHU college documents were retrieved for this question.";

  const prompt = `
You are CampusCopilot, an AI-powered student assistant for
Graphic Era Hill University (GEHU), Dehradun.

YOUR PRIMARY PURPOSE:
Help GEHU students with college-related questions using the
available official college knowledge base.

STUDENT QUESTION:
${message}

GEHU KNOWLEDGE BASE:
${knowledgeContext}

IMPORTANT INSTRUCTIONS:

1. Assume the student is asking about Graphic Era Hill University
   whenever the question is related to college, academics,
   examinations, attendance, admissions, fees, ERP, departments,
   facilities, notices, or university procedures.

2. The student does not need to mention GEHU or Graphic Era in
   every question.

3. Use the provided GEHU knowledge base as the primary source
   for all college-specific information.

4. Never invent official college rules, deadlines, fees,
   attendance requirements, examination policies, or procedures.

5. If the requested college information is not available in
   the provided documents, clearly tell the student that the
   information is not currently available in the knowledge base.

6. For general academic questions such as DBMS, programming,
   operating systems, computer networks, and other technical
   subjects, answer using your general knowledge.

7. For greetings, respond naturally and warmly.

8. If the student asks an ambiguous college-related question,
   interpret it in the GEHU context by default.

9. Keep answers clear, student-friendly, accurate, and
   appropriately detailed.

10. Do not repeatedly introduce yourself in every response.

11. You may respond in English or Hinglish according to the
    student's language.

12. If relevant information is available in the documents,
    mention the document title or page number when useful.

Generate the response now.
`;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt,
      });

      const reply = response.text?.trim();

      if (!reply) {
        throw new Error("Gemini returned an empty response.");
      }

      return reply;
    } catch (error) {
      const statusCode = error.status || error.statusCode || error.code;

      const isRetryable = RETRYABLE_STATUS_CODES.includes(Number(statusCode));

      if (attempt < MAX_RETRIES && isRetryable) {
        const delay = INITIAL_RETRY_DELAY * (attempt + 1);

        console.log(`Gemini request failed. Retrying in ${delay}ms...`);

        await wait(delay);
        continue;
      }

      throw error;
    }
  }

  throw new Error("Unable to generate a response.");
};

// Main chat controller
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    // Validate input
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid message.",
      });
    }

    // Check API key
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Gemini API key is not configured.",
      });
    }

    const studentQuestion = message.trim();

    let relevantChunks = [];

    // Decide whether GEHU knowledge retrieval is needed
    if (shouldRetrieveCollegeKnowledge(studentQuestion)) {
      const retrievedChunks = await retrieveRelevantChunks(studentQuestion, 5);

      relevantChunks = retrievedChunks.filter(
        (chunk) => chunk.score >= MIN_RELEVANCE_SCORE,
      );

      console.log(
        `GEHU knowledge retrieval: ${relevantChunks.length} relevant chunks found.`,
      );
    } else {
      console.log(
        "Knowledge retrieval skipped: greeting or general academic question.",
      );
    }

    // Generate Gemini response
    const reply = await generateGeminiResponse(studentQuestion, relevantChunks);

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("Chat Controller Error:", error);

    const statusCode = error.status || error.statusCode || error.code;

    if (Number(statusCode) === 429) {
      return res.status(503).json({
        success: false,
        message:
          "CampusCopilot is receiving too many requests. Please try again shortly.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while generating your response. Please try again.",
    });
  }
};
