import React, { useCallback, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("token")));

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
    window.location.reload();
  }, [navigate]);
  return (
    <nav>
      <ul>
        <li>
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>
            Home
          </Link>
        </li>
        {!user ? (
          <>
            <li>
              <Link
                to="/login"
                className={location.pathname === "/login" ? "active" : ""}
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className={location.pathname === "/register" ? "active" : ""}
              >
                Register
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                to="/favorites"
                className={location.pathname === "/favorites" ? "active" : ""}
              >
                Favorites
              </Link>
            </li>
            <div style={{ position: "absolute", right: "0" }}>
              <li className="active">
                <span style={{ color: "white" }}>Hi  {user.name}</span>
              </li>
              <li>
                <Link to="/" onClick={handleLogout}>
                  Logout
                </Link>
              </li>
            </div>
          </>
        )}
        <li>
          <Link
            to="/addcrypto"
            className={location.pathname === "/addcrypto" ? "active" : ""}
          >
            Add Crypto
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
