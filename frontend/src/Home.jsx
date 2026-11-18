import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import heroImg from "./assets/home-image.png";         
import "./index.css";

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" />
  </svg>
);

const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
    <path d="M7 10V7a5 5 0 0 1 10 0v3h1a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1zm2 0h6V7a3 3 0 0 0-6 0z" />
  </svg>
);



function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please enter username and password.");
      return;
    }

    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      window.dispatchEvent(new Event("authChange"));
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message ||
          "Unable to connect to the server. Please try again."
      );
    } 
  };

  return (
    <div className="home-container">
      {/* Left: branding */}
      <div className="left-container">
        <h1>nexus</h1>
        <h4>Inventory Management</h4>
        <h2>Smarter Inventory. Better Business.</h2>
        <p>Effortless inventory management for smarter business operations.</p>
        <img className="hero-img" src={heroImg} alt="Nexus dashboard on laptop and tablet with stock boxes" />
      </div>

      {/* Right: frosted login card */}
      <div className="right-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>FAPSS</h2>
          <h4>Welcome Back</h4>
          <p className="login-sub">Enter your User name and password to login</p>

          <div className="input-wrap">
            <span className="input-icon"><UserIcon /></span>
            <input
              type="text"
              name="username"
              aria-label="Username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-wrap">
            <span className="input-icon"><LockIcon /></span>
            <input
              type="password"
              name="password"
              aria-label="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-btn">
            LOGIN
          </button>

          <div className="help-text">
            <strong>Need Help ?</strong>
            <span>support@fapss.com</span>
          </div>

          <div className="footer">&copy; 2026 FAPSS. All rights reserved</div>
        </form>
      </div>
    </div>
  );
}

export default Home;