import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const MovieDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [movieDetails, setMovieDetails] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const res = await fetch(`/api/movies/${id}`);
        const data = await res.json();
        setMovieDetails(data);
      } catch (error) {
        console.error(`Error fetching movie details for ID ${id}:`, error);
      }
    };

    fetchMovieDetails();
  }, [id]);

  return (
    <div>
      {movieDetails ? (
        <>
          <h1 className="text-3xl font-bold mb-4">{movieDetails.name}</h1>
          <p>Released on {new Date(movieDetails.releaseDate).toDateString()}</p>
          {/* Display other movie details */}
          <div className="mt-4 space-x-2">
            {/* Add options to edit and delete the movie */}
          </div>
          <h2 className="text-2xl font-bold mt-6 mb-4">Reviews</h2>
          {/* Display reviews in cards with delete and edit options */}
          {/* You may need to fetch and map through the reviews here */}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default MovieDetails;
