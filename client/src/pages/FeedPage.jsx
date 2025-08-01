import React, { useEffect, useState } from 'react';
import api from '../services/api';
import PostCard from '../components/PostCard';
import { useAuth } from '../contexts/AuthContext';

export default function FeedPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [content, setContent] = useState('');
  const [newTags, setNewTags] = useState('');

  const fetchPosts = async (tag = '') => {
    try {
      const res = await api.get(`/posts${tag ? `?tag=${tag}` : ''}`);
      setPosts(res.data);
    } catch (err) {
      console.error('Fetch posts error:', err);
    }
  };

  const fetchTags = async () => {
    try {
      const res = await api.get('/posts/tags');
      setTags(res.data);
    } catch (err) {
      console.error('Fetch tags error:', err);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchTags();
  }, []);

  const handleTagClick = (tag) => {
    setSelectedTag(tag);
    fetchPosts(tag);
  };

  const clearFilter = () => {
    setSelectedTag('');
    fetchPosts();
  };

  const handlePost = async () => {
    if (!content.trim()) return;
    try {
      await api.post('/posts', {
        content,
        tags: newTags
          .split(',')
          .map((t) => t.trim())
          .filter((t) => t.length > 0),
      });
      setContent('');
      setNewTags('');
      fetchPosts(selectedTag);
      fetchTags();
    } catch (err) {
      console.error('Create post error:', err);
      alert(err.response?.data?.error || 'Could not create post');
    }
  };

  return (
    <div className="feed-container">
      <h1>Your Feed</h1>

      {/* Tag Filter */}
      <div style={{ marginBottom: '1rem' }}>
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            style={{
              margin: '0.25rem',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              border: selectedTag === tag ? '2px solid white' : '1px solid gray',
              backgroundColor: selectedTag === tag ? '#444' : 'transparent',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            {tag}
          </button>
        ))}
        {selectedTag && (
          <button
            onClick={clearFilter}
            style={{
              marginLeft: '1rem',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              border: '1px solid red',
              backgroundColor: 'transparent',
              color: 'red',
              cursor: 'pointer',
            }}
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Post Input */}
      <div className="post-input-container">
        <textarea
          className="post-textarea"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input
          className="tag-input"
          type="text"
          placeholder="Tags (comma separated)"
          value={newTags}
          onChange={(e) => setNewTags(e.target.value)}
        />
        <button className="post-button" onClick={handlePost}>
          Post
        </button>
      </div>

      {/* Posts */}
      {posts.length === 0 && <p>No posts yet.</p>}
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          onCommentOrLike={() => fetchPosts(selectedTag)}
          onDeleted={(deletedId) =>
            setPosts((prev) => prev.filter((p) => p._id !== deletedId))
          }
        />
      ))}
    </div>
  );
}

