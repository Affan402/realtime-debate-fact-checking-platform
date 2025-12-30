// src/modules/arguments/argument.service.js
const Argument = require("./argument.model");
const aiQueue = require("../ai/ai.queue");
const redisClient = require("../../config/redis");

class ArgumentService {
  // Create a new argument
  static async createArgument({ debateId, speakerId, claimText, parentArgumentId = null, relation = "support" }) {
    // Save to DB
    const argument = await Argument.create({
      debateId,
      speakerId,
      claimText,
      parentArgumentId,
      relation,
      createdAt: new Date(),
    });

    // Emit to AI queue for fact-checking async
    await aiQueue.addFactCheckJob(argument);

    return argument;
  }

  // Fetch arguments for a debate (threaded)
  static async getArgumentsByDebate(debateId) {
    const argumentsList = await Argument.find({ debateId }).sort({ createdAt: 1 }).lean();
    const map = new Map();
    argumentsList.forEach(arg => map.set(arg._id.toString(), { ...arg, children: [] }));
    const rootArgs = [];
    map.forEach(arg => {
      if (arg.parentArgumentId) {
        const parent = map.get(arg.parentArgumentId.toString());
        if (parent) parent.children.push(arg);
      } else {
        rootArgs.push(arg);
      }
    });
    return rootArgs;
  }

  // Update AI annotations after fact-check
  static async updateAIAnnotations(argumentId, aiAnnotations) {
    return Argument.findByIdAndUpdate(argumentId, { aiAnnotations }, { new: true });
  }
}

module.exports = ArgumentService;

