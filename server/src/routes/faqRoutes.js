import express from "express";
import { getFAQs, getFAQById } from "../controllers/faqController.js";

const router = express.Router();

router.get("/", getFAQs);
router.get("/:id", getFAQById);

export default router;
