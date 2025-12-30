import { factchecks } from "../config/storage.js";

const FactCheck = {
  findOne: factchecks.findOne,
  find: factchecks.find,
  create: factchecks.create,
};

export default FactCheck;
