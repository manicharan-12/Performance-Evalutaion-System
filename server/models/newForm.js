const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newFormSchema = new Schema({
  user_id: { type: String },
  formName: { type: String },
  status: {type: String, enum: ['not-submitted', 'submitted', 'reviewed'], default: 'not-submitted'},
});

module.exports = mongoose.model("Form", newFormSchema);
