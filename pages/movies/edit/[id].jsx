import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const EditMovie = ({ movie }) => {
  const router = useRouter();
  const [name, setName] = useState(movie.name);
  const [releaseDate, setReleaseDate] = useState(movie.releaseDate);
  const [averageRating, setAverageRating] = useState(movie.averageRating);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/movies/${movie._id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, releaseDate, averageRating }),
      });

      if (!res.ok) {
        console.error(`Failed to update movie with ID ${movie._id}`);
        return;
      }

      console.log(`Movie with ID ${movie._id} updated successfully`);

      // Redirect to the movie list page or handle as needed
      router.push('/');

    } catch (error) {
      console.error(`Error updating movie with ID ${movie._id}:`, error);
    }
  };

  return (
    <div>
      <h1>Edit Movie</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <br />
        <label>
          Release Date:
          <input type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} />
        </label>
        <br />
        <label>
          Average Rating:
          <input type="number" value={averageRating} onChange={(e) => setAverageRating(e.target.value)} />
        </label>
        <br />
        <button type="submit">Update Movie</button>
      </form>
    </div>
  );
};

EditMovie.getInitialProps = async (context) => {
  const { id } = context.query;
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/movies/${id}`);
  const movie = await res.json();

  return { movie };
};

export default EditMovie;
