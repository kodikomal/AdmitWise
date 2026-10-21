const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const academicProfileSchema = new mongoose.Schema(
  {
    sscPercentage: {
      type: Number,
      min: [0, 'SSC percentage cannot be less than 0'],
      max: [100, 'SSC percentage cannot exceed 100'],
      default: null,
    },
    hscPercentage: {
      type: Number,
      min: [0, 'HSC percentage cannot be less than 0'],
      max: [100, 'HSC percentage cannot exceed 100'],
      default: null,
    },
    board: {
      type: String,
      enum: ['Maharashtra State Board', 'CBSE', 'ICSE', 'Other State Board', 'Other'],
      default: 'Maharashtra State Board',
    },
    passingYear: {
      type: Number,
      default: 2024,
    },
    hscStream: {
      type: String,
      enum: ['Science', 'Commerce', 'Arts', 'Diploma / Polytechnic', 'Other'],
      default: 'Science',
    },
    mathsMarks: {
      type: Number,
      min: [0, 'Maths marks cannot be negative'],
      max: [100, 'Maths marks cannot exceed 100'],
      default: null,
    },
    entranceExam: {
      type: String,
      enum: ['None / Merit Based', 'MHT-CET', 'JEE Main', 'Other'],
      default: 'None / Merit Based',
    },
    entranceScore: {
      type: Number,
      min: [0, 'Entrance score/percentile cannot be negative'],
      max: [100, 'Entrance percentile cannot exceed 100'],
      default: null,
    },
    category: {
      type: String,
      enum: ['Open/General', 'OBC', 'SC', 'ST', 'EWS', 'TFWS', 'VJ/NT', 'SBC', 'Minority'],
      default: 'Open/General',
    },
    preferredCourse: {
      type: String,
      default: '',
    },
    preferredCity: {
      type: String,
      default: 'Mumbai',
    },
    annualFeeBudget: {
      type: Number,
      min: [0, 'Fee budget cannot be negative'],
      default: 200000,
    },
    collegeTypePreference: {
      type: String,
      enum: ['Any', 'Autonomous', 'Government', 'Government-Aided', 'Private-Aided', 'Private-Unaided'],
      default: 'Any',
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password in normal queries
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    academicProfile: {
      type: academicProfileSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Calculate profile completion percentage
userSchema.methods.getProfileCompletion = function () {
  const profile = this.academicProfile || {};
  const fields = [
    'hscPercentage',
    'sscPercentage',
    'board',
    'passingYear',
    'hscStream',
    'category',
    'preferredCity',
    'annualFeeBudget',
  ];
  let filled = 0;
  for (const field of fields) {
    if (profile[field] !== null && profile[field] !== undefined && profile[field] !== '') {
      filled++;
    }
  }
  return Math.round((filled / fields.length) * 100);
};

// Exclude sensitive fields from JSON representation
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  obj.profileCompletion = this.getProfileCompletion();
  return obj;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
