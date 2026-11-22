import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Fallback to default dotenv lookup if needed
dotenv.config();

const { default: connectDB } = await import("../src/config/db.js");
const KnowledgeChunk = (await import("../src/models/KnowledgeChunk.js")).default;
const mongoose = (await import("mongoose")).default;

const checkKnowledgeChunks = async () => {
  try {
    console.log("\nConnecting to MongoDB...\n");
    await connectDB();

    console.log("Fetching knowledge chunks from MongoDB...\n");

    const totalChunks = await KnowledgeChunk.countDocuments();
    console.log(`========================================`);
    console.log(`TOTAL KNOWLEDGE CHUNKS: ${totalChunks}`);
    console.log(`========================================\n`);

    if (totalChunks === 0) {
      console.log("No knowledge chunks found in the database.");
      return;
    }

    const summary = await KnowledgeChunk.aggregate([
      {
        $group: {
          _id: "$documentId",
          documentTitle: { $first: "$documentTitle" },
          category: { $first: "$category" },
          fileName: { $first: "$fileName" },
          chunkCount: { $sum: 1 },
          minPage: { $min: "$pageNumber" },
          maxPage: { $max: "$pageNumber" },
        },
      },
      {
        $sort: { documentTitle: 1 },
      },
    ]);

    console.log("Indexed Documents Summary:");
    summary.forEach((doc, idx) => {
      console.log(`\n${idx + 1}. Document: ${doc.documentTitle}`);
      console.log(`   Document ID: ${doc._id}`);
      console.log(`   Category:    ${doc.category}`);
      console.log(`   File Name:   ${doc.fileName}`);
      console.log(`   Chunks:      ${doc.chunkCount}`);
      console.log(`   Pages:       ${doc.minPage} to ${doc.maxPage}`);
    });

    console.log("\n========================================\n");
  } catch (error) {
    console.error("\nERROR CHECKING KNOWLEDGE CHUNKS:");
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB connection closed.\n");
  }
};

checkKnowledgeChunks();
