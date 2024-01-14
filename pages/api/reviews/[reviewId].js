import { connect, disconnect } from "../../../db";
import ReviewModel from "../../../models/ReviewModel";
import MovieModel from "../../../models/MovieModel";
import { ObjectId } from "mongodb"; // Import ObjectId from the MongoDB library

export default async function handler(req, res) {
  await connect();

  if (req.method === "PUT") {
    const { reviewId } = req.query;

    try {
      // Validate if reviewId is a valid ObjectId
      if (!ObjectId.isValid(reviewId)) {
        return res.status(400).json({ error: "Invalid reviewId format" });
      }

      const objectIdReviewId = new ObjectId(reviewId);
      const { reviewerName, rating, comments } = req.body;

      const updatedReview = await ReviewModel.findByIdAndUpdate(
        objectIdReviewId,
        { reviewerName, rating, comments },
        { new: true }
      );

      if (!updatedReview) {
        return res.status(404).json({ error: "Review not found" });
      }

      const movie = await MovieModel.findOneAndUpdate(
        { _id: updatedReview.movieId },
        { $pull: { reviews: objectIdReviewId } },
        { new: true }
      );
      movie.calculateAverageRating();

      await movie.save();

      res.status(200).json(updatedReview);
    } catch (error) {
      console.error("Error updating review:", error);
      res.status(500).json({ error: "Error updating review" });
    }
  }

  if (req.method === "DELETE") {
    let { reviewId } = req.query;

    try {
      // Validate if reviewId is a valid ObjectId
      if (!ObjectId.isValid(reviewId)) {
        return res.status(400).json({ error: "Invalid reviewId format" });
      }

      reviewId = new ObjectId(reviewId);

      const deletedReview = await ReviewModel.findByIdAndDelete(reviewId);

      if (!deletedReview) {
        return res.status(404).json({ error: "Review not found" });
      }

      const movie = await MovieModel.findOneAndUpdate(
        { _id: deletedReview.movieId },
        { $pull: { reviews: reviewId } },
        { new: true }
      );
      movie.calculateAverageRating();

      await movie.save();

      res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error deleting review" });
    }
  }

  await disconnect();
}
