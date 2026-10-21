const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'College name is required'],
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      required: [true, 'College address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      index: true,
    },
    state: {
      type: String,
      default: 'Maharashtra',
    },
    pincode: {
      type: String,
      trim: true,
    },
    collegeType: {
      type: String,
      enum: ['Autonomous', 'Government', 'Government-Aided', 'Private-Aided', 'Private-Unaided'],
      required: true,
    },
    universityAffiliation: {
      type: String,
      required: true,
      default: 'University of Mumbai',
    },
    naacGrade: {
      type: String,
      enum: ['A++', 'A+', 'A', 'B++', 'B+', 'B', 'C', 'Not Accredited', 'Pending'],
      default: 'A',
    },
    nbaAccredited: {
      type: Boolean,
      default: false,
    },
    officialWebsite: {
      type: String,
      trim: true,
      default: '',
    },
    admissionPortalUrl: {
      type: String,
      trim: true,
      default: '',
    },
    contactEmail: {
      type: String,
      trim: true,
      default: '',
    },
    contactPhone: {
      type: String,
      trim: true,
      default: '',
    },
    establishedYear: {
      type: Number,
      default: 1980,
    },
    campusArea: {
      type: String,
      default: 'Urban Campus',
    },
    facilities: {
      type: [String],
      default: ['Library', 'Computer Labs', 'Auditorium', 'Sports Ground', 'Cafeteria', 'Wi-Fi Campus'],
    },
    coursesOffered: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
    annualFeesApprox: {
      type: Number,
      default: 35000,
    },
    summary: {
      type: String,
      default: '',
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    dataSource: {
      type: String,
      default: 'Official Mumbai University / DTE Maharashtra Admission Records & College Prospectus',
    },
    verifiedAt: {
      type: Date,
      default: Date.now,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 4.2,
    },
  },
  {
    timestamps: true,
  }
);

// Search indexes
collegeSchema.index({ name: 'text', city: 'text', universityAffiliation: 'text' });

const College = mongoose.model('College', collegeSchema);
module.exports = College;
