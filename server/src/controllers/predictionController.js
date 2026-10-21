const { Prediction, Course, User } = require('../models');
const PredictionEngine = require('../services/predictionEngine');
const { generatePredictionPDF } = require('../services/pdfService');

/**
 * Run Admission Prediction
 * POST /api/predictions
 */
const createPrediction = async (req, res, next) => {
  try {
    const {
      courseId,
      sscPercentage,
      hscPercentage,
      mathsMarks,
      stream,
      category,
      entranceExam,
      entranceScore,
      preferredCity,
      annualFeeBudget,
      collegeTypePreference,
      saveToProfile,
    } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Please select a course to run the prediction.',
      });
    }

    // Prepare profile payload
    const studentProfile = {
      sscPercentage: sscPercentage !== undefined ? Number(sscPercentage) : null,
      hscPercentage: Number(hscPercentage) || 0,
      mathsMarks: mathsMarks !== undefined && mathsMarks !== '' ? Number(mathsMarks) : null,
      stream: stream || 'Science',
      category: category || 'Open/General',
      entranceExam: entranceExam || 'None / Merit Based',
      entranceScore: entranceScore ? Number(entranceScore) : 0,
      preferredCity: preferredCity || 'All',
      annualFeeBudget: annualFeeBudget ? Number(annualFeeBudget) : null,
      collegeTypePreference: collegeTypePreference || 'Any',
    };

    // Execute rule-based engine
    const predictionData = await PredictionEngine.predict(studentProfile, courseId);

    let savedPrediction = null;

    // If authenticated student, save to database
    if (req.user && req.user._id) {
      savedPrediction = await Prediction.create({
        student: req.user._id,
        course: courseId,
        courseName: predictionData.courseName,
        academicSnapshot: predictionData.academicSnapshot,
        algorithmVersion: predictionData.algorithmVersion,
        summaryCounts: predictionData.summaryCounts,
        results: predictionData.results,
      });

      // Optionally update user's profile with these preferences
      if (saveToProfile) {
        await User.findByIdAndUpdate(req.user._id, {
          $set: {
            'academicProfile.hscPercentage': studentProfile.hscPercentage,
            'academicProfile.sscPercentage': studentProfile.sscPercentage,
            'academicProfile.mathsMarks': studentProfile.mathsMarks,
            'academicProfile.hscStream': studentProfile.stream,
            'academicProfile.category': studentProfile.category,
            'academicProfile.entranceExam': studentProfile.entranceExam,
            'academicProfile.entranceScore': studentProfile.entranceScore,
            'academicProfile.preferredCity': studentProfile.preferredCity,
            'academicProfile.annualFeeBudget': studentProfile.annualFeeBudget,
          },
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Admission prediction executed successfully.',
      predictionId: savedPrediction ? savedPrediction._id : null,
      prediction: savedPrediction || predictionData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get authenticated student's prediction history
 * GET /api/predictions/history
 */
const getPredictionHistory = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(20, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const [predictions, total] = await Promise.all([
      Prediction.find({ student: req.user._id })
        .populate('course', 'name shortName stream degreeType')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Prediction.countDocuments({ student: req.user._id }),
    ]);

    return res.status(200).json({
      success: true,
      predictions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single prediction record by ID
 * GET /api/predictions/:id
 */
const getPredictionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prediction = await Prediction.findById(id).populate('course', 'name shortName degreeType durationYears');

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: 'Prediction record not found.',
      });
    }

    // Verify ownership if not admin
    if (req.user && req.user.role !== 'admin' && prediction.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this prediction record.',
      });
    }

    return res.status(200).json({
      success: true,
      prediction,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a prediction record from history
 * DELETE /api/predictions/:id
 */
const deletePrediction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prediction = await Prediction.findById(id);

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: 'Prediction record not found.',
      });
    }

    // Ownership check
    if (req.user.role !== 'admin' && prediction.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You can only delete your own predictions.',
      });
    }

    await Prediction.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Prediction record deleted from history.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Download prediction result as PDF report
 * GET /api/predictions/:id/pdf
 */
const downloadReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prediction = await Prediction.findById(id);

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: 'Prediction record not found.',
      });
    }

    // Ownership check
    if (req.user && req.user.role !== 'admin' && prediction.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to download this report.',
      });
    }

    const student = await User.findById(prediction.student).select('name email');

    const filename = `AdmitWise_Report_${prediction.courseName.replace(/\s+/g, '_')}_${Date.now()}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    generatePredictionPDF(prediction, student, res);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPrediction,
  getPredictionHistory,
  getPredictionById,
  deletePrediction,
  downloadReport,
};
