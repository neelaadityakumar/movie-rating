import React, { useState } from "react";
import { useRouter } from "next/router";

const AddMovie = () => {
  const [name, setName] = useState("");
  const [rating, setRating] = useState("");

  const [releaseDate, setReleaseDate] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!name || !releaseDate) {
      console.error("Name and Release Date are required.");
      return;
    }
    let reqData = { name, releaseDate };
    if (rating) {
      reqData = { ...reqData, rating };
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/movies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqData),
      });

      if (!res.ok) {
        console.error("Failed to add movie:", res.statusText);
        return;
      }

      const data = await res.json();

      console.log("Movie added:", data);
      // Redirect to the home page or handle as needed
      router.push("/");
    } catch (error) {
      console.error("Error adding movie:", error);
    }
  };

  return (
    <div className="container px-4 lg:px-6 max-w-[300px] mx-auto">
      <h1 className="text-2xl font-500 mb-6 mt-10">Add a Movie </h1>{" "}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          placeholder="Name"
          className="mt-4 w-full max-w-[300px] px-2 py-1"
          onChange={(e) => setName(e.target.value)}
        />
        <br />

        <input
          type="date"
          value={releaseDate}
          placeholder="Release Date"
          className="mt-4 w-full max-w-[300px] px-2 py-1"
          onChange={(e) => setReleaseDate(e.target.value)}
        />
        <br />

        <input
          type="number"
          max={10}
          value={rating}
          placeholder="Rating out of 10"
          className="my-4 w-full max-w-[300px] px-2 py-1"
          onChange={(e) => setRating(e.target.value)}
        />
        <br />
        <div className="flex justify-end">
          <button
            type="submit"
            className="   rounded hover:underline py-2 px-4 text-white bg-[#6558F5]"
          >
            Create Movie
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMovie;
