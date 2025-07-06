// client/src/pages/PostFormPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useApi from "../hooks/useApi";

const PostFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
    category: "",
    tags: "",
    published: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useApi("/categories");
  const {
    data: postToEdit,
    loading: postLoading,
    error: postError,
    refetch: getPostById,
  } = useApi(`/posts/${id}`);
  const {
    loading: submitLoading,
    error: submitError,
    fetchData: executeSubmit,
  } = useApi(
    isEditMode ? `/posts/${id}` : "/posts",
    isEditMode ? "PUT" : "POST"
  );

  useEffect(() => {
    if (isEditMode && id) {
      getPostById();
    }
  }, [id, isEditMode, getPostById]);

  useEffect(() => {
    if (isEditMode && postToEdit) {
      setFormData({
        title: postToEdit.title,
        content: postToEdit.content,
        author: postToEdit.author,
        category: postToEdit.category?._id || "",
        tags: postToEdit.tags ? postToEdit.tags.join(", ") : "",
        published: postToEdit.published,
      });
    }
  }, [isEditMode, postToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.title.trim()) errors.title = "Title is required";
    else if (
      formData.title.trim().length < 5 ||
      formData.title.trim().length > 100
    )
      errors.title = "Title must be between 5 and 100 characters";
    if (!formData.content.trim()) errors.content = "Content is required";
    else if (formData.content.trim().length < 10)
      errors.content = "Content must be at least 10 characters long";
    if (!formData.author.trim()) errors.author = "Author is required";
    else if (
      formData.author.trim().length < 3 ||
      formData.author.trim().length > 50
    )
      errors.author = "Author name must be between 3 and 50 characters";
    if (!formData.category) errors.category = "Category is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitSuccess(false);

    if (!validateForm()) {
      return;
    }

    const payload = {
      ...formData,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    try {
      const result = await executeSubmit(payload); // Execute the API call
      setSubmitSuccess(true);
      // Optimistic UI: Navigate immediately assuming success
      const postId = isEditMode ? id : result._id;
      navigate(`/posts/${postId}`, {
        state: {
          message: `Post ${isEditMode ? "updated" : "created"} successfully!`,
        },
      });
    } catch (err) {
      console.error("Submission failed:", err);
      // If the error object contains an 'errors' array from express-validator
      if (err.errors && Array.isArray(err.errors)) {
        const apiErrors = {};
        err.errors.forEach((error) => {
          apiErrors[error.path] = error.msg;
        });
        setFormErrors(apiErrors);
      } else {
        // Fallback for general API errors
        alert(
          `Failed to ${isEditMode ? "update" : "create"} post: ${
            err.message || "An unknown error occurred."
          }`
        );
      }
    }
  };

  if (categoriesLoading || (isEditMode && postLoading))
    return (
      <div className="text-center text-lg mt-8 text-gray-700 dark:text-gray-300">
        Loading form...
      </div>
    );
  if (categoriesError)
    return (
      <div className="text-center text-lg mt-8 text-red-500 font-semibold">
        Error loading categories: {categoriesError}
      </div>
    );
  if (isEditMode && postError)
    return (
      <div className="text-center text-lg mt-8 text-red-500 font-semibold">
        Error loading post for editing: {postError}
      </div>
    );
  if (isEditMode && !postToEdit && !postLoading)
    return (
      <div className="text-center text-lg mt-8 text-gray-600 dark:text-gray-400">
        Post not found for editing.
      </div>
    );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-2xl mx-auto my-8">
      <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-50 mb-8">
        {isEditMode ? "Edit Post" : "Create New Post"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-group">
          <label
            htmlFor="title"
            className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              formErrors.title
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
            }`}
          />
          {formErrors.title && (
            <p className="text-red-500 text-xs italic mt-1">
              {formErrors.title}
            </p>
          )}
        </div>

        <div className="form-group">
          <label
            htmlFor="content"
            className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2"
          >
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="10"
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-y ${
              formErrors.content
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
            }`}
          ></textarea>
          {formErrors.content && (
            <p className="text-red-500 text-xs italic mt-1">
              {formErrors.content}
            </p>
          )}
        </div>

        <div className="form-group">
          <label
            htmlFor="author"
            className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2"
          >
            Author
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              formErrors.author
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
            }`}
          />
          {formErrors.author && (
            <p className="text-red-500 text-xs italic mt-1">
              {formErrors.author}
            </p>
          )}
        </div>

        <div className="form-group">
          <label
            htmlFor="category"
            className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              formErrors.category
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
            }`}
          >
            <option value="">Select a Category</option>
            {categories &&
              categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
          </select>
          {formErrors.category && (
            <p className="text-red-500 text-xs italic mt-1">
              {formErrors.category}
            </p>
          )}
        </div>

        <div className="form-group">
          <label
            htmlFor="tags"
            className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2"
          >
            Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g., react, nodejs, mongodb"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>

        <div className="mb-6 flex items-center">
          <input
            type="checkbox"
            id="published"
            name="published"
            checked={formData.published}
            onChange={handleChange}
            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
          />
          <label
            htmlFor="published"
            className="text-gray-700 dark:text-gray-200 text-sm font-bold"
          >
            Published
          </label>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md w-full transition duration-300 focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={submitLoading}
        >
          {submitLoading
            ? "Submitting..."
            : isEditMode
            ? "Update Post"
            : "Create Post"}
        </button>
        {submitError && (
          <p className="text-red-500 text-sm text-center mt-4">{submitError}</p>
        )}
        {submitSuccess && (
          <p className="text-green-600 text-sm text-center mt-4">
            Post {isEditMode ? "updated" : "created"} successfully!
          </p>
        )}
      </form>
    </div>
  );
};

export default PostFormPage;
