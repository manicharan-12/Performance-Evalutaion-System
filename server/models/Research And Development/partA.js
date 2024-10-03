const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const researchAndDevelopmentPartA = new Schema({
  userId: { type: String },
  formId: { type: String },
  presentation_data: [
    {
      articleTitle: { type: String },
      journalName: { type: String },
      indexedIn: { type: String },
      dateOfPublication: { type: String },
      oneOrCorrespondingAuthor: { type: String },
      apiScore: { type: Number },
      reviewerScore: { type: Number, default: null },
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
  totalReviewerScore: { type: Number, default: null },
});

module.exports = mongoose.model(
  "ResearchAndDevelopmentPartA",
  researchAndDevelopmentPartA
);
