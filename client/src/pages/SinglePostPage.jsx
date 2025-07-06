import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useApi from "../hooks/useApi";

const SinglePostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: post,
    loading,
    error,
    refetch: getPost,
  } = useApi(`/posts/${id}`);
  const {
    loading: deleteLoading,
    error: deleteError,
    fetchData: executeDelete,
  } = useApi(`/posts/${id}`, "DELETE");

  useEffect(() => {
    getPost(); // Trigger the fetch when component mounts or id changes
  }, [id, getPost]);

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this post? This action cannot be undone."
      )
    ) {
      try {
        // Optimistic UI: Navigate away immediately
        navigate("/", { state: { message: "Post is being deleted..." } });
        await executeDelete(); // Perform the actual delete API call
        // If successful, the navigation already happened.
        // We could show a success toast here if we had a global messaging system.
        // For now, the navigation message suffices.
      } catch (err) {
        // If delete fails, navigate back to the post page and show error
        navigate(`/posts/${id}`, {
          state: {
            error: `Failed to delete post: ${deleteError || err.message}`,
          },
        });
      }
    }
  };

  // Check for messages/errors passed via navigate state
  const navigateState = useNavigate().state;
  const message = navigateState?.message;
  const pageError = navigateState?.error;

  if (loading)
    return (
      <div className="text-center text-lg mt-8 text-gray-700 dark:text-gray-300">
        Loading post...
      </div>
    );
  if (error)
    return (
      <div className="text-center text-lg mt-8 text-red-500 font-semibold">
        Error: {error}
      </div>
    );
  if (!post)
    return (
      <div className="text-center text-lg mt-8 text-gray-600 dark:text-gray-400">
        Post not found.
      </div>
    );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-3xl mx-auto my-8">
      {message && (
        <div className="bg-blue-100 text-blue-800 p-3 rounded-md mb-4 text-center">
          {message}
        </div>
      )}
      {pageError && (
        <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4 text-center">
          {pageError}
        </div>
      )}

      <div className="text-center mb-6">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-50 mb-3">
          {post.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-md">
          By {post.author} | Category:{" "}
          <span className="italic">{post.category?.name || "N/A"}</span>
        </p>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Published: {post.published ? "Yes" : "No"}
        </p>
        {post.tags && post.tags.length > 0 && (
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
            Tags:{" "}
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2 dark:bg-blue-900 dark:text-blue-200"
              >
                {tag}
              </span>
            ))}
          </p>
        )}
      </div>
      <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed text-lg mb-8">
        <p>{post.content}</p>
      </div>
      <div className="flex justify-center gap-4 mt-8">
        <Link
          to={`/edit-post/${post._id}`}
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-5 rounded-md transition duration-300"
        >
          Edit Post
        </Link>
        <button
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={deleteLoading}
        >
          {deleteLoading ? "Deleting..." : "Delete Post"}
        </button>
        {deleteError && (
          <p className="text-red-500 text-sm text-center mt-2">
            Delete error: {deleteError}
          </p>
        )}
      </div>
      <div className="text-center mt-8">
        <Link
          to="/"
          className="text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-500"
        >
          ← Back to all posts
        </Link>
      </div>
    </div>
  );
};

export default SinglePostPage;
