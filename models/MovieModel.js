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
  },
  reviews: [ReviewModel.schema], // Use .schema to include the schema in the array
});

const MovieModel =
  mongoose.models.Movie || mongoose.model("Movie", movieSchema);

// export default Movie;
export default MovieModel;
