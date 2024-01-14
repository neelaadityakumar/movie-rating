// pages/api/reviews.js
import { connect, disconnect } from "../../db";
import ReviewModel from "../../models/ReviewModel"; // Create a ReviewModel file with your review schema

export default async function handler(req, res) {
  await connect();

  if (req.method === "GET") {
    const reviews = await ReviewModel.find({});
    res.status(200).json(reviews);
  }

  if (req.method === "POST") {
    const { movieId, reviewerName, rating, comments } = req.body;

    const newReview = new ReviewModel({
      movieId,
      reviewerName,
      rating,
      comments,
    });

    try {
      await newReview.save();
      res.status(201).json(newReview);
    } catch (error) {
      res.status(500).json({ error: "Error creating review" });
    }
  }

  await disconnect();
}
