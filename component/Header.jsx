// components/Header.jsx

import React from "react";
import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-[#E3E8ED] p-4 text-[#444] flex justify-between items-center">
      <Link href={"/"} className="text-2xl font-bold">
        MOVIECRITIC
      </Link>
      <div className="flex gap-4">
        <Link href="/movies/add">
          <button className="rounded hover:underline py-2 px-4 bg-white text-[#6558F5] border-[#6558F5]">
            Add new Movie
          </button>
        </Link>
        <Link href="/reviews/add">
          <button className="rounded hover:underline py-2 px-4 text-white bg-[#6558F5]">
            Add new Review
          </button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
