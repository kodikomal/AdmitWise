const { User, Prediction, Favourite, College } = require('../models');

/**
 * Get student academic profile
 * GET /api/students/profile
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    return res.status(200).json({
      success: true,
      profile: user.academicProfile,
      completionPercentage: user.getProfileCompletion(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update student academic profile
 * PUT /api/students/profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      sscPercentage,
      hscPercentage,
      board,
      passingYear,
      hscStream,
      mathsMarks,
      entranceExam,
      entranceScore,
      category,
      preferredCourse,
      preferredCity,
      annualFeeBudget,
      collegeTypePreference,
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Student account not found.' });
    }

    if (name) user.name = name.trim();

    // Validation checks
    if (sscPercentage !== undefined && sscPercentage !== null && sscPercentage !== '') {
      const ssc = Number(sscPercentage);
      if (isNaN(ssc) || ssc < 0 || ssc > 100) {
        return res.status(400).json({ success: false, message: 'SSC percentage must be between 0 and 100.' });
      }
      user.academicProfile.sscPercentage = ssc;
    }

    if (hscPercentage !== undefined && hscPercentage !== null && hscPercentage !== '') {
      const hsc = Number(hscPercentage);
      if (isNaN(hsc) || hsc < 0 || hsc > 100) {
        return res.status(400).json({ success: false, message: 'HSC percentage must be between 0 and 100.' });
      }
      user.academicProfile.hscPercentage = hsc;
    }

    if (mathsMarks !== undefined && mathsMarks !== null && mathsMarks !== '') {
      const maths = Number(mathsMarks);
      if (isNaN(maths) || maths < 0 || maths > 100) {
        return res.status(400).json({ success: false, message: 'Maths marks must be between 0 and 100.' });
      }
      user.academicProfile.mathsMarks = maths;
    }

    if (entranceScore !== undefined && entranceScore !== null && entranceScore !== '') {
      const score = Number(entranceScore);
      if (isNaN(score) || score < 0 || score > 100) {
        return res.status(400).json({ success: false, message: 'Entrance exam percentile/score must be between 0 and 100.' });
      }
      user.academicProfile.entranceScore = score;
    }

    if (annualFeeBudget !== undefined && annualFeeBudget !== null && annualFeeBudget !== '') {
      const budget = Number(annualFeeBudget);
      if (isNaN(budget) || budget < 0) {
        return res.status(400).json({ success: false, message: 'Annual fee budget cannot be negative.' });
      }
      user.academicProfile.annualFeeBudget = budget;
    }

    if (board) user.academicProfile.board = board;
    if (passingYear) user.academicProfile.passingYear = Number(passingYear);
    if (hscStream) user.academicProfile.hscStream = hscStream;
    if (entranceExam) user.academicProfile.entranceExam = entranceExam;
    if (category) user.academicProfile.category = category;
    if (preferredCourse !== undefined) user.academicProfile.preferredCourse = preferredCourse;
    if (preferredCity !== undefined) user.academicProfile.preferredCity = preferredCity;
    if (collegeTypePreference) user.academicProfile.collegeTypePreference = collegeTypePreference;

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Academic profile updated successfully.',
      user,
      profile: user.academicProfile,
      completionPercentage: user.getProfileCompletion(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get student dashboard summary
 * GET /api/students/dashboard
 */
const getDashboardData = async (req, res, next) => {
  try {
    const studentId = req.user._id;

    // Run parallel queries
    const [predictionCount, recentPredictions, favouriteCount, favourites, user] = await Promise.all([
      Prediction.countDocuments({ student: studentId }),
      Prediction.find({ student: studentId }).sort({ createdAt: -1 }).limit(5).populate('course', 'name shortName'),
      Favourite.countDocuments({ user: studentId }),
      Favourite.find({ user: studentId }).populate('college', 'name city collegeType annualFeesApprox rating').limit(4),
      User.findById(studentId),
    ]);

    // Recommended colleges based on student's preferred course/city or featured colleges
    let recommendedColleges = [];
    if (user.academicProfile?.preferredCity) {
      recommendedColleges = await College.find({
        city: new RegExp(`^${user.academicProfile.preferredCity}$`, 'i'),
      })
        .limit(3)
        .select('name city collegeType annualFeesApprox rating naacGrade');
    }
    if (recommendedColleges.length === 0) {
      recommendedColleges = await College.find({ isFeatured: true })
        .limit(3)
        .select('name city collegeType annualFeesApprox rating naacGrade');
    }

    return res.status(200).json({
      success: true,
      stats: {
        predictionCount,
        favouriteCount,
        profileCompletion: user.getProfileCompletion(),
      },
      academicProfile: user.academicProfile,
      recentPredictions,
      favouriteColleges: favourites.map((f) => f.college),
      recommendedColleges,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getDashboardData,
};
