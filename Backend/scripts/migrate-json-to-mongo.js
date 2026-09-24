// One-time migration script: imports existing Backend/data/*.json records
// into MongoDB, preserving the original string IDs (so the frontend's
// hardcoded DEFAULT_DEBATE_ID "1786435967997" keeps working).
//
// Usage:  node scripts/migrate-json-to-mongo.js
// Safe to re-run: existing documents with the same _id are skipped.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "../data");

dotenv.config({ path: path.join(__dirname, "../.env") });

// Inline minimal schemas (same shapes as the models) so this script is
// self-contained and doesn't depend on model import order.
const jsonOpts = {
  strict: false, // accept any legacy fields
  toJSON: { virtuals: true, versionKey: false },
};

const Debate =
  mongoose.models.Debate ||
  mongoose.model(
    "Debate",
    new mongoose.Schema(
      {
        _id: { type: String },
        title: String,
        topic: String,
        status: String,
      },
      { timestamps: true, ...jsonOpts }
    )
  );

const Argument =
  mongoose.models.Argument ||
  mongoose.model(
    "Argument",
    new mongoose.Schema(
      {
        _id: { type: String },
        debateId: String,
        speakerName: String,
        claim: String,
        evidence: String,
        fallacy: mongoose.Schema.Types.Mixed,
        credibilityScore: Number,
      },
      { timestamps: true, ...jsonOpts }
    )
  );

const FactCheck =
  mongoose.models.FactCheck ||
  mongoose.model(
    "FactCheck",
    new mongoose.Schema(
      {
        _id: { type: String },
        argumentId: String,
        verified: Boolean,
        confidence: Number,
        reason: String,
        speakerName: String,
        claim: String,
      },
      { timestamps: true, ...jsonOpts }
    )
  );

const User =
  mongoose.models.User ||
  mongoose.model(
    "User",
    new mongoose.Schema(
      {
        _id: { type: String },
        username: String,
        email: String,
        password: String,
        isVerified: Boolean,
      },
      { timestamps: true, ...jsonOpts }
    )
  );

const OTP =
  mongoose.models.OTP ||
  mongoose.model(
    "OTP",
    new mongoose.Schema(
      {
        _id: { type: String },
        email: String,
        otp: String,
        isVerified: Boolean,
        createdAt: { type: Date, expires: 600 },
      },
      { timestamps: true, ...jsonOpts }
    )
  );

const readJson = (name) => {
  const filePath = path.join(DATA_DIR, name);
  if (!fs.existsSync(filePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8") || "[]");
  } catch (err) {
    console.warn(`⚠️ Could not parse ${name}:`, err.message);
    return [];
  }
};

// Normalize a legacy record: map `id` → `_id`, drop the duplicate `id` key
// (the schema's toJSON transform re-adds it at read time).
const normalize = (record) => {
  const { id, ...rest } = record;
  return { _id: id ?? record._id, ...rest };
};

const migrateCollection = async (name, Model, records) => {
  let inserted = 0;
  let skipped = 0;
  for (const record of records) {
    const doc = normalize(record);
    if (!doc._id) {
      console.warn(`⚠️ Skipping ${name} record without id:`, record);
      continue;
    }
    const exists = await Model.exists({ _id: doc._id });
    if (exists) {
      skipped++;
      continue;
    }
    await Model.create(doc);
    inserted++;
  }
  console.log(`✅ ${name}: ${inserted} inserted, ${skipped} skipped (already present)`);
};

const main = async () => {
  const uri = process.env.URI;
  if (!uri) {
    console.error("❌ Missing URI in Backend/.env");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log(`✅ Connected to MongoDB: ${mongoose.connection.host}`);

  await migrateCollection("debates", Debate, readJson("debates.json"));
  await migrateCollection("arguments", Argument, readJson("arguments.json"));
  await migrateCollection("factchecks", FactCheck, readJson("factchecks.json"));
  await migrateCollection("users", User, readJson("users.json"));
  await migrateCollection("otps", OTP, readJson("otps.json"));

  await mongoose.disconnect();
  console.log("🎉 Migration complete");
};

main().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
