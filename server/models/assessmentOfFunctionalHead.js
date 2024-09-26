const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const assessmentOfFunctionalHead = new Schema({
  formId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  impression: { type: Number, min: 0, max: 5 },
  examination: { type: Number, min: 0, max: 5 },
  interpersonal: { type: Number, min: 0, max: 5 },
  totalScore: { type: Number, min: 0, max: 15 },
});

module.exports = mongoose.model(
  "assessmentOfFunctionalHead",
  assessmentOfFunctionalHead
);
