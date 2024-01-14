// pages/index.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import MovieList from "@/component/MovieList";

const Home = ({ movies }) => {
  return (
    <div>
      <MovieList movies={movies} />
    </div>
  );
};
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
export default Home;
