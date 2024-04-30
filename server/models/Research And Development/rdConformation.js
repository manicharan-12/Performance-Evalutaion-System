const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const phdConformationSchema = new Schema({
  userId: { type: String },
  possesPhD: { type: String },
  registerPhD: { type: String },
  receivedPhd: { type: String },
  phDDetails: {
    nameOfTheUniversity: {
      registered: { type: String },
      received: { type: String },
    },
    dateOfRegistration: {
      registered: { type: String },
      received: { type: String },
    },
    supervisorAndCoSupervisorName: {
      registered: { type: String },
      received: { type: String },
    },
    prePhDCompletionDate: {
      registered: { type: String },
      received: { type: String },
    },
    noOfResearchReviewsCompleted: {
      registered: { type: Number },
      received: { type: Number },
    },
    dateOfCompletionOfPhD: {
      registered: { type: String },
      received: { type: String },
    },
  },
});

module.exports = mongoose.model("PhdConformation", phdConformationSchema);
