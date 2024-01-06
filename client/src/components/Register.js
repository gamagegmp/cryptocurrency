import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./style.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      console.error("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      console.error("Password and Confirm Password do not match.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/user/register", {
        username,
        email,
        password,
        confirmPassword,
      });

      const token = {
        token: response.data.token,
        name: response.data.user.username,
        id: response.data.user._id,
        selected: response.data.user.selectedCryptos,
      };

      localStorage.setItem("token", JSON.stringify(token));
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Registration failed:", error);
    }
  
  };

  return (
    <div
      className="page-content"
      style={{ display: "block", marginTop: "100px" }}
    >
      <h2 className="h2-text">Register</h2>
      <form>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
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
        <label>Confirm Password:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <br />

        <button type="button" onClick={handleRegister}>
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
