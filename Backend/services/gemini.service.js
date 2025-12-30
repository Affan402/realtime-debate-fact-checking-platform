import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function detectFallacyWithGemini(claim) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Analyze this claim for logical fallacies: "${claim}". 
    
Respond with ONLY a JSON object (no markdown, no extra text):
{
  "fallacy": "fallacy name or 'None'",
  "confidence": 0-100,
  "explanation": "brief explanation"
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    
    // Try to parse as JSON
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      // If parsing fails, return default
      console.log("Could not parse Gemini response:", text);
    }

    return { fallacy: "None", confidence: 0, explanation: "Unable to determine" };
  } catch (error) {
    console.error("Gemini Fallacy Detection Error:", error);
    return { fallacy: "None", confidence: 0, explanation: "Error analyzing fallacy" };
  }
}

export async function calculateCredibilityWithGemini(evidence) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Rate the credibility of this evidence: "${evidence}". Consider source reliability, specificity, and factuality.
    
Respond with ONLY a JSON object (no markdown, no extra text):
{
  "score": 0-100,
  "reliability": "low/medium/high",
  "explanation": "brief explanation"
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    
    // Try to parse as JSON
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.log("Could not parse Gemini response:", text);
    }

    return { score: 50, reliability: "medium", explanation: "Unable to determine" };
  } catch (error) {
    console.error("Gemini Credibility Error:", error);
    return { score: 50, reliability: "medium", explanation: "Error analyzing credibility" };
  }
}

export async function generateDebateSummary(debateTitle, arguments) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const argumentsText = arguments
      .map(arg => `${arg.speakerName}: ${arg.claim}`)
      .join("\n");

    const prompt = `Summarize this debate in 2-3 sentences:
Topic: ${debateTitle}

Arguments:
${argumentsText}

Provide ONLY the summary text, no extra formatting.`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Gemini Summary Error:", error);
    return "Unable to generate summary";
  }
}

export async function generateAIFeedback(argument) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Provide constructive feedback on this debate argument:
Speaker: ${argument.speakerName}
Claim: ${argument.claim}
Evidence: ${argument.evidence}

Respond with ONLY a JSON object (no markdown, no extra text):
{
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "suggestions": ["suggestion1", "suggestion2"]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.log("Could not parse Gemini response:", text);
    }

    return { 
      strengths: ["Clear claim"], 
      weaknesses: ["Needs more evidence"], 
      suggestions: ["Add more sources"] 
    };
  } catch (error) {
    console.error("Gemini Feedback Error:", error);
    return { 
      strengths: [], 
      weaknesses: [], 
      suggestions: ["Unable to generate feedback"] 
    };
  }
}
