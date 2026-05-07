import { Bookmark, LogOut, Newspaper } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Layout = ({ children }) => {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/">
          <Newspaper aria-hidden="true" size={24} />
          <span>HN Scraper</span>
        </Link>

        <nav className="nav-links" aria-label="Primary navigation">
          <NavLink to="/">Stories</NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/bookmarks">
                <Bookmark aria-hidden="true" size={18} />
                Bookmarks
              </NavLink>
              <span className="user-chip">{user?.name}</span>
              <button className="icon-text-button" type="button" onClick={logout}>
                <LogOut aria-hidden="true" size={18} />
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink className="primary-link" to="/register">
                Register
              </NavLink>
            </>
          )}
        </nav>
      </header>

      {children}
    </div>
  );
};

export default Layout;
