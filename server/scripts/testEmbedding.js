import dotenv from "dotenv";

dotenv.config();

const sanityClient = (await import("../src/config/sanityClient.js")).default;
const { processPdfDocument } =
  await import("../src/services/documentProcessor.js");
const { generateEmbedding } =
  await import("../src/services/embeddingService.js");

const testEmbedding = async () => {
  try {
    console.log("\nAPI Key Loaded:", Boolean(process.env.GEMINI_API_KEY));
    console.log("\nFetching PDF from Sanity...\n");

    const document = await sanityClient.fetch(`
      *[_type == "collegeDocument" && isPublished == true && defined(documentFile.asset->url)][0] {
        _id,
        title,
        description,
        category,
        "documentUrl": documentFile.asset->url,
        "fileName": documentFile.asset->originalFilename,
        "mimeType": documentFile.asset->mimeType
      }
    `);

    if (!document) {
      throw new Error("No published PDF found in Sanity.");
    }

    console.log("Document:", document.title);
    console.log("Extracting PDF text...\n");

    const processedDocument = await processPdfDocument(document);

    if (!processedDocument.chunks.length) {
      throw new Error("No chunks available for embedding.");
    }

    const firstChunk = processedDocument.chunks[0];

    console.log("Generating embedding for first chunk...\n");

    const embedding = await generateEmbedding(firstChunk.text);

    console.log("\nEMBEDDING GENERATED SUCCESSFULLY!");
    console.log("--------------------------------");
    console.log("Document:", processedDocument.title);
    console.log("Chunk Index:", firstChunk.chunkIndex);
    console.log("Page Number:", firstChunk.pageNumber);
    console.log("Embedding Dimensions:", embedding.length);
    console.log("First 10 Vector Values:", embedding.slice(0, 10));
  } catch (error) {
    console.error("\nEMBEDDING TEST FAILED:");
    console.error(error.message);
    process.exitCode = 1;
  }
};

testEmbedding();
