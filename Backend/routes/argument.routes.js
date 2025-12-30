import express from "express";
import { createArgument, getArguments, getArgumentById } from "../controllers/argument.controller.js";

const router = express.Router();
router.post("/", createArgument);
router.get("/", getArguments);
router.get("/:id", getArgumentById);

export default router;
