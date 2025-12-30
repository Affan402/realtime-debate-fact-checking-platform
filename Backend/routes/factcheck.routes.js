import express from "express";
import { createFactCheck, getFactChecks } from "../controllers/factcheck.controller.js";

const router = express.Router();
router.post("/", createFactCheck);
router.get("/", getFactChecks);

export default router;
