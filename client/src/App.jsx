// client/src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import PostListPage from "./pages/PostListPage";
import SinglePostPage from "./pages/SinglePostPage";
import PostFormPage from "./pages/PostFormPage";

function App() {
  return (
    <Router>
      <Navbar />
      <main className="container mx-auto p-4 md:px-8 bg-gray-50 dark:bg-gray-900 min-h-[calc(100vh-64px)]">
        {" "}
        <Routes>
          <Route path="/" element={<PostListPage />} />
          <Route path="/posts/:id" element={<SinglePostPage />} />
          <Route path="/create-post" element={<PostFormPage />} />
          <Route path="/edit-post/:id" element={<PostFormPage />} />
          <Route
            path="*"
            element={
              <h1 className="text-center text-4xl mt-20 text-gray-700 dark:text-gray-300">
                404 - Page Not Found
              </h1>
            }
          />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
