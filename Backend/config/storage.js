import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "../data");

// Ensure data directory exists
const initStorage = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log("✅ Data directory created");
  }
};

// Generic read from JSON file
const readData = (fileName) => {
  const filePath = path.join(DATA_DIR, fileName);
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(data || "[]");
    }
  } catch (error) {
    console.error(`Error reading ${fileName}:`, error);
  }
  return [];
};

// Generic write to JSON file
const writeData = (fileName, data) => {
  const filePath = path.join(DATA_DIR, fileName);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error(`Error writing to ${fileName}:`, error);
    throw error;
  }
};

// User Storage
export const users = {
  findOne: (query) => {
    const allUsers = readData("users.json");
    return allUsers.find((user) => {
      return Object.keys(query).every((key) => user[key] === query[key]);
    });
  },
  findById: (id) => {
    const allUsers = readData("users.json");
    return allUsers.find((user) => user.id === id || user._id === id);
  },
  find: () => {
    return readData("users.json");
  },
  create: (userData) => {
    const allUsers = readData("users.json");
    const newUser = {
      id: Date.now().toString(),
      _id: Date.now().toString(),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    allUsers.push(newUser);
    writeData("users.json", allUsers);
    return newUser;
  },
  updateOne: (query, update) => {
    const allUsers = readData("users.json");
    const userIndex = allUsers.findIndex((user) => {
      return Object.keys(query).every((key) => user[key] === query[key]);
    });
    if (userIndex !== -1) {
      allUsers[userIndex] = { ...allUsers[userIndex], ...update.userData, updatedAt: new Date() };
      writeData("users.json", allUsers);
      return { modifiedCount: 1 };
    }
    return { modifiedCount: 0 };
  },
  findByIdAndUpdate: (id, update) => {
    const allUsers = readData("users.json");
    const userIndex = allUsers.findIndex((user) => user.id === id || user._id === id);
    if (userIndex !== -1) {
      allUsers[userIndex] = { ...allUsers[userIndex], ...update, updatedAt: new Date() };
      writeData("users.json", allUsers);
      return allUsers[userIndex];
    }
    return null;
  },
  findOneAndUpdate: (query, update) => {
    const allUsers = readData("users.json");
    const userIndex = allUsers.findIndex((user) => {
      return Object.keys(query).every((key) => user[key] === query[key]);
    });
    if (userIndex !== -1) {
      allUsers[userIndex] = { ...allUsers[userIndex], ...update, updatedAt: new Date() };
      writeData("users.json", allUsers);
      return allUsers[userIndex];
    }
    return null;
  },
};

// OTP Storage
export const otps = {
  findOne: (query) => {
    const allOtps = readData("otps.json");
    const results = allOtps.filter((otp) => {
      return Object.keys(query).every((key) => otp[key] === query[key]);
    });
    // Return the most recent one
    return results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] || null;
  },
  find: () => {
    return readData("otps.json");
  },
  create: (otpData) => {
    const allOtps = readData("otps.json");
    const newOtp = {
      id: Date.now().toString(),
      _id: Date.now().toString(),
      ...otpData,
      createdAt: new Date(),
    };
    allOtps.push(newOtp);
    writeData("otps.json", allOtps);
    // Auto-delete after 10 minutes (600 seconds)
    setTimeout(() => {
      const updated = readData("otps.json");
      const filtered = updated.filter((o) => o.id !== newOtp.id);
      writeData("otps.json", filtered);
    }, 600000);
    return newOtp;
  },
  deleteOne: (query) => {
    const allOtps = readData("otps.json");
    const filtered = allOtps.filter((otp) => {
      return !Object.keys(query).every((key) => otp[key] === query[key]);
    });
    if (filtered.length < allOtps.length) {
      writeData("otps.json", filtered);
      return { deletedCount: 1 };
    }
    return { deletedCount: 0 };
  },
  findByIdAndUpdate: (id, update) => {
    const allOtps = readData("otps.json");
    const otpIndex = allOtps.findIndex((otp) => otp.id === id || otp._id === id);
    if (otpIndex !== -1) {
      allOtps[otpIndex] = { ...allOtps[otpIndex], ...update, updatedAt: new Date() };
      writeData("otps.json", allOtps);
      return allOtps[otpIndex];
    }
    return null;
  },
};

