// server/routes/posts.js
import express from 'express';
import mongoose from 'mongoose';
import { auth } from '../middleware/auth.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

const router = express.Router();

// GET /api/posts — list all posts, or filtered by tag
router.get('/', auth, async (req, res) => {
  try {
    const { tag } = req.query;
    const filter = tag ? { tags: tag } : {};

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .populate('author', 'username');

    const postsWithCounts = await Promise.all(
      posts.map(async (post) => {
        const count = await Comment.countDocuments({ post: post._id });
        return { ...post.toObject(), commentCount: count };
      })
    );

    res.json(postsWithCounts);
  } catch (err) {
    console.error('Fetch posts error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/posts/tags — return list of distinct tags
router.get('/tags', auth, async (_req, res) => {
  try {
    const tags = await Post.distinct('tags');
    res.json(tags);
  } catch (err) {
    console.error('Fetch tags error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/posts — create a new post
router.post('/', auth, async (req, res) => {
  try {
    const { content, tags = [] } = req.body;
    const post = new Post({ author: req.userId, content, tags, likes: [] });
    await post.save();

    const populated = await post.populate('author', 'username');
    res.status(201).json(populated);
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/posts/:id/like — toggle like
router.post('/:id/like', auth, async (req, res) => {
  console.log('=== Like Handler ===');
  console.log('User ID:', req.userId);
  console.log('Post ID:', req.params.id);

  try {
    const post = await Post.findById(req.params.id);
     console.log('Fetched post:', post);

    if (!post) {
      console.log('→ No post found, returning 404');
      return res.status(404).json({ error: 'Post not found' });
    } 

    const idx = post.likes.indexOf(req.userId);
     console.log('Existing likes:', post.likes, 'Index of user:', idx);

    if (idx === -1) {
      post.likes.push(req.userId);
      console.log('Pushed userId into likes:', post.likes);
    } else {
      post.likes.splice(idx, 1);
       console.log('Removed userId from likes:', post.likes);
    }

    const saved = await post.save();
    console.log('Saved post:', saved);

    res.json({ likeCount: post.likes.length });
  } catch (err) {
    console.error('Like error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/posts/:id — update own post
router.patch('/:id', auth, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid post ID' });
  }

  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { content, tags } = req.body;
    if (content !== undefined) post.content = content;
    if (tags !== undefined) post.tags = tags;
    await post.save();

    const populated = await post.populate('author', 'username');
    res.json(populated);
  } catch (err) {
    console.error('Update post error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/posts/:id — 
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid post ID' });
  }

  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    await post.deleteOne();
    res.json({ success: true });
  } catch (err) {
    console.error('Delete post error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
