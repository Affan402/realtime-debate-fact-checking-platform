import Debate from "../models/debate.model.js";

export const createDebate = async (req, res) => {
  try {
    const { title, topic, status } = req.body;
    
    if (!title || !topic) {
      return res.status(400).json({ 
        message: "Title and topic are required",
        status: false 
      });
    }

    const debate = Debate.create({ title, topic, status: status || "active" });
    res.status(201).json({ 
      message: "Debate created successfully",
      data: debate,
      status: true 
    });
  } catch (error) {
    res.status(500).json({ 
      message: error.message || "Error creating debate",
      status: false 
    });
  }
};

export const getDebates = async (req, res) => {
  try {
    const debates = Debate.find();
    res.status(200).json({ 
      message: "Debates retrieved successfully",
      data: debates,
      status: true 
    });
  } catch (error) {
    res.status(500).json({ 
      message: error.message || "Error retrieving debates",
      status: false 
    });
  }
};

export const getDebateById = async (req, res) => {
  try {
    const { id } = req.params;
    const debate = Debate.findById(id);
    
    if (!debate) {
      return res.status(404).json({ 
        message: "Debate not found",
        status: false 
      });
    }

    res.status(200).json({ 
      message: "Debate retrieved successfully",
      data: debate,
      status: true 
    });
  } catch (error) {
    res.status(500).json({ 
      message: error.message || "Error retrieving debate",
      status: false 
    });
  }
};

export const updateDebate = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedDebate = Debate.findByIdAndUpdate(id, req.body);
    
    if (!updatedDebate) {
      return res.status(404).json({ 
        message: "Debate not found",
        status: false 
      });
    }

    res.status(200).json({ 
      message: "Debate updated successfully",
      data: updatedDebate,
      status: true 
    });
  } catch (error) {
    res.status(500).json({ 
      message: error.message || "Error updating debate",
      status: false 
    });
  }
};
