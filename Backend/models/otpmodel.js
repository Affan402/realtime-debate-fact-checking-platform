import mongoose from "mongoose";

// OTP schema — replaces the JSON-file "otps" storage.
// NOTE: `Isverified` (capital I) is the historical field name used by Auth.js.
// The TTL index auto-deletes OTPs 10 minutes after creation, replacing the
// old setTimeout-based cleanup in storage.js.
const otpSchema = new mongoose.Schema(
  {
    // String _id preserves legacy IDs from the JSON era.
    _id: { type: String, default: () => Date.now().toString() },
    email: { type: String, required: true, index: true },
    otp: { type: String, required: true },
    Isverified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now, expires: 600 }, // 10 minutes
  },
  {
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

const OTP = mongoose.model("OTP", otpSchema);

// Same method surface as the old storage object. All methods return promises.
const OTPModel = {
  // No .lean() — keeps toJSON transform (adds `id`) active in responses.
  findOne: (query) => OTP.findOne(query),
  find: (query = {}) => OTP.find(query).sort({ createdAt: -1 }),
  create: (data) => OTP.create(data),
  deleteOne: (query) => OTP.deleteOne(query),
  findByIdAndUpdate: (id, update, opts = { new: true }) =>
    OTP.findByIdAndUpdate(id, update, opts),
};

export default OTPModel;