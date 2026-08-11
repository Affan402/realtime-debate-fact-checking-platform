import Argument from "../models/argument.model.js";
import { generateDebateSummary, detectFallacyWithGemini } from "../services/gemini.service.js";

// GET /api/ai/feedback/:debateId
// Returns AI-generated feedback for a debate: summary, fallacies, and aggregated insights
export const getAIFeedback = async (req, res) => {
  try {
    const { debateId } = req.params;
    const argumentsList = Argument.find({ debateId });

    if (!argumentsList || argumentsList.length === 0) {
      return res.status(200).json({
        message: "No arguments found for this debate",
        data: {
          debateId,
          summary: "No arguments have been submitted yet for this debate.",
          fallacies: [],
          speakers: [],
          totalArguments: 0,
        },
        status: true,
      });
    }

    // Generate debate summary using Gemini
    const summaryText = await generateDebateSummary(
      `Debate ${debateId}`,
      argumentsList
    );

    // Collect fallacies from arguments that have them
    const fallacies = argumentsList
      .filter(
        (a) =>
          a.fallacy &&
          a.fallacy !== "None" &&
          !(typeof a.fallacy === "object" && Object.keys(a.fallacy).length === 0)
      )
      .map((a) => ({
        argumentId: a.id,
        speaker: a.speakerName,
        claim: a.claim,
        fallacy:
          typeof a.fallacy === "object" ? a.fallacy.fallacy || "Unknown" : a.fallacy,
        confidence:
          typeof a.fallacy === "object" ? a.fallacy.confidence || 0 : 50,
        explanation:
          typeof a.fallacy === "object"
            ? a.fallacy.explanation || ""
            : "Fallacy detected",
      }));

    // Get unique speakers
    const speakers = [
      ...new Set(argumentsList.map((a) => a.speakerName).filter(Boolean)),
    ];

    // Build key points from arguments
    const keyPoints = argumentsList.slice(0, 5).map((a) => ({
      speaker: a.speakerName,
      point: a.claim,
      impact:
        a.credibilityScore >= 0.7
          ? "high"
          : a.credibilityScore >= 0.4
          ? "medium"
          : "low",
    }));

    // Determine "winner" - speaker with highest average credibility
    const speakerStats = {};
    argumentsList.forEach((a) => {
      const name = a.speakerName || "Unknown";
      if (!speakerStats[name]) {
        speakerStats[name] = { totalCredibility: 0, count: 0 };
      }
      speakerStats[name].totalCredibility += a.credibilityScore || 0;
      speakerStats[name].count += 1;
    });
    const winner =
      Object.entries(speakerStats)
        .map(([name, stats]) => ({
          name,
          avg:
            stats.count > 0 ? stats.totalCredibility / stats.count : 0,
        }))
        .sort((a, b) => b.avg - a.avg)[0]?.name || "N/A";

    res.status(200).json({
      message: "AI feedback generated successfully",
      data: {
        debateId,
        summary: summaryText,
        fallacies,
        speakers,
        keyPoints,
        winner,
        totalArguments: argumentsList.length,
        totalFallacies: fallacies.length,
      },
      status: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Error generating AI feedback",
      status: false,
    });
  }
};

// POST /api/ai/devils-advocate
// Generates a counter-argument to a given claim using Gemini
export const getDevilsAdvocate = async (req, res) => {
  try {
    const { claim } = req.body;

    if (!claim) {
      return res.status(400).json({
        message: "Claim is required",
        status: false,
      });
    }

    // Use Gemini to generate a counter-argument
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are playing devil's advocate. Given this claim: "${claim}", provide a strong counter-argument.

Respond with ONLY a JSON object (no markdown, no extra text):
{
  "counterArgument": "the counter-argument",
  "evidence": ["evidence1", "evidence2", "evidence3"],
  "conclusion": "concluding statement",
  "strength": 0-100
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return res.status(200).json({
          message: "Devil's advocate response generated",
          data: JSON.parse(jsonMatch[0]),
          status: true,
        });
      }
    } catch (e) {
      console.log("Could not parse Gemini response:", text);
    }

    res.status(200).json({
      message: "Devil's advocate response generated",
      data: {
        counterArgument: "Unable to generate counter-argument",
        evidence: [],
        conclusion: "",
        strength: 0,
      },
      status: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Error generating devil's advocate response",
      status: false,
    });
  }
};
