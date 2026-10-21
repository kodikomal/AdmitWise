const mongoose = require('mongoose');

const predictionResultSchema = new mongoose.Schema(
  {
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'College',
      required: true,
    },
    collegeName: {
      type: String,
      required: true,
    },
    collegeCity: {
      type: String,
      default: '',
    },
    collegeType: {
      type: String,
      default: '',
    },
    universityAffiliation: {
      type: String,
      default: '',
    },
    annualFees: {
      type: Number,
      default: 0,
    },
    isEligible: {
      type: Boolean,
      default: true,
    },
    eligibilityRemarks: {
      type: String,
      default: '',
    },
    chanceCategory: {
      type: String,
      enum: ['High Chance', 'Moderate Chance', 'Low Chance', 'Not Eligible', 'Insufficient Data'],
      required: true,
    },
    studentScore: {
      type: Number,
      default: null,
    },
    cutoffValue: {
      type: Number,
      default: null,
    },
    scoreDifference: {
      type: Number,
      default: null,
    },
    cutoffType: {
      type: String,
      default: 'PERCENTAGE',
    },
    academicYearUsed: {
      type: String,
      default: '',
    },
    admissionRoundUsed: {
      type: String,
      default: '',
    },
    categoryUsed: {
      type: String,
      default: '',
    },
    reasons: {
      type: [String],
      default: [],
    },
    dataSource: {
      type: String,
      default: '',
    },
    isVerifiedData: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const predictionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student ID is required'],
      index: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course is required'],
    },
    courseName: {
      type: String,
      required: true,
    },
    academicSnapshot: {
      sscPercentage: Number,
      hscPercentage: Number,
      mathsMarks: Number,
      stream: String,
      board: String,
      passingYear: Number,
      category: String,
      entranceExam: String,
      entranceScore: Number,
      preferredCity: String,
      annualFeeBudget: Number,
      collegeTypePreference: String,
    },
    algorithmVersion: {
      type: String,
      default: 'AdmitWise Rule-Based Predictor v1.2',
    },
    summaryCounts: {
      highChance: { type: Number, default: 0 },
      moderateChance: { type: Number, default: 0 },
      lowChance: { type: Number, default: 0 },
      notEligible: { type: Number, default: 0 },
      insufficientData: { type: Number, default: 0 },
      totalMatched: { type: Number, default: 0 },
    },
    results: [predictionResultSchema],
  },
  {
    timestamps: true,
  }
);

predictionSchema.index({ student: 1, createdAt: -1 });

const Prediction = mongoose.model('Prediction', predictionSchema);
module.exports = Prediction;
