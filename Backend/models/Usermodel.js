import mongoose from "mongoose";

// User schema — replaces the JSON-file "users" storage.
const userSchema = new mongoose.Schema(
  {
    // String _id preserves legacy IDs from the JSON era.
    _id: { type: String, default: () => Date.now().toString() },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret.password; // never leak password hashes in responses
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

const User = mongoose.model("User", userSchema);

// Same method surface as the old storage object. All methods return promises.
const UserModel = {
  // No .lean() — keeps toJSON transform (adds `id`, strips password) active.
  findOne: (query) => User.findOne(query),
  findById: (id) => User.findById(id),
  find: (query = {}) => User.find(query),
  create: (data) => User.create(data),
  updateOne: (query, update) => User.updateOne(query, update),
  findByIdAndUpdate: (id, update, opts = { new: true }) =>
    User.findByIdAndUpdate(id, update, opts),
  findOneAndUpdate: (query, update, opts = { new: true }) =>
    User.findOneAndUpdate(query, update, opts),
};

export default UserModel;