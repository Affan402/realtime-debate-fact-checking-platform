import express from "express";
import { getAIFeedback, getDevilsAdvocate } from "../controllers/ai.controller.js";

const router = express.Router();

// GET /api/ai/feedback/:debateId - Get AI feedback for a debate
router.get("/feedback/:debateId", getAIFeedback);

// POST /api/ai/devils-advocate - Generate a counter-argument
router.post("/devils-advocate", getDevilsAdvocate);

export default router;
