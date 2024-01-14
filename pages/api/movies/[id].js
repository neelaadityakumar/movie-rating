import { connect, disconnect } from "../../../db";
import MovieModel from "../../../models/MovieModel";

export default async function handler(req, res) {
  const { id } = req.query;

  await connect();
  if (req.method === "GET") {
    try {
      const movie = await MovieModel.findById(id);

      if (!movie) {
        return res.status(404).json({ error: "Movie not found" });
      }

      return res.status(200).json(movie);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "DELETE") {
    try {
      const deletedMovie = await MovieModel.findByIdAndDelete(id);

      if (!deletedMovie) {
        return res.status(404).json({ error: "Movie not found" });
      }

      return res.status(200).json({ message: "Movie deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "PUT") {
    try {
      const { name, releaseDate, averageRating } = req.body;

      const updatedMovie = await MovieModel.findByIdAndUpdate(
        id,
        { name, releaseDate, averageRating },
        { new: true }
      );

      if (!updatedMovie) {
        return res.status(404).json({ error: "Movie not found" });
      }

      return res.status(200).json(updatedMovie);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  await disconnect();
}
