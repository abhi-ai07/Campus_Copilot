import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const MAX_PDF_SIZE = 20 * 1024 * 1024; // 20 MB
const CHUNK_SIZE = 1200;
const CHUNK_OVERLAP = 150;

// Clean extracted PDF text
const cleanText = (text) => {
  return text
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

// Split text into overlapping chunks
const splitIntoChunks = (text) => {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    let end = Math.min(start + CHUNK_SIZE, text.length);

    // Prefer breaking at a word boundary
    if (end < text.length) {
      const boundary = text.lastIndexOf(" ", end);

      if (boundary > start + CHUNK_SIZE * 0.6) {
        end = boundary;
      }
    }

    const chunk = text.slice(start, end).trim();

    if (chunk.length > 0) {
      chunks.push(chunk);
    }

    if (end >= text.length) break;

    const nextStart = Math.max(end - CHUNK_OVERLAP, start + 1);
    start = nextStart;
  }

  return chunks;
};

// Extract text from PDF pages

const extractPdfText = async (buffer) => {
  const loadingTask = getDocument({
    data: new Uint8Array(buffer),
    useSystemFonts: true,
  });

  const pdf = await loadingTask.promise;
  const pages = [];

  try {
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();

      const pageText = content.items
        .filter((item) => typeof item.str === "string")
        .map((item) => item.str + (item.hasEOL ? "\n" : " "))
        .join("");

      pages.push({
        pageNumber,
        text: cleanText(pageText),
      });

      page.cleanup();
    }

    return {
      pageCount: pdf.numPages,
      pages,
    };
  } finally {
    await loadingTask.destroy();
  }
};

// Download and process a Sanity PDF document
export const processPdfDocument = async (document) => {
  if (!document || !document.documentUrl) {
    throw new Error("Document URL is missing.");
  }

  if (document.mimeType && document.mimeType !== "application/pdf") {
    throw new Error("Only PDF documents are supported.");
  }

  const response = await fetch(document.documentUrl, {
    signal: AbortSignal.timeout(30000),
  });

  if (!response.ok) {
    throw new Error(`PDF download failed with status ${response.status}.`);
  }

  const contentLength = Number(response.headers.get("content-length") || 0);

  if (contentLength > MAX_PDF_SIZE) {
    throw new Error("PDF exceeds the 20 MB size limit.");
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (buffer.length > MAX_PDF_SIZE) {
    throw new Error("PDF exceeds the 20 MB size limit.");
  }

  // Verify that the downloaded file is actually a PDF
  if (buffer.subarray(0, 5).toString() !== "%PDF-") {
    throw new Error("The downloaded file is not a valid PDF.");
  }

  const { pageCount, pages } = await extractPdfText(buffer);

  const chunks = [];

  for (const page of pages) {
    if (!page.text) continue;

    const pageChunks = splitIntoChunks(page.text);

    pageChunks.forEach((text, index) => {
      chunks.push({
        chunkIndex: chunks.length,
        pageNumber: page.pageNumber,
        text,
      });
    });
  }

  if (chunks.length === 0) {
    throw new Error(
      "No readable text found in this PDF. It may be a scanned document.",
    );
  }

  return {
    documentId: document._id,
    title: document.title || "Untitled Document",
    description: document.description || "",
    category: document.category || "General",
    fileName: document.fileName || "document.pdf",
    sourceUrl: document.documentUrl,
    pageCount,
    totalChunks: chunks.length,
    chunks,
  };
};
