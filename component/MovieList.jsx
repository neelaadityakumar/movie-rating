import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const MovieList = ({ movies }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMovies, setFilteredMovies] = useState([]);
  const router = useRouter();
  useEffect(() => {
    const filtered = movies?.filter((movie) =>
      movie.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMovies(filtered);
  }, [searchTerm, movies]);

  const handleDelete = async (movieId) => {
    try {
      const res = await fetch(`/api/movies/${movieId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        console.error(`Failed to delete movie with ID ${movieId}`);
        return;
      }

      console.log(`Movie with ID ${movieId} deleted successfully`);

      window.location.reload();
    } catch (error) {
      console.error(`Error deleting movie with ID ${movieId}:`, error);
    }
  };

  return (
    <div className="px-4 lg:px-6">
      <h1 className="text-2xl lg:text-4xl font-400 mb-6 mt-10">
        The best movie reviews site!
      </h1>
      <div className="mb-10">
        <input
          type="text"
          placeholder="Search for your favourite movie"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-2 py-3  border outline-[#6459F5] rounded w-full max-w-md "
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredMovies.map((movie) => (
          <button
            key={movie._id}
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/movies/${movie._id}`);
            }}
            className="bg-[#E0DFFC] p-4 rounded text-left text-gray-700"
          >
            <h2 className="text-xl font-700 mb-2 line-clamp-1">{movie.name}</h2>
            <p className="italic">
              Released on {new Date(movie.releaseDate).toDateString()}
            </p>
            {movie.averageRating && (
              <p className="text-base mt-2 font-extrabold">
                Rating: {movie.averageRating}/10
              </p>
            )}
            <div className="mt-4 space-x-2">
              <div className=" m-2 flex justify-end gap-4">
                <FontAwesomeIcon
                  icon={faEdit}
                  className="text-gray-500 cursor-pointer mr-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/movies/edit/${movie._id}`);
                  }}
                />
                <FontAwesomeIcon
                  icon={faTrash}
                  className="text-gray-500 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(movie._id);
                  }}
                />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MovieList;
