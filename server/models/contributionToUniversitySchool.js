const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const contributionToUniversitySchool = new Schema({
  userId: { type: String },
  formId: { type: String },
  contribution_data: [
    {
      nameOfTheResponsibility: { type: String },
      contribution: { type: String },
      apiScore: { type: Number },
      reviewerScore: { type: Number },
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
  "ContributionToUniversitySchool",
  contributionToUniversitySchool
);
