const mongoose = require('mongoose');

const admissionGuidanceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    category: {
      type: String,
      enum: ['Eligibility', 'Merit Lists', 'Documents', 'CAP Rounds', 'Reservations', 'FAQs'],
      required: true,
    },
    summary: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      required: true,
    },
    documentChecklist: [
      {
        name: String,
        isMandatory: Boolean,
        description: String,
      },
    ],
    officialLinks: [
      {
        title: String,
        url: String,
        description: String,
      },
    ],
    importantDates: [
      {
        event: String,
        date: String,
        status: {
          type: String,
          enum: ['Upcoming', 'Ongoing', 'Completed', 'Tentative'],
          default: 'Tentative',
        },
      },
    ],
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const AdmissionGuidance = mongoose.model('AdmissionGuidance', admissionGuidanceSchema);
module.exports = AdmissionGuidance;
