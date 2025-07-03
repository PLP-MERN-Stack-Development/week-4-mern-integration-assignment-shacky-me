import { BrowserRouter as Router, Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import Layout from "./components/Layout";
import Posts from "./pages/Posts";
import Categories from "./pages/Categories";

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="posts" element={<Posts />} />
            <Route path="categories" element={<Categories />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};
export default App;
