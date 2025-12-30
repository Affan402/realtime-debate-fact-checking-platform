import Argument from "../models/argument.model.js";

export const getAnalytics = async (req, res) => {
  try {
    const { id } = req.params;
    const argumentsList = Argument.find({ debateId: id });

    const fallaciesDetected = argumentsList.filter(a => a.fallacy && a.fallacy !== "None").length;
    const credibilityScores = argumentsList.filter(a => a.credibilityScore).map(a => a.credibilityScore);
    const averageCredibility = credibilityScores.length > 0 
      ? (credibilityScores.reduce((a, b) => a + b, 0) / credibilityScores.length).toFixed(2)
      : 0;

    res.status(200).json({
      message: "Analytics retrieved successfully",
      data: {
        debateId: id,
        totalArguments: argumentsList.length,
        fallaciesDetected: fallaciesDetected,
        averageCredibility: averageCredibility,
        arguments: argumentsList
      },
      status: true
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Error retrieving analytics",
      status: false
    });
  }
};
