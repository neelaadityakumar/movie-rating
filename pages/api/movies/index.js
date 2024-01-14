import { connect, disconnect } from "../../../db";
import MovieModel from "../../../models/MovieModel";

export default async function handler(req, res) {
  try {
    await connect();

    if (req.method === "GET") {
      const movies = await MovieModel.find({});
      res.status(200).json(movies);
    }

    if (req.method === "POST") {
      const { name, releaseDate } = req.body;

      if (!name || !releaseDate) {
        return res
          .status(400)
          .json({ error: "Name and Release Date are required" });
      }

      const newMovie = new MovieModel({
        name,
        releaseDate,
      });

      await newMovie.save();
      res.status(201).json(newMovie);
    }
  } catch (error) {
    console.error("Error in API handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await disconnect();
  }
}
