// models/ReviewModel.js
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  reviewerName: {
    type: String,
    default: null,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  comments: {
    type: String,
    required: true,
  },
});

// Add a static method to calculate the average rating
reviewSchema.statics.calculateAverageRating = async function (movieId) {
  const reviews = await this.find({ movieId });
  const totalReviews = reviews.length;

  if (totalReviews === 0) {
    return null;
  } else {
    const sumOfRatings = reviews.reduce(
      (total, review) => total + review.rating,
      0
    );
    return parseFloat((sumOfRatings / totalReviews).toFixed(2));
  }
};

const ReviewModel =
  mongoose.models.Review || mongoose.model("Review", reviewSchema);

export default ReviewModel;
