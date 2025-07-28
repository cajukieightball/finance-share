
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import PostCard from "../components/PostCard";
import { useSearchParams } from "react-router-dom";

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [searchParams] = useSearchParams();

  const userIdFromQuery = searchParams.get("id");
  const idToLoad = userIdFromQuery || user?.id;

  useEffect(() => {
    if (!idToLoad) return;

    api.get(`/users/${idToLoad}/profile`)
      .then(res => setProfile(res.data))
      .catch(console.error);
  }, [idToLoad]);

  if (!profile) return <p>Loading…</p>;

  const { user: u, posts } = profile;

  return (
    <div className="profile-page">
      <aside style={{ padding: "1rem", borderRight: "1px solid #444" }}>
        <h2>{u.username}</h2>
        <p>Joined: {new Date(u.createdAt).toLocaleDateString()}</p>
        <p>Posts: {posts.length}</p>
      </aside>
      <main style={{ padding: "1rem" }}>
        <h3>{u.username}’s Posts</h3>
        {posts.map(p => (
          <PostCard key={p._id} post={p} />
        ))}
      </main>
    </div>
  );
}
