// models/MovieModel.js
import mongoose from "mongoose";

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
});

const MovieModel =
  mongoose.models.Movie || mongoose.model("Movie", movieSchema);

// export default Movie;
export default MovieModel;
