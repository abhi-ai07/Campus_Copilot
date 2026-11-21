import KnowledgeChunk from "../models/KnowledgeChunk.js";
import { processPdfDocument } from "./documentProcessor.js";
import {
  generateChunkEmbeddings,
  generateEmbedding,
} from "./embeddingService.js";

// Atlas Vector Search configuration
const VECTOR_INDEX_NAME = "knowledge_vector_index";
const VECTOR_FIELD = "embedding";
const EMBEDDING_DIMENSIONS = 768;

// Process one PDF and save its chunks in MongoDB
export const ingestDocument = async (document) => {
  console.log(`\nProcessing: ${document.title}`);

  // 1. Extract PDF text and create chunks
  const processedDocument = await processPdfDocument(document);

  if (!processedDocument.chunks.length) {
    throw new Error("No readable chunks found in this document.");
  }

  console.log(`Chunks extracted: ${processedDocument.totalChunks}`);

  // 2. Generate embeddings
  const embeddedChunks = await generateChunkEmbeddings(
    processedDocument.chunks,
  );

  console.log("Embeddings generated successfully.");

  // 3. Upsert chunks to avoid duplicates
  const operations = embeddedChunks.map((chunk) => ({
    updateOne: {
      filter: {
        documentId: processedDocument.documentId,
        chunkIndex: chunk.chunkIndex,
      },
      update: {
        $set: {
          documentId: processedDocument.documentId,
          documentTitle: processedDocument.title,
          description: processedDocument.description,
          category: processedDocument.category,
          fileName: processedDocument.fileName,
          sourceUrl: processedDocument.sourceUrl,
          chunkIndex: chunk.chunkIndex,
          pageNumber: chunk.pageNumber,
          text: chunk.text,
          embedding: chunk.embedding,
        },
      },
      upsert: true,
    },
  }));

  await KnowledgeChunk.bulkWrite(operations, { ordered: true });

  // 4. Remove old extra chunks if the PDF has fewer chunks now
  await KnowledgeChunk.deleteMany({
    documentId: processedDocument.documentId,
    chunkIndex: { $gte: embeddedChunks.length },
  });

  console.log(`Saved ${embeddedChunks.length} chunks to MongoDB.`);

  return {
    documentId: processedDocument.documentId,
    title: processedDocument.title,
    totalChunks: embeddedChunks.length,
    pageCount: processedDocument.pageCount,
  };
};

// Retrieve relevant PDF chunks using Atlas Vector Search
export const retrieveRelevantChunks = async (question, limit = 5) => {
  if (!question || typeof question !== "string" || !question.trim()) {
    throw new Error("A valid question is required for knowledge search.");
  }

  // 1. Generate embedding for student's question
  const queryEmbedding = await generateEmbedding(question.trim());

  if (queryEmbedding.length !== EMBEDDING_DIMENSIONS) {
    throw new Error("Question embedding has invalid dimensions.");
  }

  // 2. Search MongoDB Atlas Vector Search index
  const results = await KnowledgeChunk.aggregate([
    {
      $vectorSearch: {
        index: VECTOR_INDEX_NAME,
        path: VECTOR_FIELD,
        queryVector: queryEmbedding,
        numCandidates: Math.max(limit * 10, 50),
        limit,
      },
    },
    {
      $project: {
        _id: 1,
        documentId: 1,
        documentTitle: 1,
        description: 1,
        category: 1,
        fileName: 1,
        sourceUrl: 1,
        chunkIndex: 1,
        pageNumber: 1,
        text: 1,
        score: {
          $meta: "vectorSearchScore",
        },
      },
    },
  ]);

  return results;
};

// Remove a document's chunks from the knowledge base
export const removeDocumentKnowledge = async (documentId) => {
  if (!documentId || typeof documentId !== "string") {
    throw new Error("A valid document ID is required.");
  }

  const result = await KnowledgeChunk.deleteMany({
    documentId,
  });

  console.log(
    `Removed ${result.deletedCount} chunks for document: ${documentId}`,
  );

  return result.deletedCount;
};
