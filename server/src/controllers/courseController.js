const { Course, College } = require('../models');

/**
 * Get all available courses
 * GET /api/courses
 */
const getCourses = async (req, res, next) => {
  try {
    const { stream, degreeType } = req.query;
    const query = { isActive: true };

    if (stream && stream !== 'All') query.stream = stream;
    if (degreeType && degreeType !== 'All') query.degreeType = degreeType;

    const courses = await Course.find(query).sort({ stream: 1, name: 1 });
    return res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single course by ID
 * GET /api/courses/:id
 */
const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    // Find colleges offering this course
    const collegesOffering = await College.find({ coursesOffered: course._id }).select('name city collegeType');

    return res.status(200).json({
      success: true,
      course,
      collegesOffering,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCourses,
  getCourseById,
};
