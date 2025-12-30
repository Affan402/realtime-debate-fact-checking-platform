// src/modules/ai/prompts/factCheck.prompt.js

module.exports = {
  generateFactCheckPrompt: (claimText) => {
    return `
      You are a fact-checking AI. Analyze the following claim:
      "${claimText}"

      - Is it verified or false?
      - Provide a confidence score between 0 and 1
      - Give the reason and source if available

      Format:
      {
        "verified": boolean,
        "confidence": number,
        "reason": string
      }
    `;
  }
};
