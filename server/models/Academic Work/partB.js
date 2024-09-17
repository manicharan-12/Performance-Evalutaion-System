const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const remarkSchema = new mongoose.Schema({
  content: {type: Number, default: null},
})

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
  remarkA: remarkSchema,
});

module.exports = mongoose.model("AcademicWorkPartB", academicWorkPartB);
