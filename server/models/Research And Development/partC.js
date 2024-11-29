const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const researchAndDevelopmentPartC = new Schema({
  userId: { type: String },
  formId: { type: String },
  projects_data: [
    {
      titleOfTheFundingProject: { type: String },
      fundingAgencyDetails: { type: String },
      grant: { type: Number },
      status: { type: String },
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
  "ResearchAndDevelopmentPartC",
  researchAndDevelopmentPartC
);
