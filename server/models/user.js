const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  designation: { type: String, required: true },
  department: { type: String, required: true },
  doj: { type: Date, required: false },
  teaching_experience: { type: Number, required: false },
  industry_experience: { type: Number, required: false },
  total_experience: { type: Number, required: false },
});

module.exports = mongoose.model("User", userSchema);
