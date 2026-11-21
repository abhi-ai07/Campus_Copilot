import sanityClient from "../config/sanityClient.js";

// Get all published college documents
export const getDocuments = async (req, res) => {
  try {
    const documents = await sanityClient.fetch(`
      *[_type == "collegeDocument" && isPublished == true]
      | order(uploadedAt desc) {
        _id,
        title,
        description,
        category,
        uploadedAt,
        "documentUrl": documentFile.asset->url,
        "fileName": documentFile.asset->originalFilename,
        "mimeType": documentFile.asset->mimeType
      }
    `);

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents,
    });
  } catch (error) {
    console.error("Sanity Documents Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch college documents",
      error: error.message,
    });
  }
};

// Get a single published document
export const getDocumentById = async (req, res) => {
  try {
    const document = await sanityClient.fetch(
      `*[_type == "collegeDocument" && _id == $id && isPublished == true][0] {
        _id,
        title,
        description,
        category,
        uploadedAt,
        "documentUrl": documentFile.asset->url,
        "fileName": documentFile.asset->originalFilename,
        "mimeType": documentFile.asset->mimeType
      }`,
      { id: req.params.id },
    );

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    res.status(200).json({
      success: true,
      data: document,
    });
  } catch (error) {
    console.error("Sanity Document Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch document",
      error: error.message,
    });
  }
};
