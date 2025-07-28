// import React from "react";
// import { useAuth } from "../contexts/AuthContext";
// import axios from "axios";
// import { Spinner } from "../components/Spinner";

// export default function ProfilePage() {
//   const { user } = useAuth();
//   const [profile, setProfile] = React.useState(null);
//   const [loading, setLoading] = React.useState(true);

//   React.useEffect(() => {
//     axios
//       .get(`/api/users/${user._id}`)
//       .then((res) => setProfile(res.data.user))
//       .catch((err) => {
//         console.error("Failed to load profile:", err);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, [user._id]);

//   if (loading) return <Spinner />;

//   if (!profile) {
//     return (
//       <div className="p-8">
//         <h1 className="text-2xl font-bold">Profile</h1>
//         <p>Unable to load your profile.</p>
//       </div>
//     );
//   }






//   useEffect(() => {
//     if (!user) return;
//     api.get(`/users/${user.id}/profile`)
//       .then(res => setProfile(res.data))
//       .catch(console.error);
//   }, [user]);

//   if (!profile) return <p>Loading…</p>;
//   const { user: u, postCount, posts } = profile;

//   return (
//     <div className="p-8">
//       <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
//       <p className="mb-2">
//         <strong>Username:</strong> {profile.username}
//       </p>
//       <p className="mb-2">
//         <strong>Email:</strong> {profile.email}
//       </p>
//       {/* Add any other profile fields you like here */}

// <div className="profile-page">
//       <aside style={{ padding: "1rem", borderRight: "1px solid #444" }}>
//         <h2>{u.username}</h2>
//         <p>Joined: {new Date(u.createdAt).toLocaleDateString()}</p>
//         <p>Posts: {postCount}</p>
//       </aside>
//       <main style={{ padding: "1rem" }}>
//         <h3>{u.username}’s Posts</h3>
//         {posts.map(p => (
//           <PostCard key={p._id} post={p} />
//         ))}
//       </main>





//     </div>
//   );
// }






// // ProfilePage.jsx
// import React, { useEffect, useState } from "react";
// import { useAuth } from "../contexts/AuthContext";
// import api from "../services/api";
// import PostCard from "../components/PostCard";

// export default function ProfilePage() {
//   const { user } = useAuth();
//   const [profile, setProfile] = useState(null);

//   useEffect(() => {
//     if (!user || !user.id) return;

//     api.get(`/users/${user.id}/profile`)
//       .then(res => setProfile(res.data))
//       .catch(console.error);
//   }, [user]);

//   if (!profile) return <p>Loading…</p>;

//   const { user: u, postCount, posts } = profile;

//   return (
//     <div className="profile-page">
//       <aside style={{ padding: "1rem", borderRight: "1px solid #444" }}>
//         <h2>{u.username}</h2>
//         <p>Joined: {new Date(u.createdAt).toLocaleDateString()}</p>
//         <p>Posts: {postCount}</p>
//       </aside>
//       <main style={{ padding: "1rem" }}>
//         <h3>{u.username}’s Posts</h3>
//         {posts.map(p => (
//           <PostCard key={p._id} post={p} />
//         ))}
//       </main>
//     </div>
//   );
// }



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
