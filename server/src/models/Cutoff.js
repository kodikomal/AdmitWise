const mongoose = require('mongoose');

const cutoffSchema = new mongoose.Schema(
  {
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'College',
      required: [true, 'College reference is required'],
      index: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course reference is required'],
      index: true,
    },
    academicYear: {
      type: String,
      required: [true, 'Academic year is required (e.g. 2024-2025)'],
      trim: true,
      index: true,
    },
    admissionRound: {
      type: String,
      enum: ['Round 1', 'Round 2', 'Round 3', 'Institutional / Spot'],
      default: 'Round 1',
    },
    category: {
      type: String,
      enum: ['Open/General', 'OBC', 'SC', 'ST', 'EWS', 'TFWS', 'VJ/NT', 'SBC', 'Minority'],
      default: 'Open/General',
    },
    quota: {
      type: String,
      enum: ['General/Home University', 'Other Than Home University', 'State Level', 'Minority Quota'],
      default: 'General/Home University',
    },
    examination: {
      type: String,
      enum: ['HSC Aggregate %', 'HSC Science %', 'MHT-CET Percentile', 'JEE Main Percentile', 'Merit Score'],
      default: 'HSC Aggregate %',
    },
    cutoffType: {
      type: String,
      enum: ['PERCENTAGE', 'PERCENTILE', 'RANK'],
      default: 'PERCENTAGE',
    },
    cutoffValue: {
      type: Number,
      required: [true, 'Cutoff value is required'],
      min: [0, 'Cutoff cannot be negative'],
    },
    annualFees: {
      type: Number,
      default: 0,
    },
    source: {
      type: String,
      required: [true, 'Data source is required'],
      default: 'Official Mumbai University Merit List 2024',
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    verifiedAt: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to avoid duplicate cutoff records for same college, course, year, round, and category
cutoffSchema.index(
  { college: 1, course: 1, academicYear: 1, admissionRound: 1, category: 1, quota: 1 },
  { unique: true }
);

const Cutoff = mongoose.model('Cutoff', cutoffSchema);
module.exports = Cutoff;
