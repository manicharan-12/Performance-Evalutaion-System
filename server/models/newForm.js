const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newFormSchema = new Schema({
  user_id: { type: String },
  formName: { type: String },
});

module.exports = mongoose.model("Form", newFormSchema);
