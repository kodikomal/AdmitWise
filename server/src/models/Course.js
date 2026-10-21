const mongoose = require('mongoose');

const eligibilitySchema = new mongoose.Schema(
  {
    minHscPercentage: {
      type: Number,
      required: true,
      default: 45,
      min: 0,
      max: 100,
    },
    minHscReservedPercentage: {
      type: Number,
      default: 40,
      min: 0,
      max: 100,
    },
    requiresMathsInHsc: {
      type: Boolean,
      default: false,
    },
    minMathsMarks: {
      type: Number,
      default: 0,
    },
    allowedStreams: {
      type: [String],
      default: ['Science'],
    },
    entranceRequired: {
      type: Boolean,
      default: false,
    },
    acceptedExams: {
      type: [String],
      default: [],
    },
    minEntrancePercentile: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Course name is required'],
      unique: true,
      trim: true,
    },
    shortName: {
      type: String,
      required: [true, 'Short name/code is required'],
      trim: true,
    },
    degreeType: {
      type: String,
      enum: ['Undergraduate', 'Postgraduate', 'Diploma'],
      default: 'Undergraduate',
    },
    stream: {
      type: String,
      enum: ['Information Technology', 'Computer Science', 'Engineering', 'Commerce', 'Management', 'Science', 'Arts'],
      required: true,
    },
    durationYears: {
      type: Number,
      default: 3,
      min: 1,
      max: 6,
    },
    admissionBasis: {
      type: String,
      enum: ['HSC_MERIT', 'ENTRANCE_EXAM', 'MERIT_AND_ENTRANCE'],
      default: 'HSC_MERIT',
    },
    eligibilityCriteria: {
      type: eligibilitySchema,
      default: () => ({}),
    },
    description: {
      type: String,
      default: '',
    },
    careerScope: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
