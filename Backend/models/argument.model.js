import mongoose from "mongoose";

// Argument schema — replaces the JSON-file "arguments" storage.
// debateId is a plain string (matches Debate._id which is also a string).
const argumentSchema = new mongoose.Schema(
  {
    // String _id preserves legacy IDs like "1786436076675" from the JSON era.
    _id: { type: String, default: () => Date.now().toString() },
    debateId: { type: String, required: true, index: true },
    speakerName: { type: String, required: true },
    claim: { type: String, required: true },
    evidence: { type: String, default: "" },
    // fallacy is sometimes a plain string ("Ad Hominem") and sometimes an
    // object ({ fallacy, confidence, explanation }) — Mixed handles both.
    fallacy: { type: mongoose.Schema.Types.Mixed, default: {} },
    credibilityScore: { type: Number, default: 0, min: 0, max: 1 },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (doc, ret) => {
        ret.id = ret._id;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

const Argument = mongoose.model("Argument", argumentSchema);

// Same method surface as the old storage object. All methods return promises.
const ArgumentModel = {
  // No .lean() — keeps toJSON transform (adds `id`) active in responses.
  findOne: (query) => Argument.findOne(query),
  findById: (id) => Argument.findById(id),
  find: (query = {}) => Argument.find(query).sort({ createdAt: 1 }),
  create: (data) => Argument.create(data),
  updateOne: (query, update) => Argument.updateOne(query, update),
  findByIdAndUpdate: (id, update, opts = { new: true }) =>
    Argument.findByIdAndUpdate(id, update, opts),
  findOneAndUpdate: (query, update, opts = { new: true }) =>
    Argument.findOneAndUpdate(query, update, opts),
};

export default ArgumentModel;
