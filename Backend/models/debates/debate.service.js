// src/modules/debates/debate.service.js
const Debate = require("./debate.model");
const ArgumentService = require("../arguments/argument.service");
const aiProcessor = require("../ai/ai.processor");
const redisClient = require("../../config/redis");

class DebateService {
  // Create a new debate
  static async createDebate({ title, participants }) {
    return Debate.create({
      title,
      participants,
      status: "WAITING",
      currentTurn: null,
      createdAt: new Date(),
    });
  }

  // Start the next turn in debate
  static async nextTurn(debateId) {
    const debate = await Debate.findById(debateId);
    if (!debate) throw new Error("Debate not found");

    // Simple round-robin logic
    const currentIndex = debate.currentTurn ? debate.participants.indexOf(debate.currentTurn) : -1;
    const nextIndex = (currentIndex + 1) % debate.participants.length;
    debate.currentTurn = debate.participants[nextIndex];
    debate.status = "ACTIVE_TURN";
    await debate.save();

    return debate.currentTurn;
  }

  // End debate & trigger AI summary
  static async endDebate(debateId) {
    const debate = await Debate.findById(debateId);
    if (!debate) throw new Error("Debate not found");

    debate.status = "DEBATE_ENDED";
    await debate.save();

    // Fetch all arguments
    const argumentsTree = await ArgumentService.getArgumentsByDebate(debateId);

    // Trigger AI summary (async)
    aiProcessor.generateDebateSummary(debateId, argumentsTree);

    return debate;
  }
}

module.exports = DebateService;
