import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./style.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:8080/user/login", {
        email,
        password,
      });

      const token = {
        token: response.data.token,
        name: response.data.checkUser.username,
        id: response.data.checkUser._id,
        selected: response.data.checkUser.selectedCryptos,
      };

      localStorage.setItem("token", JSON.stringify(token));

      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div
      className="page-content"
      style={{ display: "block", marginTop: "100px" }}
    >
      <h2 className="h2-text">Login</h2>
      <form>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="button" onClick={handleLogin}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
