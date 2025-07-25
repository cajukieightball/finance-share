import React, { useState } from "react";
import api from '../services/api';

export default function NewCommentForm({ postId, onComment }) {
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      await api.post('/comments', { postId, content });
      setContent("");
      onComment();
    } catch (err) {
      console.error("Error posting comment:", err);
      alert("Could not post comment");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form-container">
      <input
        className="comment-input"
        placeholder="Write a comment…"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        type="submit"
        className="submit-button"
      >
        Post
      </button>
    </form>
  );
}



