import { connect, disconnect } from "../../../db";
import ReviewModel from "../../../models/ReviewModel";
import MovieModel from "../../../models/MovieModel";
import { ObjectId } from "mongodb"; // Import ObjectId from the MongoDB library

export default async function handler(req, res) {
  await connect();

  if (req.method === "GET") {
    const { movieId } = req.query;

    try {
      const reviews = await ReviewModel.find({ movieId });
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Error fetching reviews" });
    }
  }

  if (req.method === "POST") {
    const { movieId, reviewerName, rating, comments } = req.body;

    try {
      const movie = await MovieModel.findById(movieId);

      if (!movie) {
        res.status(404).json({ error: "Movie not found" });
        return;
      }

      const newReview = new ReviewModel({
        movieId,
        reviewerName,
        rating,
        comments,
      });

      await newReview.save();
      movie.reviews.push(newReview);
      await movie.save();

      res.status(201).json(newReview);
    } catch (error) {
      res.status(500).json({ error: "Error adding review" });
    }
  }

  if (req.method === "DELETE") {
    let { reviewId } = req.query;
    reviewId = new ObjectId(reviewId);

    try {
      const deletedReview = await ReviewModel.findByIdAndDelete(reviewId);

      if (!deletedReview) {
        return res.status(404).json({ error: "Review not found" });
      }

      // Remove the deleted review from the associated movie's reviews array
      const movie = await MovieModel.findOneAndUpdate(
        { _id: deletedReview.movieId },
        { $pull: { reviews: reviewId } },
        { new: true }
      );

      res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error deleting review" });
    }
  }

  await disconnect();
}
