import React, { useState } from 'react';
import CommentList from './CommentList';
import NewCommentForm from './NewCommentForm';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function PostCard({ post, onCommentOrLike }) {
  const { user } = useAuth(); // ✅ Safe and correct
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [editTags, setEditTags] = useState(post.tags.join(', '));
  const [commentKey, setCommentKey] = useState(0);

  const toggleComments = () => setShowComments(v => !v);

  const handleLike = async () => {
    await api.post(`/posts/${post._id}/like`, {}, { withCredentials: true });
    onCommentOrLike();
  };

  const handleSave = async () => {
    await api.patch(`/posts/${post._id}`, {
      content: editContent,
      tags: editTags.split(',').map(tag => tag.trim()),
    });
    setIsEditing(false);
    onCommentOrLike();
  };

  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/posts/${post._id}`);
      onCommentOrLike();
    } catch (err) {
      console.error('Error deleting post:', err);
    }
    setConfirmingDelete(false);
  };



  const authorName = post.author?.username || 'Unknown';

  return (
    <div className="post-card">
      <div className="post-header">
        <strong>{authorName}</strong>{' '}
        <em>{new Date(post.createdAt).toLocaleString()}</em>
      </div>

      {confirmingDelete && (
        <div className="modal">
          <p>Are you sure you want to delete this post?</p>
          <button onClick={handleDeleteConfirm}>Yes, delete</button>
          <button onClick={() => setConfirmingDelete(false)}>Cancel</button>
        </div>
      )}

      {isEditing ? (
        <div>
          <textarea
            value={editContent}
            onChange={e => setEditContent(e.target.value)}
          />
          <input
            value={editTags}
            onChange={e => setEditTags(e.target.value)}
            placeholder="Tags (comma-separated)"
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <>



          <p>{post.content}</p>
          {post.author?._id === user?._id && (
            <>
              <button onClick={() => setIsEditing(true)}>✏️ Edit</button>
              <button onClick={() => setConfirmingDelete(true)}>🗑️ Delete</button>
            </>
          )}
        </>
      )}

      <button onClick={handleLike}>❤️ {post.likes?.length || 0}</button>
      <button onClick={toggleComments}>💬 {post.commentCount || 0}</button>

      {showComments && (
        <div className="comment-section">
          <CommentList key={commentKey} postId={post._id} />
          <NewCommentForm
            postId={post._id}
            onComment={() => {
              setCommentKey(prev => prev + 1);
              onCommentOrLike();
            }}
          />
        </div>
      )}
    </div>
  );
}
