import Navlinks from "../data/Navlinks";
import { NavLink } from "react-router";

const Navigation = () => {
  return (
    <header className="shadow-xs sticky top-0 right-0 left-0 z-40">
      <nav className="container mx-auto p-4">
        <ul className="flex space-x-15 justify-center">
          {Navlinks.map((link) => (
            <li
              key={link.path}
              className="hover:text-yellow-400 transition-colors"
            >
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  isActive
                    ? "text-lg font-medium text-yellow-400"
                    : "text-lg font-medium"
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Navigation;
