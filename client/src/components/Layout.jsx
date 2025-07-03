import { Outlet } from "react-router";
import Navigation from "./Navigation";

const Layout = () => {
  return (
    <div>
      <Navigation />

      <main>
        <Outlet />
      </main>
    </div>
  );
};
export default Layout;
