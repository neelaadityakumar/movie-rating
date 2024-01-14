import { connect, disconnect } from "../../../db";
import ReviewModel from "../../../models/ReviewModel";
import MovieModel from "../../../models/MovieModel";
import { ObjectId } from "mongodb"; // Import ObjectId from the MongoDB library

export default async function handler(req, res) {
  await connect();

  if (req.method === "PUT") {
    const { reviewId } = req.query;

    try {
      // Convert reviewId to ObjectId
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

      res.status(200).json(updatedReview);
    } catch (error) {
      console.error("Error updating review:", error);
      res.status(500).json({ error: "Error updating review" });
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
