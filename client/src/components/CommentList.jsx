import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function CommentList({ postId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

  const fetchComments = async () => {
    const { data } = await api.get('/comments', { params: { postId } });
    setComments(data);
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSave = async id => {
    await api.patch(`/comments/${id}`, { content: editText });
    setEditId(null);
    fetchComments();
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this comment?')) return;
    await api.delete(`/comments/${id}`);
    fetchComments();
  };

  return (
    <div className="comment-list">
      {comments.map(c => (
        <div key={c._id} className="comment-item">
          <strong>{c.author.username}</strong>{' '}
          <em>{new Date(c.createdAt).toLocaleString()}</em>

          {editId === c._id ? (
            <>
              <textarea
                value={editText}
                onChange={e => setEditText(e.target.value)}
              />
              <button onClick={() => handleSave(c._id)}>Save</button>
              <button onClick={() => setEditId(null)}>Cancel</button>
            </>
          ) : (
            <p>{c.content}</p>
          )}

          {c.author._id === user._id && editId !== c._id && (
            <>
              <button onClick={() => {
                setEditId(c._id);
                setEditText(c.content);
              }}>
                ✏️
              </button>
              <button onClick={() => handleDelete(c._id)} style={{ color: 'red' }}>
                🗑️
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
