const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  courseTaught: { type: String, required: true },
  scheduledClasses: { type: Number, required: true },
  actualClasses: { type: Number, required: true },
  passPercentage: { type: Number, required: true },
  apiScoreResults: { type: Number, required: true },
  studentFeedbackPercentage: { type: Number, required: true },
  studentFeedbackScore: { type: Number, required: true },
});

const semesterSchema = new mongoose.Schema({
  semesterName: { type: String, required: true },
  courses: [courseSchema],
});

const academicWorkSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  academic_year: { type: String, required: true },
  academic_work_part_a: [semesterSchema],
  averageResultPercentage: { type: Number, required: true },
  averageFeedbackPercentage: { type: Number, required: true },
  totalApiScore: { type: Number, required: true },
});

const AcademicWorkPartA = mongoose.model(
  "AcademicWorkPartA",
  academicWorkSchema,
);

module.exports = AcademicWorkPartA;
