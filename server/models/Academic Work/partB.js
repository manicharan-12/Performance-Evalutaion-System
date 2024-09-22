const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const academicWorkPartB = new Schema({
  userId: { type: String, required: true },
  formId: { type: String, required: true },
  editorContent: { type: String, required: true },
  files: [
    {
      filename: { type: String, required: true },
      mimetype: { type: String, required: true },
      fileId: { type: mongoose.Schema.Types.ObjectId, required: true },
      fileContent: { type: String },
    },
  ],
  reviewerScore: { type: Number, default: null },
});

module.exports = mongoose.model("AcademicWorkPartB", academicWorkPartB);
