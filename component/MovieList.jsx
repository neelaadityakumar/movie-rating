import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const MovieList = ({ movies }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);
    const router =useRouter()
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
  
      window.location.reload()
  
    } catch (error) {
      console.error(`Error deleting movie with ID ${movieId}:`, error);
    }
  };
  

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Movie List</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by movie name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredMovies.map((movie) => (
          <button key={movie._id}                 onClick={(e) =>{e.stopPropagation();router.push(`/movies/${movie._id}`)} }
           className="bg-blue-100 p-4 rounded">
            <h2 className="text-xl font-bold mb-2">{movie.name}</h2>
            <p>Released on {new Date(movie.releaseDate).toDateString()}</p>
            {movie.averageRating && (
              <p className="text-sm mt-2">Rating: {movie.averageRating}/10</p>
            )}
            <div className="mt-4 space-x-2">
                <button 
                
                onClick={(e) =>{e.stopPropagation();router.push(`/movies/edit/${movie._id}`)} }

                className="text-blue-500">Edit</button>
              <button
                onClick={(e) =>{e.stopPropagation();handleDelete(movie._id)} }
                className="text-red-500 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </button>
        ))}
      </div>
      <div className="flex gap-4 mt-4">
        <Link href="/movies/add">
          <button className="bg-blue-500 text-white py-2 px-4 rounded">
            Add a Movie
          </button>
        </Link>
        <Link href="/reviews/add">
          <button className="bg-blue-500 text-white py-2 px-4 rounded">
            Add a Review
          </button>
        </Link>
      </div>
    </div>
  );
};

export default MovieList;
