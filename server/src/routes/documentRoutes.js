import express from "express";
import {
  getDocuments,
  getDocumentById,
} from "../controllers/documentController.js";

const router = express.Router();

router.get("/", getDocuments);
router.get("/:id", getDocumentById);

export default router;
