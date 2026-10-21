const { AdmissionGuidance } = require('../models');

/**
 * Get admission guidance articles and FAQs
 * GET /api/guidance
 */
const getGuidanceList = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category && category !== 'All') {
      filter.category = category;
    }

    const items = await AdmissionGuidance.find(filter).sort({ order: 1, createdAt: 1 });
    return res.status(200).json({
      success: true,
      guidance: items,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single guidance item by slug
 * GET /api/guidance/:slug
 */
const getGuidanceBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const item = await AdmissionGuidance.findOne({ slug });
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Guidance section not found.',
      });
    }

    return res.status(200).json({
      success: true,
      guidance: item,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGuidanceList,
  getGuidanceBySlug,
};
