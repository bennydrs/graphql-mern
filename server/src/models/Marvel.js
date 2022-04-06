import mongoose from "mongoose"
import Paginate from "mongoose-paginate-v2"

const schema = new mongoose.Schema({
  title: { type: "string", unique: true, required: true },
  year: { type: "number" },
  type: { type: "string", enum: ["movie", "series"] },
})

schema.index({ title: "text" })
schema.plugin(Paginate)

export const Marvel = mongoose.model("Marvel", schema)
