import { users } from "../config/storage.js";

const UserModel = {
  findOne: users.findOne,
  findById: users.findById,
  find: users.find,
  create: users.create,
  updateOne: users.updateOne,
  findByIdAndUpdate: users.findByIdAndUpdate,
  findOneAndUpdate: users.findOneAndUpdate,
};

export default UserModel;