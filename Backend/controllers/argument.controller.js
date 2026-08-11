import Argument from "../models/argument.model.js";
import { detectFallacy } from "../services/fallacy.service.js";
import { calculateCredibility } from "../services/credibility.service.js";

export const createArgument = async (req, res) => {
  try {
    const { debateId, speakerName, claim, evidence } = req.body;

    if (!speakerName || !claim) {
      return res.status(400).json({ 
        message: "Speaker name and claim are required",
        status: false 
      });
    }

    const fallacy = await detectFallacy(claim);
    const credibilityScore = calculateCredibility(evidence);

    const argument = Argument.create({
      debateId,
      speakerName,
      claim,
      evidence,
      fallacy,
      credibilityScore
    });

    res.status(201).json({ 
      message: "Argument created successfully",
      data: argument,
      status: true 
    });
  } catch (error) {
    res.status(500).json({ 
      message: error.message || "Error creating argument",
      status: false 
    });
  }
};

export const getArguments = async (req, res) => {
  try {
    const { debateId } = req.query;
    
    const args = debateId 
      ? Argument.find({ debateId }) 
      : Argument.find();

    res.status(200).json({ 
      message: "Arguments retrieved successfully",
      data: args,
      status: true 
    });
  } catch (error) {
    res.status(500).json({ 
      message: error.message || "Error retrieving arguments",
      status: false 
    });
  }
};

export const getArgumentById = async (req, res) => {
  try {
    const { id } = req.params;
    const argument = Argument.findById(id);
    
    if (!argument) {
      return res.status(404).json({ 
        message: "Argument not found",
        status: false 
      });
    }

    res.status(200).json({ 
      message: "Argument retrieved successfully",
      data: argument,
      status: true 
    });
  } catch (error) {
    res.status(500).json({ 
      message: error.message || "Error retrieving argument",
      status: false 
    });
  }
};
