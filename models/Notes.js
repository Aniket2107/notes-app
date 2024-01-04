const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  keywords: [{ type: String }],
});

noteSchema.index({ keywords: 1 });

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
