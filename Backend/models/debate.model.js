import { debates } from "../config/storage.js";

const Debate = {
  findOne: debates.findOne,
  findById: debates.findById,
  find: debates.find,
  create: debates.create,
  updateOne: debates.updateOne,
  findByIdAndUpdate: debates.findByIdAndUpdate,
};

export default Debate;
