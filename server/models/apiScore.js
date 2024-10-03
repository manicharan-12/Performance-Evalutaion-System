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
  reviewerApiScores: {
    academicWorkPartA: { type: Number, default: 0 },
    academicWorkPartB: { type: Number, default: 0 },
    researchAndDevelopmentPartA: { type: Number, default: 0 },
    researchAndDevelopmentPartB: { type: Number, default: 0 },
    researchAndDevelopmentPartC: { type: Number, default: 0 },
    researchAndDevelopmentPartD: { type: Number, default: 0 },
    contributionToSchool: { type: Number, default: 0 },
    contributionToDepartment: { type: Number, default: 0 },
    contributionToSociety: { type: Number, default: 0 },
    functionalHeadAssessment: { type: Number, default: 0 },
  },
});

module.exports = mongoose.model("ApiScore", apiScore);
