import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import PostCard from "../components/PostCard";

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userIdFromQuery = searchParams.get("id");
  const idToLoad = userIdFromQuery || user?._id;

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!idToLoad) return;
    api
      .get(`/users/${idToLoad}/profile`)
      .then((res) => setProfile(res.data))
      .catch(console.error);
  }, [idToLoad]);

  if (!profile) return <div>Loading profile…</div>;

  const { user: u, posts } = profile;

  return (
    <div style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
      <div style={{ minWidth: "200px", borderRight: "1px solid #444", paddingRight: "1rem" }}>
        <button
          onClick={() => navigate("/feed")}
          style={{
            marginBottom: "1rem",
            padding: "0.5rem 1rem",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          ← Back to Feed
        </button>
        <h2>{u.username}</h2>
        <p>Joined: {new Date(u.createdAt).toLocaleDateString()}</p>
        <p>Posts: {posts.length}</p>
      </div>
      <main style={{ flex: 1 }}>
        <h3>{u.username}’s Posts</h3>
        {posts.map((p) => (
          <PostCard key={p._id} post={p} onCommentOrLike={() => { }} onDeleted={() => { }} />
        ))}
      </main>
    </div>
  );
}

