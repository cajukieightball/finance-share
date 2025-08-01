import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const { toggleTheme, theme } = useTheme();
  const navigate = useNavigate();

  return (
    <nav style={{ padding: "1rem" }}>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li style={{ margin: "0.5rem 0", cursor: "pointer" }} onClick={() => navigate("/feed")}>
          Home
        </li>
        <li style={{ margin: "0.5rem 0", cursor: "pointer" }} onClick={() => navigate("/profile")}>
          My Profile
        </li>
        <li style={{ margin: "0.5rem 0", cursor: "pointer" }} onClick={() => navigate("/feed")}>
          New Post
        </li>
        <li
          style={{
            marginTop: "2rem",
            padding: "0.5rem",
            background: "#333",
            borderRadius: "4px",
            color: "#fff",
            textAlign: "center",
            cursor: "pointer",
          }}
          onClick={toggleTheme}
        >
          {theme === "dark" ? "☀ Light Mode" : "🌙 Dark Mode"}
        </li>
      </ul>
    </nav>
  );
}






