import mongoose from "mongoose";

// FactCheck schema — replaces the JSON-file "factchecks" storage.
// argumentId is a plain string referencing Argument._id (also a string).
const factCheckSchema = new mongoose.Schema(
  {
    // String _id preserves legacy IDs from the JSON era.
    _id: { type: String, default: () => Date.now().toString() },
    argumentId: { type: String, required: true, index: true },
    verified: { type: Boolean, required: true },
    confidence: { type: Number, default: 0, min: 0, max: 100 },
    reason: { type: String, default: "" },
    speakerName: { type: String, default: "" },
    claim: { type: String, default: "" },
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

const FactCheck = mongoose.model("FactCheck", factCheckSchema);

// Same method surface as the old storage object. All methods return promises.
const FactCheckModel = {
  // No .lean() — keeps toJSON transform (adds `id`) active in responses.
  findOne: (query) => FactCheck.findOne(query),
  find: (query = {}) => FactCheck.find(query).sort({ createdAt: 1 }),
  create: (data) => FactCheck.create(data),
  updateOne: (query, update) => FactCheck.updateOne(query, update),
  findByIdAndUpdate: (id, update, opts = { new: true }) =>
    FactCheck.findByIdAndUpdate(id, update, opts),
};

export default FactCheckModel;
