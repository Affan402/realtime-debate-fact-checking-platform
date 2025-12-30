// src/modules/ai/ai.processor.js
const { OpenAIProvider } = require("./ai.providers/openai.provider");
const { GeminiProvider } = require("./ai.providers/gemini.provider");
const redisClient = require("../../config/redis");
const factCheckPrompts = require("./prompts/factCheck.prompt");

class AIProcessor {
  // Async Fact Check
  static async factCheckArgument(argument) {
    const cacheKey = `factcheck:${argument.claimText}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) return JSON.parse(cached);

    // Choose provider (Gemini as main, fallback OpenAI)
    let provider = GeminiProvider;
    let result = await provider.process(factCheckPrompts.generateFactCheckPrompt(argument.claimText));

    // Cache result for 24h
    await redisClient.set(cacheKey, JSON.stringify(result), { EX: 24 * 60 * 60 });

    return result;
  }

  // Generate Debate Summary
  static async generateDebateSummary(debateId, argumentsTree) {
    // Using Gemini AI for summary
    const prompt = `Summarize debate ${debateId} with arguments: ${JSON.stringify(argumentsTree)}`;
    const summary = await GeminiProvider.process(prompt);

    // Could save to DB or emit to sockets
    console.log("AI Summary:", summary);
    return summary;
  }
}

module.exports = AIProcessor;
