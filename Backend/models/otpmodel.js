import { otps } from "../config/storage.js";

const OTPModel = {
  findOne: otps.findOne,
  find: otps.find,
  create: otps.create,
  deleteOne: otps.deleteOne,
  findByIdAndUpdate: otps.findByIdAndUpdate,
};

export default OTPModel;