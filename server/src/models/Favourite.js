const mongoose = require('mongoose');

const favouriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'College',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

favouriteSchema.index({ user: 1, college: 1 }, { unique: true });

const Favourite = mongoose.model('Favourite', favouriteSchema);
module.exports = Favourite;
