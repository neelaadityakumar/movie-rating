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
    <div>
      <h1>Add a Movie</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <br />
        <label>
          Release Date:
          <input
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
          />
        </label>
        <br />
        <label>
          Average rating :
          <input
            type="number"
            max={10}
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
        </label>{" "}
        <br />
        <button type="submit">Add Movie</button>
      </form>
    </div>
  );
};

export default AddMovie;
