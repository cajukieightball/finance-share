// server/routes/comments.js
import express from 'express';
import mongoose from 'mongoose';
import Comment from '../models/Comment.js';
import { auth as requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/comments?postId=...  — list comments for a post
router.get('/', requireAuth, async (req, res) => {
  const { postId } = req.query;
  if (!postId) return res.status(400).json({ error: 'postId is required' });

  try {
    const comments = await Comment.find({ post: postId })
      .populate('author', 'username')
      .sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) {
    console.error('Fetch comments error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/comments  — create a new comment
router.post('/', requireAuth, async (req, res) => {
  const { postId, content } = req.body;
  if (!postId || !content) {
    return res.status(400).json({ error: 'postId and content are required' });
  }

  try {
    const comment = new Comment({
      post: postId,
      author: req.userId,
      content,
    });
    await comment.save();
    const populated = await comment.populate('author', 'username');
    res.status(201).json(populated);
  } catch (err) {
    console.error('Create comment error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/comments/:id  — edit own comment
router.patch('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  // Validate ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid comment ID' });
  }

  try {
    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    if (comment.author.toString() !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    if (!content?.trim()) {
      return res.status(400).json({ error: 'Content required' });
    }

    comment.content = content;
    comment.updatedAt = new Date();
    await comment.save();
    await comment.populate('author', 'username');
    res.json(comment);
  } catch (err) {
    console.error('Update comment error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/comments/:id  — delete own comment
router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;

  // Validate ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid comment ID' });
  }

  try {
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    if (comment.author.toString() !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    await comment.deleteOne();
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Error deleting comment:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

