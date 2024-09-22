const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const researchAndDevelopmentPartB = new Schema({
  userId: { type: String },
  formId: { type: String },
  presentation_data: [
    {
      titleOfThePaper: { type: String },
      titleOfTheme: { type: String },
      organizedBy: { type: String },
      indexedIn: { type: String },
      noOfDays: { type: String },
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
});

module.exports = mongoose.model(
  "ResearchAndDevelopmentPartB",
  researchAndDevelopmentPartB
);
