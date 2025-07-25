// server/routes/comments.js
import express from 'express';
import Comment from '../models/Comment.js';
import { auth as requireAuth } from '../middleware/auth.js';
import mongoose from 'mongoose';

const router = express.Router();

// GET /api/comments?postId=...
router.get('/', requireAuth, async (req, res) => {
  const { postId } = req.query;
  if (!postId) return res.status(400).json({ error: 'postId is required' });

  const comments = await Comment.find({ post: postId })
    .populate('author', 'username')
    .sort({ createdAt: 1 });
  res.json(comments);
});

// POST /api/comments
router.post('/', requireAuth, async (req, res) => {
  const { postId, content } = req.body;
  if (!postId || !content) {
    return res.status(400).json({ error: 'postId and content are required' });
  }

  const comment = new Comment({
    post: postId,
    author: req.userId,
    content,
  });
  await comment.save();
  const populated = await comment.populate('author', 'username');
  res.status(201).json(populated);
});

// PATCH /api/comments/:id
router.patch('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid comment ID' });
  }

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
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.author.toString() !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await comment.deleteOne(); // safer than .remove()
    res.json({ success: true });

  } catch (err) {
    console.error('❌ Error deleting comment:', err);
    res.status(500).json({ error: 'Server error' });
  }
});



export default router;
