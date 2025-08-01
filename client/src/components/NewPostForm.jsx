import React, { useState } from 'react';
import api from '../services/api';

export default function NewPostForm({ onPost }) {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const tagArray = tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    try {
      const { data: newPost } = await api.post('/posts', { content, tags: tagArray });
      onPost(newPost);
      setContent('');
      setTags('');
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };

  return (
    <form className="new-post-form" onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="What's on your mind?"
        required
      />
      <input
        type="text"
        value={tags}
        onChange={e => setTags(e.target.value)}
        placeholder="Tags (comma separated)"
      />
      <button type="submit">Post</button>
    </form>
  );
}
