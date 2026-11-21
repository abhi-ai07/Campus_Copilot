import crypto from "node:crypto";
import sanityClient from "../config/sanityClient.js";
import {
  ingestDocument,
  removeDocumentKnowledge,
} from "../services/knowledgeService.js";

export const handleSanityWebhook = async (req, res) => {
  try {
    // 1. Verify webhook secret
    const receivedSecret = req.get("x-campuscopilot-webhook-secret");
    const expectedSecret = process.env.SANITY_WEBHOOK_SECRET;

    if (!expectedSecret || !receivedSecret) {
      return res.status(401).json({
        success: false,
        message: "Webhook authentication failed.",
      });
    }

    const receivedBuffer = Buffer.from(receivedSecret);
    const expectedBuffer = Buffer.from(expectedSecret);

    if (
      receivedBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(receivedBuffer, expectedBuffer)
    ) {
      return res.status(401).json({
        success: false,
        message: "Webhook authentication failed.",
      });
    }

    // 2. Get document ID from Sanity webhook payload
    const documentId = req.body?._id || req.body?.documentId;

    if (
      !documentId ||
      typeof documentId !== "string" ||
      documentId.startsWith("drafts.")
    ) {
      return res.status(400).json({
        success: false,
        message: "A valid published document ID is required.",
      });
    }

    // 3. Fetch the latest document from Sanity
    const document = await sanityClient.fetch(
      `*[_type == "collegeDocument" && _id == $id][0] {
        _id,
        title,
        description,
        category,
        isPublished,
        "documentUrl": documentFile.asset->url,
        "fileName": documentFile.asset->originalFilename,
        "mimeType": documentFile.asset->mimeType
      }`,
      { id: documentId },
    );

    // 4. Remove knowledge if document was deleted or unpublished
    if (!document || document.isPublished !== true) {
      const deletedCount = await removeDocumentKnowledge(documentId);

      return res.status(200).json({
        success: true,
        message: "Document removed from the knowledge base.",
        deletedChunks: deletedCount,
      });
    }

    // 5. Only process PDF documents
    if (!document.documentUrl || document.mimeType !== "application/pdf") {
      const deletedCount = await removeDocumentKnowledge(documentId);

      return res.status(200).json({
        success: true,
        message: "Only published PDF documents are processed.",
        deletedChunks: deletedCount,
      });
    }

    // 6. Process PDF and update MongoDB knowledge base
    const result = await ingestDocument(document);

    return res.status(200).json({
      success: true,
      message: "PDF successfully added to the knowledge base.",
      data: result,
    });
  } catch (error) {
    console.error("Sanity Webhook Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to process Sanity document webhook.",
    });
  }
};
