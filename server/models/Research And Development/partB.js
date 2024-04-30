const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const researchAndDevelopmentPartB = new Schema({
  userId: { type: String },
  presentation_data: [
    {
      titleOfThePaper: { type: String },
      titleOfTheme: { type: String },
      organizedBy: { type: String },
      indexedIn: { type: String },
      noOfDays: { type: String },
      apiScore: { type: Number },
    },
  ],
});

module.exports = mongoose.model(
  "ResearchAndDevelopmentPartB",
  researchAndDevelopmentPartB,
);
