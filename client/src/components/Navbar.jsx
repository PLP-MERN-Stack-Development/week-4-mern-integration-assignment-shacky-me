import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-white text-2xl font-bold hover:text-blue-400 transition duration-300"
        >
          MERN Blog
        </Link>
        <ul className="flex space-x-6">
          <li>
            <Link
              to="/"
              className="text-white text-lg hover:text-blue-400 transition duration-300"
            >
              Posts
            </Link>
          </li>
          <li>
            <Link
              to="/create-post"
              className="text-white text-lg hover:text-blue-400 transition duration-300"
            >
              Create Post
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
