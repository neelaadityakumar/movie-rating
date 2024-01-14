import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

const AddReview = ({ movies }) => {
  const [selectedMovieId, setSelectedMovieId] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState("");
  const [comments, setComments] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            movieId: selectedMovieId,
            reviewerName,
            rating,
            comments,
          }),
        }
      );

      const data = await res.json();

      console.log("Review added:", data);
      // Redirect to the home page or handle as needed
      router.push("/");
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  return (
    <div className="container px-4 lg:px-6 max-w-[300px] mx-auto">
      <h1 className="text-2xl font-500 mb-6 mt-10">Add new Review </h1>
      <form onSubmit={handleSubmit}>
        <select
          value={selectedMovieId}
          onChange={(e) => setSelectedMovieId(e.target.value)}
          className="w-full max-w-[300px] bg-white border-black border py-1"
        >
          <option value="Select a movie" disabled>
            Select a movie
          </option>
          {movies?.map((movie) => (
            <option key={movie._id} value={movie._id}>
              {movie.name}
            </option>
          ))}
        </select>
        <br />

        <input
          type="text"
          value={reviewerName}
          placeholder="Your name"
          className="mt-4 w-full max-w-[300px] px-2 py-1"
          onChange={(e) => setReviewerName(e.target.value)}
        />
        <br />

        <input
          type="number"
          value={rating}
          placeholder="Rating out of 10"
          className="mt-4 w-full max-w-[300px] px-2 py-1"
          onChange={(e) => setRating(e.target.value)}
        />
        <br />

        <textarea
          value={comments}
          placeholder="Review comments"
          className="my-4 w-full max-w-[300px] px-2 py-1"
          onChange={(e) => setComments(e.target.value)}
        />
        <br />
        <div className="flex justify-end">
          <button
            type="submit"
            className="   rounded hover:underline py-2 px-4 text-white bg-[#6558F5]"
          >
            Add Review
          </button>
        </div>
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
