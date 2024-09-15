const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const apiScore = new Schema({
  userId: { type: String },
  formId: { type: String },
  apiScores: {
    academicWorkPartA: { type: Number },
    academicWorkPartB: { type: Number },
    researchAndDevelopmentPartA: { type: Number },
    researchAndDevelopmentPartB: { type: Number },
    researchAndDevelopmentPartC: { type: Number },
    researchAndDevelopmentPartD: { type: Number },
    contributionToSchool: { type: Number },
    contributionToDepartment: { type: Number },
    contributionToSociety: { type: Number },
  },
});

module.exports = mongoose.model("ApiScore", apiScore);
