// server/routes/posts.js
import express from 'express';
import { auth } from '../middleware/auth.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import mongoose from 'mongoose';

const router = express.Router();



// GET /api/posts — list all posts with comment count
router.get('/', auth, async (_req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('author', 'username');

    // Add commentCount for each post
    const postsWithCounts = await Promise.all(
      posts.map(async (post) => {
        const commentCount = await Comment.countDocuments({ post: post._id });
        return {
          ...post.toObject(),
          commentCount,
        };
      })
    );

    res.json(postsWithCounts);
  } catch (err) {
    console.error('Fetch posts error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


//post
router.post('/', auth, async (req, res) => {
  try {
    const { content, tags = [] } = req.body;
    const post = new Post({ author: req.userId, content, tags, likes: [] });
    await post.save();

    // ✅ Populate author before returning
    const populatedPost = await post.populate('author', 'username');

    res.status(201).json(populatedPost);
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// POST /api/posts/:id/like — toggle like
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    const idx = post.likes.indexOf(req.userId);
    if (idx === -1) post.likes.push(req.userId);
    else post.likes.splice(idx, 1);
    await post.save();
    res.json({ likeCount: post.likes.length });
  } catch (err) {
    console.error('Like error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/posts/:id — update a post’s content and tags
router.patch('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post || post.author.toString() !== req.userId) {
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

// DELETE /api/posts/:id — delete own post
router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid post ID" });
  }

  const post = await Post.findById(id);
  if (!post) return res.status(404).json({ error: "Not found" });

  if (post.author.toString() !== req.userId) {
    return res.status(403).json({ error: "Forbidden" });
  }

  await post.deleteOne();
  res.json({ success: true });
});

export default router;



