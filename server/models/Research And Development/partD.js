const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const remarkSchema = new mongoose.Schema({
  content: {type: Number, default: null},
})

const researchAndDevelopmentPartD = new Schema({
  userId: { type: String },
  formId: { type: String },
  certificates_data: [
    {
      nameOfTheCertificate: { type: String },
      organization: { type: String },
      score: { type: String },
      apiScore: { type: Number },
    },
  ],
  files: [
    {
      filename: { type: String, required: true },
      mimetype: { type: String, required: true },
      fileId: { type: mongoose.Schema.Types.ObjectId, required: true },
      fileContent: { type: String },
    },
  ],
  remark: remarkSchema,
});

module.exports = mongoose.model(
  "ResearchAndDevelopmentPartD",
  researchAndDevelopmentPartD,
);
