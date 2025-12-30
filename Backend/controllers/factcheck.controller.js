import FactCheck from "../models/factcheck.model.js";

export const createFactCheck = async (req, res) => {
  try {
    const { argumentId, verified, confidence, reason } = req.body;

    if (!argumentId || verified === undefined) {
      return res.status(400).json({ 
        message: "Argument ID and verified status are required",
        status: false 
      });
    }

    const fact = FactCheck.create({
      argumentId,
      verified,
      confidence: confidence || 0,
      reason
    });

    res.status(201).json({ 
      message: "Fact check created successfully",
      data: fact,
      status: true 
    });
  } catch (error) {
    res.status(500).json({ 
      message: error.message || "Error creating fact check",
      status: false 
    });
  }
};

export const getFactChecks = async (req, res) => {
  try {
    const { argumentId } = req.query;
    
    const factchecks = argumentId 
      ? FactCheck.find({ argumentId }) 
      : FactCheck.find();

    res.status(200).json({ 
      message: "Fact checks retrieved successfully",
      data: factchecks,
      status: true 
    });
  } catch (error) {
    res.status(500).json({ 
      message: error.message || "Error retrieving fact checks",
      status: false 
    });
  }
};
