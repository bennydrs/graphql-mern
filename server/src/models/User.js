import mongoose from "mongoose"

const schema = new mongoose.Schema({
  email: { type: "string", unique: true, required: true },
  name: { type: "string", required: true },
  password: { type: "string", required: true },
  sessionId: "string",
  tokenVersion: { type: "Number", default: 0 },
})
export const User = mongoose.model("User", schema)
