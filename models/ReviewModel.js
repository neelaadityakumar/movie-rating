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

// const ReviewModel = mongoose.model("Review", reviewSchema);
const ReviewModel =
  mongoose.models.Review || mongoose.model("Review", reviewSchema);

export default ReviewModel;
