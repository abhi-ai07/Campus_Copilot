import mongoose from "mongoose";

const knowledgeChunkSchema = new mongoose.Schema(
  {
    documentId: {
      type: String,
      required: true,
    },

    documentTitle: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "General",
    },

    fileName: {
      type: String,
      default: "",
    },

    sourceUrl: {
      type: String,
      default: "",
    },

    chunkIndex: {
      type: Number,
      required: true,
    },

    pageNumber: {
      type: Number,
      required: true,
    },

    text: {
      type: String,
      required: true,
    },

    embedding: {
      type: [Number],
      required: true,
      validate: {
        validator: (value) => value.length === 768,
        message: "Embedding must contain exactly 768 dimensions.",
      },
    },
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate chunks for the same document
knowledgeChunkSchema.index({ documentId: 1, chunkIndex: 1 }, { unique: true });

const KnowledgeChunk = mongoose.model("KnowledgeChunk", knowledgeChunkSchema);

export default KnowledgeChunk;
