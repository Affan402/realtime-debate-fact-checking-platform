import mongoose from "mongoose";

// Debate schema — replaces the JSON-file "debates" storage.
// _id is a String so existing IDs like "1786435967997" (hardcoded in the
// frontend as the default debate) keep working after migration.
const debateSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => Date.now().toString() },
    title: { type: String, required: true },
    topic: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "live", "scheduled", "closed"],
      default: "active",
    },
  },
  {
    timestamps: true, // createdAt + updatedAt
    // Expose _id as `id` in JSON responses so the frontend (which reads .id)
    // keeps working without changes.
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

const Debate = mongoose.model("Debate", debateSchema);

// Keep the same method surface the old storage object exposed, so controllers
// need minimal changes. All methods return promises (Mongoose queries).
// NOTE: no .lean() — we return full documents so the toJSON transform
// (which adds `id`) runs when res.json() serializes the response.
const DebateModel = {
  findOne: (query) => Debate.findOne(query),
  findById: (id) => Debate.findById(id),
  find: (query = {}) => Debate.find(query),
  create: (data) => Debate.create(data),
  updateOne: (query, update) => Debate.updateOne(query, update),
  findByIdAndUpdate: (id, update, opts = { new: true }) =>
    Debate.findByIdAndUpdate(id, update, opts),
  findOneAndUpdate: (query, update, opts = { new: true }) =>
    Debate.findOneAndUpdate(query, update, opts),
};

export default DebateModel;
