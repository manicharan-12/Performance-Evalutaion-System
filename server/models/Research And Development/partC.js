const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const researchAndDevelopmentPartC = new Schema({
  userId: { type: String },
  projects_data: [
    {
      titleOfTheFundingProject: { type: String },
      fundingAgencyDetails: { type: String },
      grant: { type: Number },
      status: { type: String },
      apiScore: { type: Number },
    },
  ],
});

module.exports = mongoose.model(
  "ResearchAndDevelopmentPartC",
  researchAndDevelopmentPartC,
);
