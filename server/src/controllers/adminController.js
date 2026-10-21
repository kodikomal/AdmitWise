const { College, Course, Cutoff, User, Prediction } = require('../models');

/**
 * Get Admin Dashboard Overview Statistics
 * GET /api/admin/dashboard
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalColleges,
      totalCourses,
      totalCutoffs,
      totalStudents,
      totalPredictions,
      recentUsers,
      recentPredictions,
      collegesByType,
      collegesByCity,
    ] = await Promise.all([
      College.countDocuments(),
      Course.countDocuments(),
      Cutoff.countDocuments(),
      User.countDocuments({ role: 'student' }),
      Prediction.countDocuments(),
      User.find({ role: 'student' }).sort({ createdAt: -1 }).limit(5).select('name email createdAt isActive'),
      Prediction.find().sort({ createdAt: -1 }).limit(5).populate('course', 'name shortName'),
      College.aggregate([{ $group: { _id: '$collegeType', count: { $sum: 1 } } }]),
      College.aggregate([{ $group: { _id: '$city', count: { $sum: 1 } } }]),
    ]);

    // Data completeness indicators
    const verifiedColleges = await College.countDocuments({ isVerified: true });
    const verifiedCutoffs = await Cutoff.countDocuments({ isVerified: true });

    return res.status(200).json({
      success: true,
      stats: {
        totalColleges,
        totalCourses,
        totalCutoffs,
        totalStudents,
        totalPredictions,
        dataCompleteness: {
          verifiedColleges,
          unverifiedColleges: totalColleges - verifiedColleges,
          verifiedCutoffs,
          unverifiedCutoffs: totalCutoffs - verifiedCutoffs,
        },
        collegesByType,
        collegesByCity,
        recentUsers,
        recentPredictions,
      },
    });
  } catch (error) {
    next(error);
  }
};

// --- COLLEGE MANAGEMENT ---

const getAdminColleges = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.search) {
      query.$or = [
        { name: new RegExp(req.query.search, 'i') },
        { city: new RegExp(req.query.search, 'i') },
      ];
    }
    if (req.query.city && req.query.city !== 'All') {
      query.city = req.query.city;
    }

    const [colleges, total] = await Promise.all([
      College.find(query).populate('coursesOffered', 'name shortName').sort({ createdAt: -1 }).skip(skip).limit(limit),
      College.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      colleges,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) || 1 },
    });
  } catch (error) {
    next(error);
  }
};

const createCollege = async (req, res, next) => {
  try {
    const {
      name,
      code,
      address,
      city,
      state = 'Maharashtra',
      pincode,
      collegeType,
      universityAffiliation,
      naacGrade,
      nbaAccredited,
      officialWebsite,
      admissionPortalUrl,
      contactEmail,
      contactPhone,
      coursesOffered,
      annualFeesApprox,
      summary,
      isVerified = true,
      dataSource,
      isFeatured = false,
      rating = 4.0,
    } = req.body;

    if (!name || !address || !city || !collegeType) {
      return res.status(400).json({
        success: false,
        message: 'Name, address, city, and college type are required fields.',
      });
    }

    const college = await College.create({
      name: name.trim(),
      code,
      address: address.trim(),
      city: city.trim(),
      state,
      pincode,
      collegeType,
      universityAffiliation: universityAffiliation || 'University of Mumbai',
      naacGrade: naacGrade || 'A',
      nbaAccredited: !!nbaAccredited,
      officialWebsite,
      admissionPortalUrl,
      contactEmail,
      contactPhone,
      coursesOffered: Array.isArray(coursesOffered) ? coursesOffered : [],
      annualFeesApprox: Number(annualFeesApprox) || 0,
      summary,
      isVerified: Boolean(isVerified),
      dataSource: dataSource || 'Administrative Entry / Official College Brochure',
      verifiedAt: Date.now(),
      isFeatured: Boolean(isFeatured),
      rating: Number(rating) || 4.0,
    });

    return res.status(201).json({
      success: true,
      message: 'College created successfully.',
      college,
    });
  } catch (error) {
    next(error);
  }
};

const updateCollege = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const college = await College.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!college) {
      return res.status(404).json({ success: false, message: 'College not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'College updated successfully.',
      college,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCollege = async (req, res, next) => {
  try {
    const { id } = req.params;
    const college = await College.findById(id);
    if (!college) {
      return res.status(404).json({ success: false, message: 'College not found.' });
    }

    // Safely delete associated cutoff records to avoid orphan data
    await Cutoff.deleteMany({ college: id });
    await College.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: `College '${college.name}' and its associated cutoffs were deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
};

// --- COURSE MANAGEMENT ---

const createCourse = async (req, res, next) => {
  try {
    const {
      name,
      shortName,
      degreeType,
      stream,
      durationYears,
      admissionBasis,
      eligibilityCriteria,
      description,
      careerScope,
    } = req.body;

    if (!name || !shortName || !stream) {
      return res.status(400).json({
        success: false,
        message: 'Name, short name, and stream are required.',
      });
    }

    const course = await Course.create({
      name: name.trim(),
      shortName: shortName.trim(),
      degreeType: degreeType || 'Undergraduate',
      stream,
      durationYears: Number(durationYears) || 3,
      admissionBasis: admissionBasis || 'HSC_MERIT',
      eligibilityCriteria: eligibilityCriteria || {},
      description,
      careerScope: Array.isArray(careerScope) ? careerScope : [],
    });

    return res.status(201).json({
      success: true,
      message: 'Course created successfully.',
      course,
    });
  } catch (error) {
    next(error);
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Course updated successfully.',
      course,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Check if colleges offer this course
    const count = await College.countDocuments({ coursesOffered: id });
    if (count > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete course. It is currently offered by ${count} college(s). Remove it from those colleges first.`,
      });
    }

    await Course.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: 'Course deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// --- CUTOFF MANAGEMENT ---

const getAdminCutoffs = async (req, res, next) => {
  try {
    const { collegeId, courseId, academicYear, category, page = 1, limit = 25 } = req.query;
    const query = {};

    if (collegeId && collegeId !== 'All') query.college = collegeId;
    if (courseId && courseId !== 'All') query.course = courseId;
    if (academicYear && academicYear !== 'All') query.academicYear = academicYear;
    if (category && category !== 'All') query.category = category;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 25));
    const skip = (pageNum - 1) * limitNum;

    const [cutoffs, total] = await Promise.all([
      Cutoff.find(query)
        .populate('college', 'name city')
        .populate('course', 'name shortName')
        .sort({ academicYear: -1, college: 1, cutoffValue: -1 })
        .skip(skip)
        .limit(limitNum),
      Cutoff.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      cutoffs,
      pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) || 1 },
    });
  } catch (error) {
    next(error);
  }
};

const createCutoff = async (req, res, next) => {
  try {
    const {
      college,
      course,
      academicYear,
      admissionRound,
      category,
      quota,
      examination,
      cutoffType,
      cutoffValue,
      annualFees,
      source,
      isVerified = true,
      notes,
    } = req.body;

    if (!college || !course || !academicYear || cutoffValue === undefined) {
      return res.status(400).json({
        success: false,
        message: 'College, course, academic year, and cutoff value are required.',
      });
    }

    // Check duplicate
    const existing = await Cutoff.findOne({
      college,
      course,
      academicYear,
      admissionRound: admissionRound || 'Round 1',
      category: category || 'Open/General',
      quota: quota || 'General/Home University',
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: `A cutoff record already exists for this college, course, year (${academicYear}), ${admissionRound || 'Round 1'}, and category (${category || 'Open/General'}).`,
      });
    }

    const cutoff = await Cutoff.create({
      college,
      course,
      academicYear,
      admissionRound: admissionRound || 'Round 1',
      category: category || 'Open/General',
      quota: quota || 'General/Home University',
      examination: examination || 'HSC Aggregate %',
      cutoffType: cutoffType || 'PERCENTAGE',
      cutoffValue: Number(cutoffValue),
      annualFees: Number(annualFees) || 0,
      source: source || 'Mumbai University Merit List',
      isVerified: Boolean(isVerified),
      verifiedAt: Date.now(),
      notes,
    });

    return res.status(201).json({
      success: true,
      message: 'Historical cutoff record created successfully.',
      cutoff,
    });
  } catch (error) {
    next(error);
  }
};

const updateCutoff = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cutoff = await Cutoff.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!cutoff) {
      return res.status(404).json({ success: false, message: 'Cutoff record not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Cutoff record updated successfully.',
      cutoff,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCutoff = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cutoff = await Cutoff.findByIdAndDelete(id);
    if (!cutoff) {
      return res.status(404).json({ success: false, message: 'Cutoff record not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Cutoff record deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// --- USER MANAGEMENT ---

const getAdminUsers = async (req, res, next) => {
  try {
    const { search, role = 'student', page = 1, limit = 20 } = req.query;
    const query = {};

    if (role && role !== 'All') {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find(query).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      User.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      users,
      pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) || 1 },
    });
  } catch (error) {
    next(error);
  }
};

const toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Administrators cannot deactivate their own account.',
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.isActive = !user.isActive;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User account has been ${user.isActive ? 'reactivated' : 'deactivated'}.`,
      isActive: user.isActive,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAdminColleges,
  createCollege,
  updateCollege,
  deleteCollege,
  createCourse,
  updateCourse,
  deleteCourse,
  getAdminCutoffs,
  createCutoff,
  updateCutoff,
  deleteCutoff,
  getAdminUsers,
  toggleUserStatus,
};
