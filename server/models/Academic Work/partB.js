const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const academicWorkPartB = new Schema({
  editorContent: { type: String },
  filename: { type: String },
  mimetype: { type: String },
  size: { type: Number },
});

module.exports = mongoose.model("AcademicWorkPartB", academicWorkPartB);
