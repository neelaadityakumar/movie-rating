import { connect, disconnect } from "../../../db";
import ReviewModel from "../../../models/ReviewModel";
import MovieModel from "../../../models/MovieModel";
import { ObjectId } from "mongodb"; // Import ObjectId from the MongoDB library

export default async function handler(req, res) {
  await connect();

  try {
    if (req.method === "GET") {
      const { movieId } = req.query;
      const reviews = await ReviewModel.find({ movieId });
      res.status(200).json(reviews);
    } else if (req.method === "POST") {
      let { movieId, reviewerName, rating, comments } = req.body;
      movieId = new ObjectId(movieId);

      try {
        if (!ObjectId.isValid(movieId)) {
          res.status(400).json({ error: "Invalid movieId" });
          return;
        }

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
        movie.calculateAverageRating();

        await movie.save();

        res.status(201).json(newReview);
      } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ error: "Error adding review" });
      }
    } else if (req.method === "POST") {
      const { movieId, reviewerName, rating, comments } = req.body;

      try {
        if (!ObjectId.isValid(movieId)) {
          res.status(400).json({ error: "Invalid movieId" });
          return;
        }

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
        movie.calculateAverageRating();

        await movie.save();

        res.status(201).json(newReview);
      } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ error: "Error adding review" });
      }
    } else if (req.method === "DELETE") {
      let { reviewId } = req.query;
      reviewId = new ObjectId(reviewId);

      const deletedReview = await ReviewModel.findByIdAndDelete(reviewId);

      if (!deletedReview) {
        throw { statusCode: 404, message: "Review not found" };
      }

      // Remove the deleted review from the associated movie's reviews array
      const movie = await MovieModel.findOneAndUpdate(
        { _id: deletedReview.movieId },
        { $pull: { reviews: reviewId } },
        { new: true }
      );
      movie.calculateAverageRating(); // Recalculate average rating
      await movie.save();

      res.status(200).json({ message: "Review deleted successfully" });
    } else {
      res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res
      .status(statusCode)
      .json({ error: error.message || "Internal Server Error" });
  } finally {
    await disconnect();
  }
}
