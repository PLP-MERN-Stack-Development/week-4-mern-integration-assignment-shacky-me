import React from "react";
import { Link } from "react-router-dom";
import useApi from "../hooks/useApi";

const PostListPage = () => {
  const { data: posts, loading, error } = useApi("/posts");

  if (loading)
    return (
      <div className="text-center text-lg mt-8 text-gray-700 dark:text-gray-300">
        Loading posts...
      </div>
    );
  if (error)
    return (
      <div className="text-center text-lg mt-8 text-red-500 font-semibold">
        Error: {error}
      </div>
    );
  if (!posts || posts.length === 0)
    return (
      <div className="text-center text-lg mt-8 text-gray-600 dark:text-gray-400">
        No posts found.{" "}
        <Link to="/create-post" className="text-blue-600 hover:underline">
          Create one?
        </Link>
      </div>
    );

  return (
    <div>
      <h1 className="text-4xl font-extrabold text-center text-gray-800 dark:text-gray-100 my-8">
        All Blog Posts
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col"
          >
            <div className="p-6 flex-grow">
              <Link
                to={`/posts/${post._id}`}
                className="block text-gray-900 dark:text-gray-50 hover:text-blue-600 dark:hover:text-blue-400 transition duration-300"
              >
                <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
              </Link>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                By {post.author}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 italic mb-4">
                Category: {post.category?.name || "N/A"}
              </p>
              <p className="text-gray-700 dark:text-gray-200 text-base leading-relaxed">
                {post.content.substring(0, 150)}...
              </p>
            </div>
            <div className="p-6 pt-0">
              <Link
                to={`/posts/${post._id}`}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
              >
                Read More
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostListPage;
