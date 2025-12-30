import { detectFallacyWithGemini } from "./gemini.service.js";

// Basic fallacy detection (fast)
const basicFallacyDetection = (text) => {
  if (!text) return "None";

  const lower = text.toLowerCase();
  if (lower.includes("you are stupid") || lower.includes("idiot")) {
    return "Ad Hominem";
  }
  if (lower.includes("everyone knows") || lower.includes("common sense")) {
    return "Appeal to Common Belief";
  }
  if (lower.includes("if you don't agree")) {
    return "False Dilemma";
  }
  return "None";
};

// Enhanced fallacy detection using Gemini
export const detectFallacy = async (text) => {
  // First try basic detection for speed
  const basicResult = basicFallacyDetection(text);
  if (basicResult !== "None") {
    return basicResult;
  }

  // Use Gemini for deeper analysis
  try {
    const result = await detectFallacyWithGemini(text);
    return result.fallacy || "None";
  } catch (error) {
    console.error("Fallacy detection error:", error);
    return "None";
  }
};
