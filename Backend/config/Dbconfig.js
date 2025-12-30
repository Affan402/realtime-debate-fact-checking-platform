import initStorage from "./storage.js";

const DBconfig = async () => {
  try {
    initStorage();
    console.log("✅ Local Storage Successfully Initialized");
  } catch (error) {
    console.error("❌ Storage Initialization Error:", error.message);
    process.exit(1);
  }
};

export default DBconfig;