import express from "express";
import { handleSanityWebhook } from "../controllers/webhookController.js";

const router = express.Router();

router.post("/sanity", handleSanityWebhook);

export default router;
