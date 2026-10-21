const { Favourite, College } = require('../models');

/**
 * Get student's favourite colleges
 * GET /api/favourites
 */
const getFavourites = async (req, res, next) => {
  try {
    const favourites = await Favourite.find({ user: req.user._id })
      .populate({
        path: 'college',
        populate: {
          path: 'coursesOffered',
          select: 'name shortName',
        },
      })
      .sort({ createdAt: -1 });

    const validColleges = favourites.filter((f) => f.college !== null).map((f) => f.college);

    return res.status(200).json({
      success: true,
      count: validColleges.length,
      favourites: validColleges,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add a college to favourites
 * POST /api/favourites/:collegeId
 */
const addFavourite = async (req, res, next) => {
  try {
    const { collegeId } = req.params;

    const college = await College.findById(collegeId);
    if (!college) {
      return res.status(404).json({
        success: false,
        message: 'College not found.',
      });
    }

    // Upsert or check existing
    const existing = await Favourite.findOne({ user: req.user._id, college: collegeId });
    if (existing) {
      return res.status(200).json({
        success: true,
        message: 'College is already in your favourites.',
        isFavourited: true,
      });
    }

    await Favourite.create({
      user: req.user._id,
      college: collegeId,
    });

    return res.status(201).json({
      success: true,
      message: `${college.name} added to favourites.`,
      isFavourited: true,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove college from favourites
 * DELETE /api/favourites/:collegeId
 */
const removeFavourite = async (req, res, next) => {
  try {
    const { collegeId } = req.params;

    await Favourite.findOneAndDelete({ user: req.user._id, college: collegeId });

    return res.status(200).json({
      success: true,
      message: 'College removed from favourites.',
      isFavourited: false,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Check favourite status for a college
 * GET /api/favourites/check/:collegeId
 */
const checkFavourite = async (req, res, next) => {
  try {
    const { collegeId } = req.params;
    if (!req.user) {
      return res.status(200).json({ isFavourited: false });
    }

    const fav = await Favourite.findOne({ user: req.user._id, college: collegeId });
    return res.status(200).json({
      success: true,
      isFavourited: !!fav,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFavourites,
  addFavourite,
  removeFavourite,
  checkFavourite,
};