// Debate Storage
export const debates = {
  findOne: (query) => {
    const allDebates = readData("debates.json");
    return allDebates.find((debate) => {
      return Object.keys(query).every((key) => debate[key] === query[key]);
    });
  },
  findById: (id) => {
    const allDebates = readData("debates.json");
    return allDebates.find((debate) => debate.id === id);
  },
  find: () => {
    return readData("debates.json");
  },
  create: (debateData) => {
    const allDebates = readData("debates.json");
    const newDebate = {
      id: Date.now().toString(),
      ...debateData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    allDebates.push(newDebate);
    writeData("debates.json", allDebates);
    return newDebate;
  },
  updateOne: (query, update) => {
    const allDebates = readData("debates.json");
    const debateIndex = allDebates.findIndex((debate) => {
      return Object.keys(query).every((key) => debate[key] === query[key]);
    });
    if (debateIndex !== -1) {
      allDebates[debateIndex] = { ...allDebates[debateIndex], ...update, updatedAt: new Date() };
      writeData("debates.json", allDebates);
      return { modifiedCount: 1 };
    }
    return { modifiedCount: 0 };
  },
  findByIdAndUpdate: (id, update) => {
    const allDebates = readData("debates.json");
    const debateIndex = allDebates.findIndex((debate) => debate.id === id);
    if (debateIndex !== -1) {
      allDebates[debateIndex] = { ...allDebates[debateIndex], ...update, updatedAt: new Date() };
      writeData("debates.json", allDebates);
      return allDebates[debateIndex];
    }
    return null;
  },
};

// Argument Storage
export const argumentsStorage = {
  findOne: (query) => {
    const allArguments = readData("arguments.json");
    return allArguments.find((arg) => {
      return Object.keys(query).every((key) => arg[key] === query[key]);
    });
  },
  findById: (id) => {
    const allArguments = readData("arguments.json");
    return allArguments.find((arg) => arg.id === id);
  },
  find: (query) => {
    const allArguments = readData("arguments.json");
    if (!query || Object.keys(query).length === 0) {
      return allArguments;
    }
    return allArguments.filter((arg) => {
      return Object.keys(query).every((key) => arg[key] === query[key]);
    });
  },
  create: (argData) => {
    const allArguments = readData("arguments.json");
    const newArg = {
      id: Date.now().toString(),
      ...argData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    allArguments.push(newArg);
    writeData("arguments.json", allArguments);
    return newArg;
  },
  updateOne: (query, update) => {
    const allArguments = readData("arguments.json");
    const argIndex = allArguments.findIndex((arg) => {
      return Object.keys(query).every((key) => arg[key] === query[key]);
    });
    if (argIndex !== -1) {
      allArguments[argIndex] = { ...allArguments[argIndex], ...update, updatedAt: new Date() };
      writeData("arguments.json", allArguments);
      return { modifiedCount: 1 };
    }
    return { modifiedCount: 0 };
  },
  findByIdAndUpdate: (id, update) => {
    const allArguments = readData("arguments.json");
    const argIndex = allArguments.findIndex((arg) => arg.id === id);
    if (argIndex !== -1) {
      allArguments[argIndex] = { ...allArguments[argIndex], ...update, updatedAt: new Date() };
      writeData("arguments.json", allArguments);
      return allArguments[argIndex];
    }
    return null;
  },
};

// FactCheck Storage
export const factchecks = {
  findOne: (query) => {
    const allFactChecks = readData("factchecks.json");
    return allFactChecks.find((fc) => {
      return Object.keys(query).every((key) => fc[key] === query[key]);
    });
  },
  find: (query) => {
    const allFactChecks = readData("factchecks.json");
    if (!query || Object.keys(query).length === 0) {
      return allFactChecks;
    }
    return allFactChecks.filter((fc) => {
      return Object.keys(query).every((key) => fc[key] === query[key]);
    });
  },
  create: (fcData) => {
    const allFactChecks = readData("factchecks.json");
    const newFc = {
      id: Date.now().toString(),
      ...fcData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    allFactChecks.push(newFc);
    writeData("factchecks.json", allFactChecks);
    return newFc;
  },
};

export default initStorage;
