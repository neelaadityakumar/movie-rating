// pages/reviews/add.js
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const AddReview = () => {
  const [movieId, setMovieId] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [rating, setRating] = useState('');
  const [comments, setComments] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`, {
        movieId,
        reviewerName,
        rating,
        comments,
      });

      console.log('Review added:', res.data);
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
          Movie ID:
          <input type="text" value={movieId} onChange={(e) => setMovieId(e.target.value)} />
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
