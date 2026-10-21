const { College, Course, Cutoff } = require('../models');

/**
 * Get colleges with search, filters, sorting, and pagination
 * GET /api/colleges
 */
const getColleges = async (req, res, next) => {
  try {
    const {
      search,
      city,
      courseId,
      collegeType,
      minFee,
      maxFee,
      naacGrade,
      sortBy = 'name',
      sortOrder = 'asc',
      page = 1,
      limit = 9,
    } = req.query;

    const query = {};

    // Search by name or city
    if (search && search.trim() !== '') {
      const s = search.trim();
      query.$or = [
        { name: { $regex: s, $options: 'i' } },
        { city: { $regex: s, $options: 'i' } },
        { universityAffiliation: { $regex: s, $options: 'i' } },
      ];
    }

    // Filter by city
    if (city && city !== 'All') {
      query.city = new RegExp(`^${city.trim()}$`, 'i');
    }

    // Filter by college type
    if (collegeType && collegeType !== 'All') {
      query.collegeType = collegeType;
    }

    // Filter by NAAC grade
    if (naacGrade && naacGrade !== 'All') {
      query.naacGrade = naacGrade;
    }

    // Filter by offered course
    if (courseId && courseId !== 'All') {
      query.coursesOffered = courseId;
    }

    // Filter by approximate annual fees
    if (minFee || maxFee) {
      query.annualFeesApprox = {};
      if (minFee) query.annualFeesApprox.$gte = Number(minFee);
      if (maxFee) query.annualFeesApprox.$lte = Number(maxFee);
    }

    // Sorting
    const sort = {};
    if (sortBy === 'name') {
      sort.name = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'fees') {
      sort.annualFeesApprox = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'rating') {
      sort.rating = sortOrder === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 9));
    const skip = (pageNum - 1) * limitNum;

    const [colleges, total] = await Promise.all([
      College.find(query)
        .populate('coursesOffered', 'name shortName degreeType durationYears')
        .sort(sort)
        .skip(skip)
        .limit(limitNum),
      College.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      colleges,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get college details by ID including offered courses and historical cutoffs
 * GET /api/colleges/:id
 */
const getCollegeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const college = await College.findById(id).populate('coursesOffered');
    if (!college) {
      return res.status(404).json({
        success: false,
        message: 'College not found.',
      });
    }

    // Fetch historical cutoffs for this college
    const cutoffs = await Cutoff.find({ college: college._id })
      .populate('course', 'name shortName degreeType')
      .sort({ academicYear: -1, admissionRound: 1, cutoffValue: -1 });

    return res.status(200).json({
      success: true,
      college,
      cutoffs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get featured colleges for home page
 * GET /api/colleges/featured
 */
const getFeaturedColleges = async (req, res, next) => {
  try {
    let colleges = await College.find({ isFeatured: true })
      .populate('coursesOffered', 'name shortName')
      .limit(6);

    // If fewer than 4 marked featured, fill with top-rated colleges
    if (colleges.length < 4) {
      colleges = await College.find()
        .sort({ rating: -1 })
        .populate('coursesOffered', 'name shortName')
        .limit(6);
    }

    return res.status(200).json({
      success: true,
      colleges,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Compare up to 4 colleges
 * POST /api/colleges/compare
 */
const compareColleges = async (req, res, next) => {
  try {
    const { collegeIds, courseId } = req.body;

    if (!Array.isArray(collegeIds) || collegeIds.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please select at least 2 colleges to compare.',
      });
    }

    if (collegeIds.length > 4) {
      return res.status(400).json({
        success: false,
        message: 'You can compare at most 4 colleges at a time.',
      });
    }

    // Deduplicate IDs
    const uniqueIds = [...new Set(collegeIds)];

    const colleges = await College.find({ _id: { $in: uniqueIds } }).populate('coursesOffered');

    // Retrieve cutoffs for these colleges
    const cutoffFilter = { college: { $in: uniqueIds } };
    if (courseId) {
      cutoffFilter.course = courseId;
    }

    const cutoffs = await Cutoff.find(cutoffFilter)
      .populate('course', 'name shortName')
      .sort({ academicYear: -1, admissionRound: 1 });

    return res.status(200).json({
      success: true,
      colleges,
      cutoffs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get distinct cities for filter dropdowns
 * GET /api/colleges/cities
 */
const getCities = async (req, res, next) => {
  try {
    const cities = await College.distinct('city');
    return res.status(200).json({
      success: true,
      cities: cities.filter(Boolean).sort(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getColleges,
  getCollegeById,
  getFeaturedColleges,
  compareColleges,
  getCities,
};
