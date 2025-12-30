import express from "express";
import { createDebate, getDebates, getDebateById, updateDebate } from "../controllers/debate.controller.js";

const router = express.Router();
router.post("/", createDebate);
router.get("/", getDebates);
router.get("/:id", getDebateById);
router.put("/:id", updateDebate);

export default router;
