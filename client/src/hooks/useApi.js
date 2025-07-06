// client/src/hooks/useApi.js
import { useState, useEffect, useCallback } from "react";

const useApi = (url, method = "GET", initialData = null) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false); // Changed to false, as initial GET will set it to true
  const [error, setError] = useState(null);
  const [triggerFetch, setTriggerFetch] = useState(0); // State to manually trigger fetches

  const fetchData = useCallback(
    async (body = null, additionalHeaders = {}) => {
      setLoading(true);
      setError(null);

      try {
        const options = {
          method,
          headers: {
            "Content-Type": "application/json",
            ...additionalHeaders,
          },
        };

        if (body) {
          options.body = JSON.stringify(body);
        }

        const response = await fetch(`/api${url}`, options);

        if (!response.ok) {
          let errorData;
          try {
            errorData = await response.json();
          } catch (jsonError) {
            errorData = { message: `Server error: ${response.statusText}` };
          }
          // If express-validator errors are present, use them
          if (response.status === 400 && errorData.errors) {
            const validationErrors = errorData.errors
              .map((err) => err.msg)
              .join(", ");
            throw new Error(`Validation Error: ${validationErrors}`);
          }
          throw new Error(
            errorData.message || `HTTP error! Status: ${response.status}`
          );
        }

        // For DELETE requests, response might be empty or just a message
        const responseData =
          method === "DELETE"
            ? { message: "Resource deleted successfully" }
            : await response.json();
        setData(responseData);
        return responseData;
      } catch (err) {
        console.error("API call error:", err);
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [url, method]
  );

  // Effect to run fetchData automatically for GET requests or when triggerFetch changes
  useEffect(() => {
    if (method === "GET") {
      fetchData();
    }
  }, [fetchData, method, triggerFetch]); // Added triggerFetch as a dependency

  // Function to manually trigger a re-fetch
  const refetch = useCallback(() => {
    if (method === "GET") {
      setTriggerFetch((prev) => prev + 1); // Increment state to trigger useEffect
    } else {
      console.warn(
        "refetch() is intended for GET requests. Use fetchData() for mutations."
      );
    }
  }, [method]);

  return { data, loading, error, fetchData, refetch };
};

export default useApi;
