import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const AddReview = ({movies}) => {
  const [selectedMovieId, setSelectedMovieId] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [rating, setRating] = useState('');
  const [comments, setComments] = useState('');
  const router = useRouter();


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          movieId: selectedMovieId,
          reviewerName,
          rating,
          comments,
        }),
      });

      const data = await res.json();

      console.log('Review added:', data);
      // Redirect to the home page or handle as needed
      router.push('/');
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  return (
    <div>
      <h1>Add a Review</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Select a Movie:
          <select value={selectedMovieId} onChange={(e) => setSelectedMovieId(e.target.value)}>
            <option value="" disabled>Select a movie</option>
            {movies?.map((movie) => (
              <option key={movie._id} value={movie._id}>{movie.name}</option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Reviewer Name:
          <input type="text" value={reviewerName} onChange={(e) => setReviewerName(e.target.value)} />
        </label>
        <br />
        <label>
          Rating:
          <input type="number" value={rating} onChange={(e) => setRating(e.target.value)} />
        </label>
        <br />
        <label>
          Comments:
          <textarea value={comments} onChange={(e) => setComments(e.target.value)} />
        </label>
        <br />
        <button type="submit">Add Review</button>
      </form>
    </div>
  );
};

export default AddReview;


export async function getServerSideProps() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/movies`);
      const movies = await res.json(); // Parse the response as JSON
  
      return {
        props: {
          movies,
        },
      };
    } catch (error) {
      console.error("Error fetching data:", error);
  
      return {
        props: {
          movies: [],
        },
      };
    }
  }