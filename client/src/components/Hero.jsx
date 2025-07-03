import { Link } from "react-router";

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-purple-700 via-purple-500 to-indigo-600 h-screen text-white py-20 px-6 text-center">
      <div className="container mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4 animate-fade-in-down">
          Unleash Your Curiosity. Dive Deep.
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fade-in-up">
          Discover insightful articles, captivating stories, and expert opinions
          on a myriad of topics.
        </p>
        <Link
          to="/blog"
          className="bg-white text-indigo-700 hover:bg-gray-100 font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 transform hover:scale-105 animate-zoom-in"
        >
          Start Reading
        </Link>
      </div>
    </section>
  );
};
export default Hero;
