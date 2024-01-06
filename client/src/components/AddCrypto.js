import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./style.css";

const AddCrypto = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleAddCrypto = async () => {
    try {
      await axios.post("http://localhost:8080/crypto/", {
        name,
      });
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div
      className="page-content"
      style={{ display: "block", marginTop: "100px" }}
    >
      <h2 className="h2-text">Add Crypto</h2>
      <form>
        <label>Crypto Name:</label>
        <input
          type="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <button type="button" onClick={handleAddCrypto}>
          ADD
        </button>
      </form>
    </div>
  );
};

export default AddCrypto;
