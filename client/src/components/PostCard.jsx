// client/src/components/PostCard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import CommentList from './CommentList';
import NewCommentForm from './NewCommentForm';

export default function PostCard({ post, onCommentOrLike, onDeleted }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [editTags, setEditTags] = useState(post.tags.join(', '));
  const [commentKey, setCommentKey] = useState(0);

  const toggleComments = () => setShowComments(v => !v);

  async function handleLike() {
    await api.post(`/posts/${post._id}/like`);
    onCommentOrLike();
  }

  async function handleSave() {
    await api.patch(`/posts/${post._id}`, {
      content: editContent,
      tags: editTags.split(',').map(t => t.trim()).filter(Boolean),
    });
    setIsEditing(false);
    onCommentOrLike();
  }

  async function handleDelete() {
    if (!window.confirm('Delete this post?')) return;
    await api.delete(`/posts/${post._id}`);
    onDeleted(post._id);
  }

  function goToProfile() {
    if (post.author?._id) {
      navigate(`/profile?id=${post.author._id}`);
    }
  }

  function handleTagClick(tag) {
    navigate(`/feed?tag=${tag}`);
  }

  return (
    <div className="post-card">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <strong>{post.author?.username || 'Unknown'}</strong>{' '}
          <em>{new Date(post.createdAt).toLocaleString()}</em>
        </div>
        <button onClick={goToProfile} style={{ textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>
          View Profile
        </button>
      </div>

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div style={{ margin: '0.5rem 0' }}>
          {post.tags.map(tag => (
            <span
              key={tag}
              onClick={() => handleTagClick(tag)}
              style={{ cursor: 'pointer', marginRight: '0.5rem', color: '#646cff' }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Content or Edit Form */}
      {isEditing ? (
        <div style={{ marginBottom: '1rem' }}>
          <textarea
            value={editContent}
            onChange={e => setEditContent(e.target.value)}
            rows={3}
            style={{ width: '100%', marginBottom: '0.5rem' }}
          />
          <input
            value={editTags}
            onChange={e => setEditTags(e.target.value)}
            placeholder="Tags (comma-separated)"
            style={{ width: '100%', marginBottom: '0.5rem' }}
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <p style={{ whiteSpace: 'pre-wrap', marginBottom: '1rem' }}>{post.content}</p>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button onClick={handleLike}>❤️ {post.likes?.length || 0}</button>
        <button onClick={toggleComments}>💬 {post.commentCount || 0}</button>
        {post.author?._id === user?._id && !isEditing && (
          <>
            <button onClick={() => setIsEditing(true)}>✏️ Edit</button>
            <button onClick={handleDelete} style={{ color: 'red' }}>🗑️ Delete</button>
          </>
        )}
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="comment-section">
          <CommentList key={commentKey} postId={post._id} />
          <NewCommentForm
            postId={post._id}
            onComment={() => {
              setCommentKey(k => k + 1);
              onCommentOrLike();
            }}
          />
        </div>
      )}
    </div>
  );
}
