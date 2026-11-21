import dotenv from "dotenv";

dotenv.config();

// Load modules after environment variables
const { default: connectDB } = await import("../src/config/db.js");

const { retrieveRelevantChunks } =
  await import("../src/services/knowledgeService.js");

const mongoose = (await import("mongoose")).default;

const testVectorSearch = async () => {
  try {
    console.log("\nConnecting to MongoDB...\n");

    await connectDB();

    // Test question
    const question = "Which campuses does Graphic Era Hill University have?";

    console.log("Student Question:");
    console.log(question);

    console.log("\nSearching relevant knowledge chunks...\n");

    const results = await retrieveRelevantChunks(question, 5);

    if (!results.length) {
      console.log("No relevant chunks found.");
      return;
    }

    console.log("VECTOR SEARCH SUCCESSFUL!");
    console.log("================================");

    console.log("Results Found:", results.length);

    results.forEach((chunk, index) => {
      console.log(`\n---------- RESULT ${index + 1} ----------`);

      console.log("Document:", chunk.documentTitle);
      console.log("Category:", chunk.category);
      console.log("Page Number:", chunk.pageNumber);
      console.log("Chunk Index:", chunk.chunkIndex);
      console.log("Relevance Score:", chunk.score);

      console.log("\nRetrieved Text:");
      console.log(chunk.text);
    });
  } catch (error) {
    console.error("\nVECTOR SEARCH TEST FAILED:");
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("\nMongoDB connection closed.");
  }
};

testVectorSearch();
