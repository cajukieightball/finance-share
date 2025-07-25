// src/components/LikeButton.jsx
import React from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

export default function LikeButton({ postId, currentLikes, onLike }) {
  const { user } = useAuth();

  const handleLike = async () => {
    try {
      // send a "like" toggle to the server
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/posts/${postId}/like`,
        {},
        { withCredentials: true }
      );
      // server returns updated like count
      onLike(res.data.likeCount);
    } catch (err) {
      console.error("Error liking post:", err);
      alert("Could not like the post.");
    }
  };

  return (
    <button className="like-button" onClick={handleLike}>
      ❤️ {currentLikes}
    </button>
  );
}
