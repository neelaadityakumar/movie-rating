// models/MovieModel.js
import mongoose from "mongoose";
import ReviewModel from "./ReviewModel";

const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  averageRating: {
    type: Number,
    default: null,
    set: (value) => parseFloat(value.toFixed(2)), // Ensure at most two decimal places
  },
  reviews: [ReviewModel.schema],
});

movieSchema.methods.calculateAverageRating = function () {
  const totalReviews = this.reviews.length;
  if (totalReviews === 0) {
    this.averageRating = null;
  } else {
    const sumOfRatings = this.reviews.reduce(
      (total, review) => total + review.rating,
      0
    );
    this.averageRating = parseFloat((sumOfRatings / totalReviews).toFixed(2));
  }
};

const MovieModel =
  mongoose.models.Movie || mongoose.model("Movie", movieSchema);

export default MovieModel;
