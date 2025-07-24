// server/routes/posts.js
import express from 'express';
import Post from '../models/Post.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET all posts
router.get('/', async (req, res) => {
  const posts = await Post.find()
    .populate('author', 'username')
    .sort({ createdAt: -1 });
  res.json(posts);
});

// POST a new post
router.post('/', requireAuth, async (req, res) => {
  const { content, tags = [] } = req.body;
  const post = new Post({ author: req.userId, content, tags });
  await post.save();
  res.status(201).json(post);
});

// PUT (update) a post
router.put('/:id', requireAuth, async (req, res) => {
  const { content, tags } = req.body;
  const post = await Post.findOneAndUpdate(
    { _id: req.params.id, author: req.userId },
    { content, tags, updatedAt: new Date() },
    { new: true }
  );
  if (!post) return res.status(404).json({ error: 'Post not found or unauthorized' });
  res.json(post);
});

// DELETE a post
router.delete('/:id', requireAuth, async (req, res) => {
  const result = await Post.deleteOne({ _id: req.params.id, author: req.userId });
  if (result.deletedCount === 0) return res.status(404).json({ error: 'Post not found or unauthorized' });
  res.sendStatus(204);
});

export default router;
