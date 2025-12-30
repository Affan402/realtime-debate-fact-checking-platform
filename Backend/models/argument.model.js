import { argumentsStorage } from "../config/storage.js";

const Argument = {
  findOne: argumentsStorage.findOne,
  findById: argumentsStorage.findById,
  find: argumentsStorage.find,
  create: argumentsStorage.create,
  updateOne: argumentsStorage.updateOne,
  findByIdAndUpdate: argumentsStorage.findByIdAndUpdate,
};

export default Argument;
