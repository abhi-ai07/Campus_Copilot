import dotenv from "dotenv";
dotenv.config();

import sanityClient from "../src/config/sanityClient.js";
import { processPdfDocument } from "../src/services/documentProcessor.js";

const testPdfProcessing = async () => {
  try {
    console.log("\nFetching a published PDF from Sanity...\n");

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

    console.log("Document found:", document.title);
    console.log("Processing PDF...\n");

    const result = await processPdfDocument(document);

    console.log("PDF PROCESSING SUCCESSFUL!");
    console.log("--------------------------------");
    console.log("Title:", result.title);
    console.log("File:", result.fileName);
    console.log("Total Pages:", result.pageCount);
    console.log("Total Chunks:", result.totalChunks);

    console.log("\nFirst Chunk Preview:");
    console.log(result.chunks[0]?.text);

    console.log("\nFirst Chunk Metadata:");
    console.log({
      chunkIndex: result.chunks[0]?.chunkIndex,
      pageNumber: result.chunks[0]?.pageNumber,
    });
  } catch (error) {
    console.error("\nPDF PROCESSING FAILED:");
    console.error(error.message);
    process.exitCode = 1;
  }
};

testPdfProcessing();
