import dotenv from "dotenv";

dotenv.config();

// Load modules after environment variables are loaded
const { default: connectDB } = await import("../src/config/db.js");
const sanityClient = (await import("../src/config/sanityClient.js")).default;
const { ingestDocument } = await import("../src/services/knowledgeService.js");

const ingestAllDocuments = async () => {
  try {
    console.log("\nConnecting to MongoDB...\n");

    await connectDB();

    console.log("Fetching published PDF documents from Sanity...\n");

    const documents = await sanityClient.fetch(`
      *[_type == "collegeDocument" && isPublished == true && defined(documentFile.asset->url)] {
        _id,
        title,
        description,
        category,
        "documentUrl": documentFile.asset->url,
        "fileName": documentFile.asset->originalFilename,
        "mimeType": documentFile.asset->mimeType
      }
    `);

    if (!documents.length) {
      console.log("No published documents found.");
      return;
    }

    console.log(`Found ${documents.length} documents.\n`);

    const results = [];

    for (const document of documents) {
      try {
        if (document.mimeType && document.mimeType !== "application/pdf") {
          console.log(`Skipping non-PDF: ${document.title}`);
          continue;
        }

        const result = await ingestDocument(document);
        results.push(result);
      } catch (error) {
        console.error(`Failed to ingest "${document.title}":`, error.message);
      }
    }

    console.log("\n========== INGESTION SUMMARY ==========");
    console.log("Successfully processed:", results.length);
    console.log(
      "Total chunks saved:",
      results.reduce((total, item) => total + item.totalChunks, 0),
    );

    results.forEach((item) => {
      console.log(`- ${item.title}: ${item.totalChunks} chunks`);
    });
  } catch (error) {
    console.error("\nDOCUMENT INGESTION FAILED:");
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    const mongoose = (await import("mongoose")).default;
    await mongoose.disconnect();
    console.log("\nMongoDB connection closed.");
  }
};

ingestAllDocuments();
