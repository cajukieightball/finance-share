import React, { useEffect, useState } from 'react';
import api from '../services/api';
import PostCard from '../components/PostCard';
import NewPostForm from '../components/NewPostForm';

export default function FeedPage() {
  const [posts, setPosts] = useState([]);

  // const loadPosts = async () => {
  //   const { data } = await api.get('/posts', { withCredentials: true });
  //   setPosts(data);
  // };

  const fetchPosts = async () => {
    const res = await api.get('/posts', { withCredentials: true });
    setPosts(res.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleNewPost = () => {
    fetchPosts();
  };

  const removeLocal = (id) => {
    setPosts((ps) => ps.filter((p) => p._id !== id));
  };


  return (
    <div className="feed-container">
      <h1>Your Feed</h1>
      <NewPostForm onPost={handleNewPost} />
      {posts.length === 0 && <p>No posts yet.</p>}
      {posts.map(post => (
        <PostCard
          key={post._id}
          post={post}
          onCommentOrLike={fetchPosts}
          onDeleted={removeLocal}
        />

      ))}
    </div>
  );
}
